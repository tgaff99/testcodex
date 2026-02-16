"""IDR packet generator with QA validation and professional styling support."""

from __future__ import annotations

from dataclasses import asdict
from typing import Any, Dict, Mapping

from legal_doc_css import get_legal_doc_css
from qa_validator import QAValidationReport, QAValidator


class IDRPacketGenerator:
    """Generate packet payloads, render CSS, and run post-generation QA checks."""

    def __init__(self, validator: QAValidator | None = None) -> None:
        self.validator = validator or QAValidator()

    def generate_packet(self, packet_input: Mapping[str, Any]) -> Dict[str, Any]:
        """Generate packet output enriched with CSS and QA report.

        The generator assumes the caller provides document content. This method
        normalizes output by injecting per-document CSS and running the full
        14-point QA gate after packet assembly.
        """

        canonical = dict(packet_input.get("canonical") or {})
        documents = []
        for raw_doc in packet_input.get("documents") or []:
            doc = dict(raw_doc)
            doc_type = doc.get("doc_type")
            doc["css"] = get_legal_doc_css(doc_type)
            documents.append(doc)

        assembled_packet: Dict[str, Any] = {
            "canonical": canonical,
            "documents": documents,
            "global_css": get_legal_doc_css(),
        }

        qa_report = self.validator.validate(assembled_packet)
        assembled_packet["qa_report"] = _report_to_dict(qa_report)
        assembled_packet["qa_passed"] = qa_report.passed
        return assembled_packet


def _report_to_dict(report: QAValidationReport) -> Dict[str, Any]:
    payload = asdict(report)
    payload["results"] = [
        {
            **result,
            "status": result["status"],
        }
        for result in payload["results"]
    ]
    return payload
