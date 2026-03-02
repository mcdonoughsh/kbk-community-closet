# Agent Skills (Cursor / Agent Skills standard)

Project-level skills from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills). Cursor loads these automatically when you use Agent chat.

## Installed skills

- **vercel-react-best-practices** — React/Next.js performance (waterfalls, bundle size, data fetching, re-renders).
- **web-design-guidelines** — UI review: accessibility, focus, forms, typography, images, performance, dark mode.
- **vercel-composition-patterns** — React composition, compound components, fewer boolean props.

## How to use in Cursor

1. **Automatic** — In Agent chat, describe a task (e.g. “review this component for performance” or “check accessibility”). The agent will use the relevant skill when it matches.
2. **Manual** — In Agent chat, type **`/`** and choose a skill by name (e.g. `/vercel-react-best-practices`, `/web-design-guidelines`, `/vercel-composition-patterns`).

## How to verify

- **Cursor:** Open Agent chat → type `/` → you should see the skill names in the list.
- **Settings:** Cursor Settings → Rules (or Agent “Decides” section) — skills appear as available context.

## Updating skills

From repo root:

```bash
npx skills list
npx skills update
```

## Adding more skills

```bash
npx skills add vercel-labs/agent-skills --list   # see available
npx skills add vercel-labs/agent-skills --skill <name> -y
```
