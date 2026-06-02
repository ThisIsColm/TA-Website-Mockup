#!/usr/bin/env python3
"""
Resize and compress team photos (including tape overlays) + contact image for web.

Your sources are very large (e.g. 4000×6000 team JPGs/PNGs, 2700×4100 tape PNGs).
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
    python scripts/optimize_images.py --webp

    # Replace originals in public/ (backs up to public/images/_originals_backup)
    python scripts/optimize_images.py --replace --webp
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
TAPE_MAX_WIDTH = 800
CONTACT_MAX_WIDTH = 1600
JPEG_QUALITY = 85
WEBP_QUALITY = 85
PNG_COMPRESS_LEVEL = 9

RASTER_SUFFIXES = {".jpg", ".jpeg", ".png"}


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def resolve_in_repo(path: Path) -> Path:
    """Resolve CLI paths relative to repo root (not only the shell cwd)."""
    if path.is_absolute():
        return path.resolve()
    return (repo_root() / path).resolve()


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


def save_png(img: Image.Image, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(
        dest,
        format="PNG",
        optimize=True,
        compress_level=PNG_COMPRESS_LEVEL,
    )


def save_webp(img: Image.Image, dest: Path, quality: int) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, format="WEBP", quality=quality, method=6)


def collect_team_sources(team_dir: Path) -> list[tuple[Path, int, str]]:
    """Return (source path, max width, label) for team portraits and tape overlays."""
    entries: list[tuple[Path, int, str]] = []
    seen: set[str] = set()

    def add(path: Path, max_width: int, label: str) -> None:
        key = str(path.resolve()).lower()
        if key in seen or not path.is_file():
            return
        if path.suffix.lower() not in RASTER_SUFFIXES:
            return
        seen.add(key)
        entries.append((path, max_width, label))

    for pattern in ("*.jpg", "*.JPG", "*.jpeg", "*.JPEG", "*.png", "*.PNG"):
        for path in sorted(team_dir.glob(pattern)):
            add(path, TEAM_MAX_WIDTH, "portrait")

    tape_dir = team_dir / "tape"
    if tape_dir.is_dir():
        for pattern in ("*.png", "*.PNG"):
            for path in sorted(tape_dir.glob(pattern)):
                add(path, TAPE_MAX_WIDTH, "tape")

    return entries


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
    suffix = src.suffix.lower()

    if dry_run:
        with Image.open(src) as img:
            out = resize_image(img, max_width)
            w, h = out.size
        try:
            rel_name = src.relative_to(src.parents[2 if src.parent.name == "tape" else 1])
        except ValueError:
            rel_name = src.name
        print(f"  {rel_name}: {human_size(before)} → ~{w}×{h}px (dry run)")
        return before, before

    with Image.open(src) as img:
        out = resize_image(img, max_width)
        if suffix in {".jpg", ".jpeg"}:
            save_jpeg(out, dest, jpeg_quality)
        else:
            save_png(out, dest)
        if webp:
            save_webp(out, dest.with_suffix(".webp"), WEBP_QUALITY)

    after = dest.stat().st_size
    if webp:
        webp_path = dest.with_suffix(".webp")
        if webp_path.is_file():
            after += webp_path.stat().st_size

    return before, after


def backup_sources(paths: list[Path], backup_root: Path, dry_run: bool) -> None:
    if dry_run:
        print(f"Would back up {len(paths)} file(s) to {backup_root}")
        return
    backup_root.mkdir(parents=True, exist_ok=True)
    images_root = (repo_root() / "public" / "images").resolve()
    for p in paths:
        src = p.resolve()
        rel = src.relative_to(images_root)
        target = backup_root / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, target)
        webp = src.with_suffix(".webp")
        if webp.is_file():
            webp_rel = webp.relative_to(images_root)
            shutil.copy2(webp, backup_root / webp_rel)


def main() -> None:
    parser = argparse.ArgumentParser(description="Optimize team + contact images for web.")
    parser.add_argument(
        "--team-dir",
        type=Path,
        default=repo_root() / "public" / "images" / "team",
        help="Folder with team portrait files (and tape/ subfolder)",
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
        "--tape-max-width",
        type=int,
        default=TAPE_MAX_WIDTH,
        help=f"Max width for tape overlays (default {TAPE_MAX_WIDTH})",
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

    args.team_dir = resolve_in_repo(args.team_dir)
    args.contact = resolve_in_repo(args.contact)
    args.out_team_dir = resolve_in_repo(args.out_team_dir)
    args.out_contact = resolve_in_repo(args.out_contact)

    team_entries = collect_team_sources(args.team_dir)
    team_files = [path for path, _, _ in team_entries]

    if not team_entries:
        print(f"No team images in {args.team_dir}", file=sys.stderr)

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

    print(
        f"\nTeam photos ({len(team_entries)} files, portraits ≤{args.team_max_width}px, tape ≤{args.tape_max_width}px)"
    )
    for src, default_max_width, label in team_entries:
        max_width = args.tape_max_width if label == "tape" else args.team_max_width
        if args.replace:
            dest = src
        else:
            rel = src.relative_to(args.team_dir)
            dest = args.out_team_dir / rel

        result = process_file(
            src,
            dest,
            max_width,
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
                rel_name = src.relative_to(args.team_dir)
                print(f"  {rel_name}: {human_size(b)} → {human_size(a)}")

    if args.contact.is_file():
        contact_dest = args.contact if args.replace else args.out_contact
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
        print(f"\nContact photo not found (skipped): {args.contact}")

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
