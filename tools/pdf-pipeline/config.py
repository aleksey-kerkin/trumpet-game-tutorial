"""Shared paths and env for pdf-pipeline."""

from __future__ import annotations

import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_BOOKS_DIR = Path.home() / "Documents/Books/Trumpet/Dokshitser"
BOOKS_DIR = Path(os.environ.get("BOOKS_DIR", DEFAULT_BOOKS_DIR))

CH1_PDF = "T_Dokshitser_Sistema_komplexnykh_uprazhneniy_trubacha_ch_1_iz_4.pdf"

EXTRACTED_DIR = PROJECT_ROOT / "docs/extracted"
RAW_PAGES_DIR = EXTRACTED_DIR / "raw"
CH1_RAW_DIR = RAW_PAGES_DIR / "ch1"

RENDER_DPI = 300
TESSERACT_LANG = "rus+eng"
