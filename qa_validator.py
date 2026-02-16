"""Quality assurance validator for IDR packet documents.

This module implements a 14-point gate for generated IDR documents.
Each gate returns PASS/FAIL with supporting details and an optional list
of issues discovered while validating.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
import re
from typing import Any, Dict, Iterable, List, Mapping, Sequence


class QAStatus(str, Enum):
    """Validation status for a QA check."""

    PASS = "PASS"
    FAIL = "FAIL"


@dataclass(frozen=True)
class QAResult:
    """Result for a single QA check."""

    check_number: int
    name: str
    status: QAStatus
    details: str
    issues: List[str] = field(default_factory=list)


@dataclass(frozen=True)
class QAValidationReport:
    """Full QA report for an IDR packet."""

    case_id: str
    passed: bool
    results: List[QAResult]


class QAValidator:
    """Run 14-point quality assurance checks for IDR documents.

    Expected input shape:
    {
        "canonical": {
            "case_id": str,
            "parties": {"provider": str, "payer": str, ...},
            "dates": {"dos": "YYYY-MM-DD", ...},
            "amounts": {"billed": 0.0, "allowed": 0.0, ...},
            "requested_determination": str,
            "qpa": {"amount": 0.0, "date": "YYYY-MM-DD"}
        },
        "documents": [
            {
                "doc_type": "cover_letter" | "position_statement" | ...,
                "title": str,
                "case_id": str,
                "parties": {...},
                "dates": {...},
                "amounts": {...},
                "requested_determination": str,
                "qpa": {...},
                "sections": [{"heading": str, "content": str}],
                "factual_claims": [{"claim": str, "exhibits": ["Exhibit A"]}],
                "citations": ["NSA §103(b)", "45 CFR §149.510"],
                "tables": [{"columns": [...], "rows": [[...]]}],
                "figures": [{"caption": str, "source": str}],
                "cross_refs": [{"document": "cover_letter", "field": "case_id", "value": "..."}],
                "language_flags": ["neutral"],
                "uncertainties": ["..."],
            }
        ]
    }
    """

    REQUIRED_STATUTES = (
        "NSA §103(b)",
        "45 CFR §149.510",
        "45 CFR §149.140",
    )

    REQUIRED_SECTIONS_BY_TYPE: Mapping[str, Sequence[str]] = {
        "cover_letter": (
            "Case Summary",
            "Requested Determination",
            "Attachments",
        ),
        "position_statement": (
            "Background",
            "Applicable Law",
            "Argument",
            "Requested Determination",
        ),
        "evidence_packet": (
            "Exhibit Index",
            "Claim Timeline",
            "Billing Detail",
        ),
    }

    MIN_SECTION_COUNT_BY_TYPE: Mapping[str, int] = {
        "cover_letter": 3,
        "position_statement": 4,
        "evidence_packet": 3,
        "default": 2,
    }

    INFLAMMATORY_TERMS = {
        "outrageous",
        "ridiculous",
        "fraudulent",
        "dishonest",
        "absurd",
        "bad faith",
    }

    def validate(self, packet: Mapping[str, Any]) -> QAValidationReport:
        """Validate a generated IDR packet and return a detailed report."""

        canonical: Dict[str, Any] = dict(packet.get("canonical") or {})
        case_id = str(canonical.get("case_id") or "UNKNOWN")
        documents: List[Dict[str, Any]] = [dict(doc) for doc in packet.get("documents") or []]

        checks = [
            self._check_case_identity,
            self._check_parties_roles,
            self._check_dates,
            self._check_money_math,
            self._check_offer_ask,
            self._check_qpa,
            self._check_factual_citations,
            self._check_statutory_citations,
            self._check_section_structure,
            self._check_cross_document_consistency,
            self._check_table_figure_integrity,
            self._check_required_sections,
            self._check_tone_compliance,
            self._check_uncertainty_disclosure,
        ]

        results = [check(canonical, documents) for check in checks]
        passed = all(result.status == QAStatus.PASS for result in results)
        return QAValidationReport(case_id=case_id, passed=passed, results=results)

    def _build_result(
        self,
        check_number: int,
        name: str,
        issues: Iterable[str],
        pass_details: str,
    ) -> QAResult:
        issues_list = list(issues)
        if issues_list:
            return QAResult(
                check_number=check_number,
                name=name,
                status=QAStatus.FAIL,
                details="; ".join(issues_list),
                issues=issues_list,
            )
        return QAResult(
            check_number=check_number,
            name=name,
            status=QAStatus.PASS,
            details=pass_details,
            issues=[],
        )

    def _check_case_identity(self, canonical: Mapping[str, Any], documents: Sequence[Mapping[str, Any]]) -> QAResult:
        case_id = canonical.get("case_id")
        issues = []
        if not case_id:
            issues.append("Canonical case_id is missing")
        for doc in documents:
            if doc.get("case_id") != case_id:
                issues.append(
                    f"{doc.get('doc_type', 'unknown')} case_id {doc.get('case_id')} != canonical {case_id}"
                )
        return self._build_result(1, "Canonical Case Identity Match", issues, "All documents match canonical case_id")

    def _check_parties_roles(self, canonical: Mapping[str, Any], documents: Sequence[Mapping[str, Any]]) -> QAResult:
        canonical_parties = canonical.get("parties") or {}
        issues = []
        for doc in documents:
            doc_parties = doc.get("parties") or {}
            for role, name in canonical_parties.items():
                if doc_parties.get(role) != name:
                    issues.append(
                        f"{doc.get('doc_type', 'unknown')} role {role} mismatch ({doc_parties.get(role)} != {name})"
                    )
        return self._build_result(2, "Parties & Roles Consistency", issues, "Parties and roles are aligned")

    def _check_dates(self, canonical: Mapping[str, Any], documents: Sequence[Mapping[str, Any]]) -> QAResult:
        canonical_dates = canonical.get("dates") or {}
        issues = []
        date_pattern = re.compile(r"^\d{4}-\d{2}-\d{2}$")

        for key, value in canonical_dates.items():
            if not isinstance(value, str) or not date_pattern.match(value):
                issues.append(f"Canonical date {key} has invalid format: {value}")

        for doc in documents:
            doc_dates = doc.get("dates") or {}
            for key, canonical_value in canonical_dates.items():
                if doc_dates.get(key) != canonical_value:
                    issues.append(
                        f"{doc.get('doc_type', 'unknown')} date {key} mismatch ({doc_dates.get(key)} != {canonical_value})"
                    )
        return self._build_result(3, "Date/DOS Integrity", issues, "Date values match canonical record")

    def _check_money_math(self, canonical: Mapping[str, Any], documents: Sequence[Mapping[str, Any]]) -> QAResult:
        issues = []
        canonical_amounts = canonical.get("amounts") or {}
        expected_total = sum(float(value) for value in canonical_amounts.values() if isinstance(value, (int, float)))

        for doc in documents:
            doc_amounts = doc.get("amounts") or {}
            for key, canonical_value in canonical_amounts.items():
                if key in doc_amounts and float(doc_amounts[key]) != float(canonical_value):
                    issues.append(
                        f"{doc.get('doc_type', 'unknown')} amount {key} mismatch ({doc_amounts[key]} != {canonical_value})"
                    )
            item_total = sum(float(value) for value in doc_amounts.values() if isinstance(value, (int, float)))
            declared_total = float(doc.get("amount_total", item_total))
            if round(item_total, 2) != round(declared_total, 2):
                issues.append(
                    f"{doc.get('doc_type', 'unknown')} amount_total mismatch ({declared_total} != {item_total})"
                )

        if documents:
            first_total = float(documents[0].get("canonical_amount_total", expected_total))
            if round(first_total, 2) != round(expected_total, 2):
                issues.append(f"Canonical amount total mismatch ({first_total} != {expected_total})")

        return self._build_result(4, "Money Math Reconciliation", issues, "Currency math reconciles across documents")

    def _check_offer_ask(self, canonical: Mapping[str, Any], documents: Sequence[Mapping[str, Any]]) -> QAResult:
        requested = canonical.get("requested_determination")
        issues = []
        if not requested:
            issues.append("Canonical requested_determination missing")
        for doc in documents:
            value = doc.get("requested_determination")
            if not value:
                issues.append(f"{doc.get('doc_type', 'unknown')} missing requested determination")
            elif value != requested:
                issues.append(f"{doc.get('doc_type', 'unknown')} requested determination mismatch")
        return self._build_result(5, "Offer/Ask Clarity", issues, "Requested determination is present and consistent")

    def _check_qpa(self, canonical: Mapping[str, Any], documents: Sequence[Mapping[str, Any]]) -> QAResult:
        canonical_qpa = canonical.get("qpa") or {}
        issues = []
        if "amount" not in canonical_qpa:
            issues.append("Canonical QPA amount missing")
        for doc in documents:
            doc_qpa = doc.get("qpa") or {}
            if doc_qpa.get("amount") != canonical_qpa.get("amount"):
                issues.append(f"{doc.get('doc_type', 'unknown')} QPA amount mismatch")
        return self._build_result(6, "QPA Presence & Alignment", issues, "QPA is present and aligned")

    def _check_factual_citations(self, canonical: Mapping[str, Any], documents: Sequence[Mapping[str, Any]]) -> QAResult:
        del canonical
        issues = []
        for doc in documents:
            for claim in doc.get("factual_claims") or []:
                exhibits = claim.get("exhibits") or []
                if not exhibits:
                    issues.append(
                        f"{doc.get('doc_type', 'unknown')} claim '{claim.get('claim', 'unknown')}' lacks exhibit reference"
                    )
        return self._build_result(7, "Citation Coverage for Factual Claims", issues, "All factual claims include exhibit support")

    def _check_statutory_citations(self, canonical: Mapping[str, Any], documents: Sequence[Mapping[str, Any]]) -> QAResult:
        del canonical
        issues = []
        found = set()
        for doc in documents:
            found.update(doc.get("citations") or [])
        missing = [citation for citation in self.REQUIRED_STATUTES if citation not in found]
        for citation in missing:
            issues.append(f"Missing required citation: {citation}")
        return self._build_result(8, "Statutory/Regulatory Citation Presence", issues, "All required statutes/regulations are cited")

    def _check_section_structure(self, canonical: Mapping[str, Any], documents: Sequence[Mapping[str, Any]]) -> QAResult:
        del canonical
        issues = []
        for doc in documents:
            doc_type = doc.get("doc_type", "default")
            minimum = self.MIN_SECTION_COUNT_BY_TYPE.get(doc_type, self.MIN_SECTION_COUNT_BY_TYPE["default"])
            section_count = len(doc.get("sections") or [])
            if section_count < minimum:
                issues.append(f"{doc_type} has {section_count} sections; requires at least {minimum}")
        return self._build_result(9, "Section Count & Structure", issues, "Section counts satisfy doc-type minimums")

    def _check_cross_document_consistency(self, canonical: Mapping[str, Any], documents: Sequence[Mapping[str, Any]]) -> QAResult:
        del canonical
        issues = []
        index = {doc.get("doc_type"): doc for doc in documents}
        for doc in documents:
            for ref in doc.get("cross_refs") or []:
                target = index.get(ref.get("document"))
                field = ref.get("field")
                expected = ref.get("value")
                if target is None:
                    issues.append(f"{doc.get('doc_type', 'unknown')} cross-ref target missing: {ref.get('document')}")
                elif target.get(field) != expected:
                    issues.append(
                        f"{doc.get('doc_type', 'unknown')} cross-ref mismatch for {ref.get('document')}.{field}"
                    )
        return self._build_result(10, "Internal Cross-Document Consistency", issues, "Cross-document references are consistent")

    def _check_table_figure_integrity(self, canonical: Mapping[str, Any], documents: Sequence[Mapping[str, Any]]) -> QAResult:
        del canonical
        issues = []
        for doc in documents:
            for i, table in enumerate(doc.get("tables") or []):
                columns = table.get("columns") or []
                for row_index, row in enumerate(table.get("rows") or []):
                    if len(row) != len(columns):
                        issues.append(
                            f"{doc.get('doc_type', 'unknown')} table {i} row {row_index} length mismatch"
                        )
            for i, figure in enumerate(doc.get("figures") or []):
                if not figure.get("caption") or not figure.get("source"):
                    issues.append(f"{doc.get('doc_type', 'unknown')} figure {i} missing caption or source")
        return self._build_result(11, "Table & Figure Integrity", issues, "Tables and figures are structurally complete")

    def _check_required_sections(self, canonical: Mapping[str, Any], documents: Sequence[Mapping[str, Any]]) -> QAResult:
        del canonical
        issues = []
        for doc in documents:
            doc_type = doc.get("doc_type", "")
            required = self.REQUIRED_SECTIONS_BY_TYPE.get(doc_type, ())
            headings = {section.get("heading") for section in (doc.get("sections") or [])}
            for section in required:
                if section not in headings:
                    issues.append(f"{doc_type} missing required section '{section}'")
        return self._build_result(12, "Required Document Sections Present", issues, "All required sections are present")

    def _check_tone_compliance(self, canonical: Mapping[str, Any], documents: Sequence[Mapping[str, Any]]) -> QAResult:
        del canonical
        issues = []
        for doc in documents:
            content = "\n".join((section.get("content") or "") for section in (doc.get("sections") or []))
            content_lower = content.lower()
            for term in self.INFLAMMATORY_TERMS:
                if term in content_lower:
                    issues.append(f"{doc.get('doc_type', 'unknown')} contains inflammatory term '{term}'")
            for flag in doc.get("language_flags") or []:
                if str(flag).lower() in {"inflammatory", "hostile"}:
                    issues.append(f"{doc.get('doc_type', 'unknown')} has disallowed language flag '{flag}'")
        return self._build_result(13, "Tone & Language Compliance", issues, "Language is professional and neutral")

    def _check_uncertainty_disclosure(self, canonical: Mapping[str, Any], documents: Sequence[Mapping[str, Any]]) -> QAResult:
        del canonical
        issues = []
        for doc in documents:
            confidence = doc.get("confidence")
            if confidence is None:
                issues.append(f"{doc.get('doc_type', 'unknown')} missing confidence score")
                continue
            if not 0 <= float(confidence) <= 1:
                issues.append(f"{doc.get('doc_type', 'unknown')} confidence score out of range: {confidence}")
            if float(confidence) < 0.9 and not (doc.get("uncertainties") or []):
                issues.append(
                    f"{doc.get('doc_type', 'unknown')} confidence below threshold without uncertainty disclosure"
                )
        return self._build_result(
            14,
            "Document-Confidence & Uncertainty Disclosure",
            issues,
            "Confidence values and uncertainty disclosures are complete",
        )
