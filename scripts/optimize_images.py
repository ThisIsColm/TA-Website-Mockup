#!/usr/bin/env python3
"""
Resize and compress team photos + contact image for web.

Your sources are very large (e.g. 4000×6000 team JPGs ~20MB each).
This script produces web-ready files sized for how they appear on the site.

Setup:
    cd /path/to/TA-Website-Mockup
    python3 -m venv .venv-images
    source .venv-images/bin/activate   # Windows: .venv-images\\Scripts\\activate
    pip install -r scripts/requirements.txt

Examples:
    # Preview what would happen (no files written)
    python scripts/optimize_images.py --dry-run

    # Write optimized copies (safe — originals untouched)
    python scripts/optimize_images.py

    # Replace originals in public/ (backs up to public/images/_originals_backup)
    python scripts/optimize_images.py --replace

    # Also emit WebP alongside JPEG (optional; site currently uses .jpg paths)
    python scripts/optimize_images.py --webp
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Missing dependency. Run: pip install -r scripts/requirements.txt", file=sys.stderr)
    sys.exit(1)

# Match display sizes on the About page (2:3 portraits, wide contact shot)
TEAM_MAX_WIDTH = 800
CONTACT_MAX_WIDTH = 1600
JPEG_QUALITY = 85
WEBP_QUALITY = 85


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def human_size(num_bytes: int) -> str:
    if num_bytes < 1024:
        return f"{num_bytes} B"
    if num_bytes < 1024 * 1024:
        return f"{num_bytes / 1024:.1f} KB"
    return f"{num_bytes / (1024 * 1024):.2f} MB"


def resize_image(img: Image.Image, max_width: int) -> Image.Image:
    w, h = img.size
    if w <= max_width:
        return img
    new_h = round(h * (max_width / w))
    return img.resize((max_width, new_h), Image.Resampling.LANCZOS)


def save_jpeg(img: Image.Image, dest: Path, quality: int) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    rgb = img.convert("RGB")
    rgb.save(
        dest,
        format="JPEG",
        quality=quality,
        optimize=True,
        progressive=True,
    )


def save_webp(img: Image.Image, dest: Path, quality: int) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, format="WEBP", quality=quality, method=6)


def process_file(
    src: Path,
    dest: Path,
    max_width: int,
    *,
    jpeg_quality: int,
    webp: bool,
    dry_run: bool,
) -> tuple[int, int] | None:
    if not src.is_file():
        print(f"  skip (not found): {src}")
        return None

    before = src.stat().st_size
    if dry_run:
        with Image.open(src) as img:
            out = resize_image(img, max_width)
            w, h = out.size
        print(f"  {src.name}: {human_size(before)} → ~{w}×{h}px (dry run)")
        return before, before

    with Image.open(src) as img:
        out = resize_image(img, max_width)
        save_jpeg(out, dest, jpeg_quality)
        if webp:
            save_webp(out, dest.with_suffix(".webp"), WEBP_QUALITY)

    after = dest.stat().st_size
    return before, after


def backup_sources(paths: list[Path], backup_root: Path, dry_run: bool) -> None:
    if dry_run:
        print(f"Would back up {len(paths)} file(s) to {backup_root}")
        return
    backup_root.mkdir(parents=True, exist_ok=True)
    for p in paths:
        rel = p.relative_to(repo_root() / "public" / "images")
        target = backup_root / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(p, target)


def main() -> None:
    parser = argparse.ArgumentParser(description="Optimize team + contact images for web.")
    parser.add_argument(
        "--team-dir",
        type=Path,
        default=repo_root() / "public" / "images" / "team",
        help="Folder with team *.jpg files",
    )
    parser.add_argument(
        "--contact",
        type=Path,
        default=repo_root() / "public" / "images" / "contact" / "fontaines.jpg",
        help="Contact section photo",
    )
    parser.add_argument(
        "--out-team-dir",
        type=Path,
        default=repo_root() / "public" / "images" / "team_optimized",
        help="Output folder when not using --replace",
    )
    parser.add_argument(
        "--out-contact",
        type=Path,
        default=repo_root() / "public" / "images" / "contact" / "fontaines_optimized.jpg",
        help="Output path when not using --replace",
    )
    parser.add_argument(
        "--replace",
        action="store_true",
        help="Overwrite originals (backs up to public/images/_originals_backup first)",
    )
    parser.add_argument(
        "--webp",
        action="store_true",
        help="Also write .webp versions next to each output",
    )
    parser.add_argument(
        "--team-max-width",
        type=int,
        default=TEAM_MAX_WIDTH,
        help=f"Max width for team portraits (default {TEAM_MAX_WIDTH})",
    )
    parser.add_argument(
        "--contact-max-width",
        type=int,
        default=CONTACT_MAX_WIDTH,
        help=f"Max width for contact photo (default {CONTACT_MAX_WIDTH})",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=JPEG_QUALITY,
        help=f"JPEG quality 1–95 (default {JPEG_QUALITY})",
    )
    parser.add_argument("--dry-run", action="store_true", help="Print plan only")
    args = parser.parse_args()

    team_sources = sorted(args.team_dir.glob("*.jpg")) + sorted(args.team_dir.glob("*.JPG"))
    # Deduplicate case-insensitive filesystems
    seen: set[str] = set()
    team_files: list[Path] = []
    for p in team_sources:
        key = p.name.lower()
        if key not in seen:
            seen.add(key)
            team_files.append(p)

    if not team_files:
        print(f"No .jpg files in {args.team_dir}", file=sys.stderr)

    backup_root = repo_root() / "public" / "images" / "_originals_backup"
    to_backup: list[Path] = list(team_files)
    if args.contact.is_file():
        to_backup.append(args.contact)

    if args.replace and to_backup:
        print(f"Backing up originals to {backup_root} …")
        backup_sources(to_backup, backup_root, args.dry_run)

    total_before = 0
    total_after = 0
    count = 0

    print(f"\nTeam photos ({len(team_files)} files, max width {args.team_max_width}px)")
    for src in team_files:
        dest = src if args.replace else args.out_team_dir / src.name
        result = process_file(
            src,
            dest,
            args.team_max_width,
            jpeg_quality=args.quality,
            webp=args.webp,
            dry_run=args.dry_run,
        )
        if result:
            b, a = result
            total_before += b
            total_after += a if not args.dry_run else b
            count += 1
            if not args.dry_run:
                print(f"  {src.name}: {human_size(b)} → {human_size(a)}")

    if args.contact.is_file():
        contact_dest = (
            args.contact
            if args.replace
            else args.out_contact
        )
        print(f"\nContact photo (max width {args.contact_max_width}px)")
        result = process_file(
            args.contact,
            contact_dest,
            args.contact_max_width,
            jpeg_quality=args.quality,
            webp=args.webp,
            dry_run=args.dry_run,
        )
        if result:
            b, a = result
            total_before += b
            total_after += a if not args.dry_run else b
            count += 1
            if not args.dry_run:
                print(f"  {args.contact.name}: {human_size(b)} → {human_size(a)}")
    else:
        print(f"\nContact photo not found: {args.contact}", file=sys.stderr)

    print("\n---")
    if args.dry_run:
        print("Dry run only. Re-run without --dry-run to write files.")
    elif args.replace:
        print(f"Replaced {count} file(s). Originals backed up under public/images/_originals_backup/")
        print(f"Total: {human_size(total_before)} → {human_size(total_after)}")
    else:
        print(f"Wrote {count} optimized file(s).")
        print(f"Total: {human_size(total_before)} → {human_size(total_after)}")
        print(f"\nTeam output:   {args.out_team_dir}")
        print(f"Contact output: {args.out_contact}")
        print("\nWhen happy with quality, either:")
        print("  • Run again with --replace, or")
        print("  • Copy optimized files over the originals manually.")


if __name__ == "__main__":
    main()
