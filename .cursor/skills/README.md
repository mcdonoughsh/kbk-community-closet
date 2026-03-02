# Agent Skills (Cursor / Agent Skills standard)

Project-level skills from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills). Cursor loads these automatically when you use Agent chat.

## Installed skills

**Vercel (react & design)**  
- **vercel-react-best-practices** — React/Next.js performance (waterfalls, bundle size, data fetching, re-renders).
- **web-design-guidelines** — UI review: accessibility, focus, forms, typography, images, performance, dark mode.
- **vercel-composition-patterns** — React composition, compound components, fewer boolean props.

**Design suite** ([vichannnnn/design-suite](https://github.com/vichannnnn/design-suite))  
- **workbench** — Dashboards, admin panels, SaaS UIs. Tailwind + component library; tokens-first, systematic. Use `/workbench` or ask to init/audit/extract dashboard design.
- **launchpad** — Landing pages, promotional sites, marketing pages. React + Tailwind; bold aesthetics, conversion-focused. Use `/launchpad` or ask to init/audit/extract landing page design.  
  Both skills persist state in the project: Workbench → `.workbench/system.md`, Launchpad → `.launchpad/system.md`.

## How to use in Cursor

1. **Automatic** — In Agent chat, describe a task (e.g. “review this component for performance” or “check accessibility”). The agent will use the relevant skill when it matches.
2. **Manual** — In Agent chat, type **`/`** and choose a skill by name (e.g. `/vercel-react-best-practices`, `/web-design-guidelines`, `/workbench`, `/launchpad`).

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
npx skills add <owner/repo> --list   # see available (e.g. vercel-labs/agent-skills, vichannnnn/design-suite)
npx skills add <owner/repo> --skill <name> -y
```
