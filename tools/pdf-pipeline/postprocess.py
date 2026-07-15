"""Post-process OCR text: fix line breaks, common scan artifacts."""

from __future__ import annotations

import re


def postprocess_ocr(text: str) -> str:
    text = text.replace("\x0c", "\n")
    text = text.replace("Ё", "Е").replace("ё", "е")

    lines = [line.rstrip() for line in text.splitlines()]
    merged: list[str] = []
    buffer = ""

    for line in lines:
        stripped = line.strip()
        if not stripped:
            if buffer:
                merged.append(buffer)
                buffer = ""
            merged.append("")
            continue

        if buffer and not buffer.endswith(("-", "—", ",")):
            buffer += " "
        buffer += stripped.rstrip("-—")

    if buffer:
        merged.append(buffer)

    text = "\n".join(merged)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


def extract_headings(text: str) -> list[str]:
    """Heuristic: lines that look like section titles in Cyrillic."""
    headings: list[str] = []
    for line in text.splitlines():
        candidate = line.strip()
        if not candidate or len(candidate) < 4 or len(candidate) > 120:
            continue
        if not re.search(r"[А-Яа-я]", candidate):
            continue
        if re.match(r"^\d+[\.\)]\s", candidate):
            headings.append(candidate)
            continue
        if candidate.isupper() and len(candidate.split()) <= 12:
            headings.append(candidate)
            continue
        if re.match(r"^[А-ЯЁ][а-яё]+(\s+[а-яё]+){0,8}$", candidate) and len(candidate) < 60:
            headings.append(candidate)
    return headings
