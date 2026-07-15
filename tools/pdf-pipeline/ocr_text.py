"""OCR text pages with Tesseract (rus+eng)."""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from pathlib import Path

from config import CH1_RAW_DIR, EXTRACTED_DIR, TESSERACT_LANG
from postprocess import extract_headings, postprocess_ocr


def require_tesseract() -> str:
    binary = shutil.which("tesseract")
    if not binary:
        raise RuntimeError(
            "tesseract not found. Install:\n"
            "  Fedora: sudo dnf install tesseract tesseract-langpack-rus tesseract-langpack-eng\n"
            "  Debian: sudo apt install tesseract-ocr tesseract-ocr-rus"
        )
    return binary


def ocr_image(image_path: Path, lang: str = TESSERACT_LANG) -> str:
    import pytesseract
    from PIL import Image

    require_tesseract()
    with Image.open(image_path) as img:
        raw = pytesseract.image_to_string(img, lang=lang)
    return postprocess_ocr(raw)


def ocr_directory(
    pages_dir: Path,
    output_txt: Path,
    output_outline: Path,
    page_filter: str | None = "text",
    classification_json: Path | None = None,
) -> None:
    pages = sorted(pages_dir.glob("page-*.png"))
    if not pages:
        raise FileNotFoundError(f"No PNG pages in {pages_dir}. Run render_pages.py first.")

    allowed: set[str] | None = None
    if page_filter and classification_json and classification_json.is_file():
        import json

        data = json.loads(classification_json.read_text(encoding="utf-8"))
        allowed = {row["file"] for row in data if row["type"] in {page_filter, "mixed"}}

    chunks: list[str] = []
    all_headings: list[str] = []

    for index, page in enumerate(pages, start=1):
        if allowed is not None and page.name not in allowed:
            print(f"Skip {page.name} (classification)")
            continue

        print(f"OCR {page.name}...")
        text = ocr_image(page)
        chunks.append(f"## Страница {index}\n\n{text}")
        all_headings.extend(extract_headings(text))

    combined = "\n\n---\n\n".join(chunks)
    output_txt.parent.mkdir(parents=True, exist_ok=True)
    output_txt.write_text(combined, encoding="utf-8")
    print(f"Wrote {output_txt}")

    unique_headings = _clean_headings(list(dict.fromkeys(all_headings)))
    outline_lines = [
        "# OCR outline — Система комплексных упражнений, глава 1",
        "",
        "> **Статус:** OCR выполнен (Tesseract 5, `rus+eng`). Черновик для дизайна курса.",
        "> Полный сырой текст: [`ch1-ocr.txt`](ch1-ocr.txt) (не публиковать дословно).",
        "",
        f"**Страниц обработано:** {len(chunks)}",
        "",
        "## Обнаруженные разделы (OCR)",
        "",
    ]
    if unique_headings:
        outline_lines.extend(f"- {h}" for h in unique_headings)
    else:
        outline_lines.append("_Заголовки не распознаны — см. ch1-ocr.txt_")

    outline_lines.extend(
        [
            "",
            "## Ключевые выводы для игры",
            "",
            "См. структурированный пересказ ниже и [`quest-map-30.md`](../quest-map-30.md).",
        ]
    )
    output_outline.write_text("\n".join(outline_lines), encoding="utf-8")
    print(f"Wrote {output_outline}")


def _clean_headings(headings: list[str]) -> list[str]:
    cleaned: list[str] = []
    for heading in headings:
        line = heading.strip()
        if len(line) < 6 or len(line) > 80:
            continue
        if any(ch in line for ch in "|`"):
            continue
        if re.match(r"^[a-zA-Z\s]+$", line):
            continue
        if line in cleaned:
            continue
        cleaned.append(line)
    return cleaned


def main() -> int:
    parser = argparse.ArgumentParser(description="OCR rendered PNG pages")
    parser.add_argument("--dir", type=Path, default=CH1_RAW_DIR)
    parser.add_argument(
        "--txt",
        type=Path,
        default=EXTRACTED_DIR / "ch1-ocr.txt",
    )
    parser.add_argument(
        "--outline",
        type=Path,
        default=EXTRACTED_DIR / "ch1-outline.md",
    )
    parser.add_argument(
        "--classification",
        type=Path,
        default=EXTRACTED_DIR / "ch1-classification.json",
    )
    parser.add_argument(
        "--all-pages",
        action="store_true",
        help="OCR every page (ignore classification filter)",
    )
    args = parser.parse_args()

    try:
        ocr_directory(
            args.dir,
            args.txt,
            args.outline,
            page_filter=None if args.all_pages else "text",
            classification_json=args.classification,
        )
    except (RuntimeError, FileNotFoundError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
