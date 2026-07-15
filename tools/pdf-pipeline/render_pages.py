"""Render PDF pages to PNG via pdftoppm."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

from config import BOOKS_DIR, CH1_PDF, CH1_RAW_DIR, RENDER_DPI


def render_pdf(pdf_path: Path, output_dir: Path, dpi: int = RENDER_DPI) -> list[Path]:
    if not shutil.which("pdftoppm"):
        raise RuntimeError("pdftoppm not found. Install poppler-utils.")

    if not pdf_path.is_file():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    output_dir.mkdir(parents=True, exist_ok=True)
    prefix = output_dir / "page"

    subprocess.run(
        [
            "pdftoppm",
            "-png",
            "-r",
            str(dpi),
            str(pdf_path),
            str(prefix),
        ],
        check=True,
    )

    pages = sorted(output_dir.glob("page-*.png"))
    print(f"Rendered {len(pages)} pages to {output_dir}")
    return pages


def main() -> int:
    parser = argparse.ArgumentParser(description="Render PDF pages to PNG")
    parser.add_argument(
        "--pdf",
        type=Path,
        default=BOOKS_DIR / CH1_PDF,
        help="Path to PDF file",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=CH1_RAW_DIR,
        help="Output directory for PNG pages",
    )
    parser.add_argument("--dpi", type=int, default=RENDER_DPI)
    args = parser.parse_args()

    try:
        render_pdf(args.pdf, args.out, args.dpi)
    except (RuntimeError, FileNotFoundError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
