import unittest

from idr_packet_generator import IDRPacketGenerator


class IDRPacketGeneratorTests(unittest.TestCase):
    def test_generator_includes_css_and_qa_report(self) -> None:
        generator = IDRPacketGenerator()
        packet = {
            "canonical": {
                "case_id": "IDR-1",
                "parties": {"provider": "A", "payer": "B"},
                "dates": {"dos": "2026-01-01"},
                "amounts": {"billed": 1000.0, "allowed": 800.0},
                "requested_determination": "Select provider offer.",
                "qpa": {"amount": 700.0},
            },
            "documents": [
                {
                    "doc_type": "cover_letter",
                    "case_id": "IDR-1",
                    "parties": {"provider": "A", "payer": "B"},
                    "dates": {"dos": "2026-01-01"},
                    "amounts": {"billed": 1000.0, "allowed": 800.0},
                    "amount_total": 1800.0,
                    "canonical_amount_total": 1800.0,
                    "requested_determination": "Select provider offer.",
                    "qpa": {"amount": 700.0},
                    "sections": [
                        {"heading": "Case Summary", "content": "Neutral"},
                        {"heading": "Requested Determination", "content": "Request"},
                        {"heading": "Attachments", "content": "Attachment"},
                    ],
                    "factual_claims": [{"claim": "Fact", "exhibits": ["Exhibit A"]}],
                    "citations": ["NSA §103(b)", "45 CFR §149.510", "45 CFR §149.140"],
                    "tables": [],
                    "figures": [],
                    "cross_refs": [],
                    "language_flags": ["neutral"],
                    "confidence": 0.95,
                    "uncertainties": [],
                }
            ],
        }

        generated = generator.generate_packet(packet)

        self.assertIn("global_css", generated)
        self.assertIn("css", generated["documents"][0])
        self.assertIn("qa_report", generated)
        self.assertIn("qa_passed", generated)


if __name__ == "__main__":
    unittest.main()
