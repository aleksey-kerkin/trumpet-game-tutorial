"""Classify rendered pages as text-heavy vs notation-heavy."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from config import CH1_RAW_DIR
from PIL import Image


def black_pixel_ratio(image_path: Path, threshold: int = 128) -> float:
    with Image.open(image_path) as img:
        gray = img.convert("L")
        pixels = gray.get_flattened_data()
    dark = sum(1 for p in pixels if p < threshold)
    return dark / len(pixels)


def classify_page(ratio: float) -> str:
    # Scans: dense horizontal staff lines => higher black ratio
    if ratio > 0.14:
        return "notation"
    if ratio > 0.06:
        return "mixed"
    return "text"


def classify_directory(pages_dir: Path) -> list[dict]:
    results: list[dict] = []
    for page in sorted(pages_dir.glob("page-*.png")):
        ratio = black_pixel_ratio(page)
        results.append(
            {
                "file": page.name,
                "black_ratio": round(ratio, 4),
                "type": classify_page(ratio),
            }
        )
    return results


def main() -> int:
    parser = argparse.ArgumentParser(description="Classify PDF page renders")
    parser.add_argument("--dir", type=Path, default=CH1_RAW_DIR)
    parser.add_argument("--json", type=Path, default=None, help="Write JSON report")
    args = parser.parse_args()

    if not args.dir.is_dir():
        print(f"Error: directory not found: {args.dir}", file=sys.stderr)
        return 1

    results = classify_directory(args.dir)
    for row in results:
        print(f"{row['file']}: {row['type']} (black={row['black_ratio']})")

    if args.json:
        args.json.parent.mkdir(parents=True, exist_ok=True)
        args.json.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Wrote {args.json}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
