# PDF pipeline (Phase 0)

Local scripts to process Dokshitser scan PDFs. Not part of the PWA.

## Prerequisites

```bash
# System (Fedora)
sudo dnf install poppler-utils tesseract tesseract-langpack-rus tesseract-langpack-eng

# Python venv
cd tools/pdf-pipeline
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Environment

```bash
export BOOKS_DIR=/home/st0rmaen/Documents/Books/Trumpet/Dokshitser
```

## Run chapter 1 pipeline

```bash
cd tools/pdf-pipeline
source .venv/bin/activate
python run_ch1.py
```

Or step by step:

```bash
python render_pages.py          # PNG → .cursor/docs/extracted/raw/ch1/
python classify_pages.py --json ../../.cursor/docs/extracted/ch1-classification.json
python ocr_text.py              # → .cursor/docs/extracted/ch1-outline.md
```

## Outputs (gitignored)

| File | Description |
|------|-------------|
| `.cursor/docs/extracted/raw/ch1/page-*.png` | 300 dpi renders |
| `.cursor/docs/extracted/ch1-classification.json` | text vs notation |
| `.cursor/docs/extracted/ch1-ocr.txt` | raw OCR text |
| `.cursor/docs/extracted/ch1-outline.md` | headings + OCR draft |

Curriculum map (30 quests): `.cursor/docs/quest-map-30.md`
