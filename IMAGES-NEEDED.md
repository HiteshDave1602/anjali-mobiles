# Product images needed

9 photos for the "Popular at our counter" section. Save each file at the exact path shown and it appears on its card the next time the site is built (`npm run dev` picks it up straight away). No code changes are needed. Until a photo exists, its card shows a category icon and the product name.

## Checklist for every image

- [ ] Square, 1:1
- [ ] 1200 x 1200 px
- [ ] Pure white background (#FFFFFF), product centred with even empty margin around it
- [ ] Saved with the exact file name and folder from the table below (lowercase, e.g. `assets/products/tv/tv-01.webp`)
- [ ] Optimised to under 150 KB each. WebP preferred (for example with squoosh.app, WebP, quality about 80)
- [ ] No text, logos, watermarks, people or hands

PNG also works: keep the same name and change only the extension (`tv-01.png`). If both exist, the .webp is used.

After adding photos, rebuild and redeploy the site (`npm run build`, or push to the host that builds it) so the new files are included.

## General

| id | Product | Save as | AI image prompt |
|---|---|---|---|
| mobiles-01 | Smartphones | `assets/products/mobiles/mobiles-01.webp` | Professional e-commerce product photo of two modern unbranded smartphones standing side by side, one showing a dark home screen and one showing its back with the camera module, single product centered, clean pure white background (#FFFFFF), soft studio lighting with a subtle natural shadow under the product, front or three-quarter view, sharp focus, high resolution, 1200x1200 square, product fills about 75% of the frame with even empty margin around it. NO text, NO brand logos, NO watermark, NO people, NO props, NO hands. |
| chargers-01 | Charger with Cable | `assets/products/chargers/chargers-01.webp` | Supplied photo: white USB-C wall charger with a coiled Lightning cable (added). |
| cases-01 | Phone Case | `assets/products/cases/cases-01.webp` | Professional e-commerce product photo of an empty black matte protective phone case, back view, single product centered, clean pure white background (#FFFFFF), soft studio lighting with a subtle natural shadow under the product, front or three-quarter view, sharp focus, high resolution, 1200x1200 square, product fills about 75% of the frame with even empty margin around it. NO text, NO brand logos, NO watermark, NO people, NO props, NO hands. |
| audio-01 | Wireless Earbuds | `assets/products/audio/audio-01.webp` | Professional e-commerce product photo of a pair of black true-wireless earbuds beside their open charging case, single product centered, clean pure white background (#FFFFFF), soft studio lighting with a subtle natural shadow under the product, front or three-quarter view, sharp focus, high resolution, 1200x1200 square, product fills about 75% of the frame with even empty margin around it. NO text, NO brand logos, NO watermark, NO people, NO props, NO hands. |
| audio-04 | Bluetooth Speaker | `assets/products/audio/audio-04.webp` | Professional e-commerce product photo of a grey fabric-covered cylindrical Bluetooth speaker on a silver base, single product centered, clean pure white background (#FFFFFF), soft studio lighting with a subtle natural shadow under the product, front or three-quarter view, sharp focus, high resolution, 1200x1200 square, product fills about 75% of the frame with even empty margin around it. NO text, NO brand logos, NO watermark, NO people, NO props, NO hands. |

## Major Appliances

| id | Product | Save as | AI image prompt |
|---|---|---|---|
| tv-01 | LED Smart TV | `assets/products/tv/tv-01.webp` | Professional e-commerce product photo of a slim black LED smart TV on a centre stand, screen showing a soft abstract colourful wallpaper, single product centered, clean pure white background (#FFFFFF), soft studio lighting with a subtle natural shadow under the product, front or three-quarter view, sharp focus, high resolution, 1200x1200 square, product fills about 75% of the frame with even empty margin around it. NO text, NO brand logos, NO watermark, NO people, NO props, NO hands. |
| fridge-01 | Refrigerator | `assets/products/fridge/fridge-01.webp` | Professional e-commerce product photo of a stainless steel multi-door (French door) refrigerator with the doors closed, single product centered, clean pure white background (#FFFFFF), soft studio lighting with a subtle natural shadow under the product, front or three-quarter view, sharp focus, high resolution, 1200x1200 square, product fills about 75% of the frame with even empty margin around it. NO text, NO brand logos, NO watermark, NO people, NO props, NO hands. |
| ac-01 | Split AC | `assets/products/ac/ac-01.webp` | Professional e-commerce product photo of a white split air conditioner indoor unit, front view, single product centered, clean pure white background (#FFFFFF), soft studio lighting with a subtle natural shadow under the product, front or three-quarter view, sharp focus, high resolution, 1200x1200 square, product fills about 75% of the frame with even empty margin around it. NO text, NO brand logos, NO watermark, NO people, NO props, NO hands. |
| washing-01 | Washing Machine | `assets/products/washing/washing-01.webp` | Professional e-commerce product photo of a white front-load washing machine with a round door, single product centered, clean pure white background (#FFFFFF), soft studio lighting with a subtle natural shadow under the product, front or three-quarter view, sharp focus, high resolution, 1200x1200 square, product fills about 75% of the frame with even empty margin around it. NO text, NO brand logos, NO watermark, NO people, NO props, NO hands. |

## Adding a new product later

Add a line to the `PRODUCTS` list in `js/script.js` (section 6) with a new id, for example `tv-05`, and save its photo as `assets/products/tv/tv-05.webp`.
