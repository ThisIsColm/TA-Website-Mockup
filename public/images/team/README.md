# About page — team assets

Add files here and wire them in `src/app/about/page.tsx` on each `TEAM` entry.

## Portrait photos

- **Design size:** 280 × 320 px (width × height). You can export @2x (560 × 640) for retina; the layout keeps a **280:320** aspect ratio.
- **Format:** WebP or JPEG (smaller) or PNG if you need transparency.
- **Naming:** use a stable slug per person, e.g. `nathan-reilly.jpg`.
- **In code:** set `photoSrc: "/images/team/nathan-reilly.jpg"`.

## Handwritten names

- **Format:** **PNG with transparency** works best (sticker on top of the photo).
- Export at the size you want shown (roughly ~200–280px wide is plenty); the UI scales it to fit the bottom of the card with `object-contain`.
- **Naming:** e.g. `nathan-reilly-name.png`.
- **In code:** set `nameAssetSrc: "/images/team/nathan-reilly-name.png"`.
- If you omit `nameAssetSrc`, the page uses the orange bar + `nameLabel` text fallback.

## Example entry

```ts
{
  role: "CEO",
  nameLabel: "Nathan Reilly",
  photoSrc: "/images/team/nathan-reilly.webp",
  nameAssetSrc: "/images/team/nathan-reilly-name.png",
},
```

`nameLabel` is still used for accessibility (`alt` on the photo) when `photoSrc` is set.
