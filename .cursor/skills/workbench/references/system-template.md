# system.md Template

Use this template when saving design decisions to `.workbench/system.md`.

---

## Header

```markdown
# [Project Name] Design System

Stack: Tailwind CSS + [MUI | shadcn/ui | Tailwind-only]
Direction: [e.g., Precision & Density, Warmth & Approachability, etc.]
Last updated: [date]
```

---

## Direction Section

```markdown
## Direction

**Feel:** [2-3 word description — e.g., "Cold precision", "Warm efficiency"]
**Density:** [Dense / Balanced / Spacious]
**Depth strategy:** [Borders-only / Subtle shadows / Layered shadows]

**Domain concepts:**
- [concept 1]
- [concept 2]
- [concept 3]

**Signature element:** [The one thing unique to this product]
```

---

## Token Section

```markdown
## Tokens

### Colors

```css
:root {
  --canvas: #fafafa;
  --surface: #ffffff;
  --surface-elevated: #ffffff;
  --ink: #0f172a;
  --ink-secondary: #475569;
  --ink-muted: #94a3b8;
  --edge: rgba(0, 0, 0, 0.08);
  --edge-subtle: rgba(0, 0, 0, 0.04);
  --accent: #2563eb;
}
```

### Tailwind Config

```js
// tailwind.config.js extend
colors: {
  canvas: 'var(--canvas)',
  surface: { DEFAULT: 'var(--surface)', elevated: 'var(--surface-elevated)' },
  ink: { DEFAULT: 'var(--ink)', secondary: 'var(--ink-secondary)', muted: 'var(--ink-muted)' },
  edge: { DEFAULT: 'var(--edge)', subtle: 'var(--edge-subtle)' },
  accent: 'var(--accent)',
},
borderRadius: {
  control: '0.375rem',
  card: '0.5rem',
  modal: '0.75rem',
},
```
```

---

## Library Configuration

### If MUI

```markdown
## MUI Theme

```tsx
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: 'var(--accent)' },
    background: { default: 'var(--canvas)', paper: 'var(--surface)' },
    text: { primary: 'var(--ink)', secondary: 'var(--ink-secondary)' },
    divider: 'var(--edge)',
  },
  typography: { fontFamily: 'inherit' },
  shape: { borderRadius: 6 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: 'none', fontWeight: 500 } },
    },
  },
});
```

See `references/libraries/mui/` for component patterns.
```

### If shadcn/ui

```markdown
## shadcn/ui Configuration

Components installed: [list of installed components]

Theme tokens mapped in `components.json` and CSS variables.

Custom overrides:
- [any modifications to default shadcn components]

See `references/libraries/shadcn/` for patterns.
```

### If Tailwind-only

```markdown
## Custom Components

Components built from scratch using Tailwind:
- [list of custom components]

Patterns:
- Buttons: [pattern description]
- Inputs: [pattern description]
- Cards: [pattern description]

See `references/libraries/tailwind-only/` for patterns.
```

---

## Patterns Section

```markdown
## Component Patterns

### Button Primary
- Height: 36px
- Padding: 16px horizontal
- Radius: control (6px)
- Background: accent
- Text: white, 14px, medium weight

### Card Default
- Padding: 20px
- Radius: card (8px)
- Border: 1px edge
- Background: surface

### Input Default
- Height: 38px
- Padding: 8px 12px
- Radius: control (6px)
- Border: 1px edge
- Focus: accent ring
```

---

## Responsive Section

```markdown
## Responsive Strategy

**Sidebar:** Collapsible drawer on mobile, fixed on desktop (md breakpoint)
**Tables:** Card layout on mobile, table on desktop
**Metrics:** 1 col mobile → 2 col tablet → 4 col desktop
**Touch targets:** 44px minimum on mobile
```

---

## Detection Logic

When reading an existing system.md, detect the library from:

- `Stack: ... + MUI` or presence of `MUI Theme` section → MUI
- `Stack: ... + shadcn` or presence of `shadcn/ui Configuration` section → shadcn/ui
- `Stack: Tailwind CSS` alone or `Stack: ... + Tailwind-only` → Tailwind-only

Use this to load the appropriate library-specific references.
