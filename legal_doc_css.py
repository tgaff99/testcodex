"""Professional BigLaw-style CSS generation for IDR documents."""

from __future__ import annotations

from textwrap import dedent


BASE_CSS = dedent(
    """
    :root {
      --idr-ink: #111;
      --idr-accent: #0B2A4A;
      --idr-rule: #D6D6D6;
      --idr-bg-soft: #F8FAFC;
    }

    body {
      font-family: Georgia, "Times New Roman", serif;
      color: var(--idr-ink);
      line-height: 1.55;
      font-size: 12pt;
      margin: 1in;
      -webkit-font-smoothing: antialiased;
    }

    h1, h2, h3, h4, h5 {
      font-family: Inter, "Helvetica Neue", Arial, sans-serif;
      color: var(--idr-accent);
      margin-top: 1.2em;
      margin-bottom: 0.45em;
      line-height: 1.25;
    }

    h1 { font-size: 19pt; border-bottom: 1px solid var(--idr-rule); padding-bottom: 0.24em; }
    h2 { font-size: 15pt; }
    h3 { font-size: 12.5pt; }

    p { margin: 0.45em 0 0.8em; }

    .executive-summary {
      background: var(--idr-bg-soft);
      border-left: 4px solid var(--idr-accent);
      border-radius: 6px;
      padding: 0.85em 1em;
      margin: 1em 0 1.3em;
    }

    .exhibit-tag {
      display: inline-block;
      font-family: Inter, Arial, sans-serif;
      font-size: 9.5pt;
      letter-spacing: 0.01em;
      text-transform: uppercase;
      background: #E9EEF5;
      color: var(--idr-accent);
      border-radius: 999px;
      padding: 0.1em 0.6em;
      margin-right: 0.2em;
    }

    .callout {
      border: 1px solid var(--idr-rule);
      border-left: 4px solid var(--idr-accent);
      border-radius: 4px;
      padding: 0.7em 0.9em;
      margin: 0.8em 0 1em;
      background: #fff;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.7em 0 1.2em;
      font-variant-numeric: tabular-nums;
    }

    th, td {
      text-align: left;
      border-bottom: 1px solid var(--idr-rule);
      padding: 0.4em 0.48em;
      vertical-align: top;
    }

    th {
      font-family: Inter, Arial, sans-serif;
      color: var(--idr-accent);
      font-size: 10.5pt;
      font-weight: 600;
    }

    .running-header,
    .running-footer {
      font-family: Inter, Arial, sans-serif;
      color: #333;
      font-size: 9pt;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid var(--idr-rule);
      padding-bottom: 0.22em;
      margin-bottom: 0.65em;
    }

    .running-footer {
      border-top: 1px solid var(--idr-rule);
      border-bottom: none;
      margin-top: 1em;
      padding-top: 0.3em;
      padding-bottom: 0;
    }

    .signature-block {
      margin-top: 2.4em;
      max-width: 20rem;
      border-top: 1px solid var(--idr-ink);
      padding-top: 0.45em;
    }

    @media print {
      @page {
        margin: 0.65in 0.75in;
      }

      body {
        margin: 0;
        font-size: 11pt;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .page-break {
        page-break-before: always;
      }

      .no-print {
        display: none !important;
      }
    }
    """
).strip()


VARIANT_OVERRIDES = {
    "cover_letter": dedent(
        """
        .doc-cover_letter h1 {
          font-size: 21pt;
          letter-spacing: 0.01em;
        }

        .doc-cover_letter .recipient-block {
          margin: 1.2em 0 1.5em;
          line-height: 1.45;
        }
        """
    ).strip(),
    "position_statement": dedent(
        """
        .doc-position_statement .argument-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.7em;
        }

        .doc-position_statement blockquote {
          margin: 0.8em 0;
          padding: 0.6em 0.9em;
          border-left: 3px solid var(--idr-rule);
          color: #272727;
          background: #FCFCFD;
        }
        """
    ).strip(),
    "evidence_packet": dedent(
        """
        .doc-evidence_packet .exhibit-index li {
          margin: 0.28em 0;
          padding-bottom: 0.24em;
          border-bottom: 1px dashed var(--idr-rule);
        }

        .doc-evidence_packet .timeline-item {
          border-left: 2px solid var(--idr-accent);
          padding-left: 0.7em;
          margin: 0.5em 0;
        }
        """
    ).strip(),
}


def get_legal_doc_css(doc_type: str | None = None) -> str:
    """Return professional IDR CSS, with optional document-specific variant overrides."""

    if not doc_type:
        return BASE_CSS
    return f"{BASE_CSS}\n\n{VARIANT_OVERRIDES.get(doc_type, '')}".strip()
