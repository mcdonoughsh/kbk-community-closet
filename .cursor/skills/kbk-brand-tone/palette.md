# KBK brand palette and type

Source of truth for site tokens is `src/app/globals.css`. Use the CSS variables in code rather than raw hex where a token exists.

## Core tokens

| Token | Hex | Use |
|-------|-----|-----|
| `--kbk-primary` | `#036bb6` | Buttons, links, primary actions |
| `--kbk-primary-hover` | `#025a9a` | Hover state, headings |
| `--kbk-primary-light` | `#5a9fd4` | Supporting elements on white |
| `--kbk-background` | `#e6f4ff` | Page background (soft sky blue) |
| `--kbk-card` | `#ffffff` | Cards and panels |
| `--kbk-text` | `#171717` | Body text |
| `--kbk-text-muted` | `#6b7280` | Secondary text |
| `--kbk-border` | `#d1d5db` | Input and card borders |
| `--kbk-cream` | `#d76737` | Warm orange-red supporting visuals |

## Event accents

Used on event promos and flyers (not yet tokens):

| Name | Hex | Use |
|------|-----|-----|
| Marigold | `#ffaa06` | Event banners and promo strips |
| Coral | `#e45e5e` | Event titles on marigold |

## Type

- **Quicksand** (Google Fonts) for everything, loaded in `src/app/layout.tsx`.
- Headings: semibold, tight tracking, `text-balance`.
