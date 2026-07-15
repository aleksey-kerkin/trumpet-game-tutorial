#!/usr/bin/env python3
"""Run full Phase 0 pipeline for Dokshitser Sistema ch.1."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from config import BOOKS_DIR, CH1_PDF, CH1_RAW_DIR, EXTRACTED_DIR


def run_step(label: str, args: list[str]) -> bool:
    print(f"\n=== {label} ===")
    result = subprocess.run(args, cwd=Path(__file__).parent)
    if result.returncode != 0:
        print(f"Step failed: {label}", file=sys.stderr)
        return False
    return True


def main() -> int:
    pdf = BOOKS_DIR / CH1_PDF
    print(f"BOOKS_DIR={BOOKS_DIR}")
    print(f"PDF={pdf}")

    if not pdf.is_file():
        print(f"Error: PDF not found at {pdf}", file=sys.stderr)
        return 1

    py = sys.executable
    pipeline_dir = Path(__file__).parent

    if not run_step("Render pages", [py, str(pipeline_dir / "render_pages.py")]):
        return 1

    classification = EXTRACTED_DIR / "ch1-classification.json"
    if not run_step(
        "Classify pages",
        [py, str(pipeline_dir / "classify_pages.py"), "--json", str(classification)],
    ):
        return 1

    if not run_step("OCR text pages", [py, str(pipeline_dir / "ocr_text.py")]):
        print(
            "\nOCR skipped or failed (tesseract missing?). "
            "Install tesseract and re-run: python ocr_text.py",
            file=sys.stderr,
        )
        return 0

    print("\nDone. See docs/extracted/ch1-outline.md")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
