import copy
import unittest

from qa_validator import QAStatus, QAValidator


class QAValidatorTests(unittest.TestCase):
    def setUp(self) -> None:
        self.validator = QAValidator()
        self.valid_packet = {
            "canonical": {
                "case_id": "IDR-2026-0001",
                "parties": {
                    "provider": "Northwind Emergency Physicians",
                    "payer": "Apex Health Plan",
                },
                "dates": {
                    "dos": "2026-01-10",
                    "service_date": "2026-01-10",
                },
                "amounts": {
                    "billed": 1500.00,
                    "allowed": 1100.00,
                },
                "requested_determination": "Select provider offer amount of $1,500.00",
                "qpa": {
                    "amount": 920.00,
                    "date": "2026-01-20",
                },
            },
            "documents": [
                {
                    "doc_type": "cover_letter",
                    "title": "IDR Cover Letter",
                    "case_id": "IDR-2026-0001",
                    "parties": {
                        "provider": "Northwind Emergency Physicians",
                        "payer": "Apex Health Plan",
                    },
                    "dates": {
                        "dos": "2026-01-10",
                        "service_date": "2026-01-10",
                    },
                    "amounts": {
                        "billed": 1500.00,
                        "allowed": 1100.00,
                    },
                    "amount_total": 2600.00,
                    "canonical_amount_total": 2600.00,
                    "requested_determination": "Select provider offer amount of $1,500.00",
                    "qpa": {
                        "amount": 920.00,
                        "date": "2026-01-20",
                    },
                    "sections": [
                        {"heading": "Case Summary", "content": "Summary text."},
                        {"heading": "Requested Determination", "content": "Request text."},
                        {"heading": "Attachments", "content": "Attachment list."},
                    ],
                    "factual_claims": [
                        {"claim": "Claim was emergency care.", "exhibits": ["Exhibit A"]}
                    ],
                    "citations": ["NSA §103(b)", "45 CFR §149.510", "45 CFR §149.140"],
                    "tables": [
                        {
                            "columns": ["Code", "Amount"],
                            "rows": [["99285", "1500.00"]],
                        }
                    ],
                    "figures": [
                        {"caption": "Timeline", "source": "Exhibit B"},
                    ],
                    "cross_refs": [
                        {
                            "document": "position_statement",
                            "field": "case_id",
                            "value": "IDR-2026-0001",
                        }
                    ],
                    "language_flags": ["neutral"],
                    "confidence": 0.95,
                    "uncertainties": [],
                },
                {
                    "doc_type": "position_statement",
                    "title": "Provider Position Statement",
                    "case_id": "IDR-2026-0001",
                    "parties": {
                        "provider": "Northwind Emergency Physicians",
                        "payer": "Apex Health Plan",
                    },
                    "dates": {
                        "dos": "2026-01-10",
                        "service_date": "2026-01-10",
                    },
                    "amounts": {
                        "billed": 1500.00,
                        "allowed": 1100.00,
                    },
                    "amount_total": 2600.00,
                    "requested_determination": "Select provider offer amount of $1,500.00",
                    "qpa": {
                        "amount": 920.00,
                        "date": "2026-01-20",
                    },
                    "sections": [
                        {"heading": "Background", "content": "Neutral background."},
                        {"heading": "Applicable Law", "content": "Law text."},
                        {"heading": "Argument", "content": "Argument text."},
                        {"heading": "Requested Determination", "content": "Request text."},
                    ],
                    "factual_claims": [
                        {"claim": "Provider billed usual rate.", "exhibits": ["Exhibit C"]}
                    ],
                    "citations": ["NSA §103(b)", "45 CFR §149.510", "45 CFR §149.140"],
                    "tables": [],
                    "figures": [],
                    "cross_refs": [
                        {
                            "document": "cover_letter",
                            "field": "case_id",
                            "value": "IDR-2026-0001",
                        }
                    ],
                    "language_flags": ["neutral"],
                    "confidence": 0.87,
                    "uncertainties": ["QPA source data excludes post-service contract amendments."],
                },
                {
                    "doc_type": "evidence_packet",
                    "title": "Evidence Packet",
                    "case_id": "IDR-2026-0001",
                    "parties": {
                        "provider": "Northwind Emergency Physicians",
                        "payer": "Apex Health Plan",
                    },
                    "dates": {
                        "dos": "2026-01-10",
                        "service_date": "2026-01-10",
                    },
                    "amounts": {
                        "billed": 1500.00,
                        "allowed": 1100.00,
                    },
                    "amount_total": 2600.00,
                    "requested_determination": "Select provider offer amount of $1,500.00",
                    "qpa": {
                        "amount": 920.00,
                        "date": "2026-01-20",
                    },
                    "sections": [
                        {"heading": "Exhibit Index", "content": "Index text."},
                        {"heading": "Claim Timeline", "content": "Timeline text."},
                        {"heading": "Billing Detail", "content": "Billing text."},
                    ],
                    "factual_claims": [
                        {"claim": "EOB confirms underpayment.", "exhibits": ["Exhibit D"]}
                    ],
                    "citations": ["NSA §103(b)", "45 CFR §149.510", "45 CFR §149.140"],
                    "tables": [
                        {
                            "columns": ["Metric", "Value"],
                            "rows": [["QPA", "920.00"], ["Offer", "1500.00"]],
                        }
                    ],
                    "figures": [
                        {"caption": "Billing trend", "source": "Exhibit E"},
                    ],
                    "cross_refs": [
                        {
                            "document": "cover_letter",
                            "field": "case_id",
                            "value": "IDR-2026-0001",
                        }
                    ],
                    "language_flags": ["neutral"],
                    "confidence": 0.92,
                    "uncertainties": [],
                },
            ],
        }

    def test_validate_happy_path_passes_all_checks(self) -> None:
        report = self.validator.validate(self.valid_packet)

        self.assertTrue(report.passed)
        self.assertEqual(14, len(report.results))
        self.assertTrue(all(result.status == QAStatus.PASS for result in report.results))

    def test_each_check_can_fail(self) -> None:
        failure_mutations = {
            1: lambda p: p["documents"][0].update({"case_id": "IDR-2026-9999"}),
            2: lambda p: p["documents"][1]["parties"].update({"payer": "Wrong Plan"}),
            3: lambda p: p["documents"][1]["dates"].update({"dos": "2026-01-11"}),
            4: lambda p: p["documents"][0].update({"amount_total": 999.0}),
            5: lambda p: p["documents"][0].update({"requested_determination": "Different ask"}),
            6: lambda p: p["documents"][2]["qpa"].update({"amount": 901.0}),
            7: lambda p: p["documents"][1]["factual_claims"].append({"claim": "Uncited fact", "exhibits": []}),
            8: lambda p: [doc.update({"citations": ["NSA §103(b)"]}) for doc in p["documents"]],
            9: lambda p: p["documents"][2].update({"sections": [{"heading": "Exhibit Index", "content": "Only one"}]}),
            10: lambda p: p["documents"][0].update({"cross_refs": [{"document": "position_statement", "field": "case_id", "value": "DIFF"}]}),
            11: lambda p: p["documents"][2].update({"tables": [{"columns": ["A", "B"], "rows": [["only-one"]]}]}),
            12: lambda p: p["documents"][1].update({"sections": [{"heading": "Background", "content": "X"}]}),
            13: lambda p: p["documents"][1].update({"sections": [{"heading": "Argument", "content": "This is outrageous conduct."}]}),
            14: lambda p: p["documents"][1].update({"confidence": 0.8, "uncertainties": []}),
        }

        for check_number, mutator in failure_mutations.items():
            with self.subTest(check=check_number):
                packet = copy.deepcopy(self.valid_packet)
                mutator(packet)
                report = self.validator.validate(packet)

                failing = [r for r in report.results if r.status == QAStatus.FAIL]
                self.assertTrue(any(r.check_number == check_number for r in failing))


if __name__ == "__main__":
    unittest.main()
