# Tailwind + shadcn/ui Integration

This guide covers the setup and patterns for using Tailwind CSS with shadcn/ui in interface design projects.

---

## Philosophy

**Tailwind** handles layout, spacing, typography, and styling through utility classes.

**shadcn/ui** provides accessible, customizable components built on Radix UI primitives. Components are copied into your project — you own the code and can modify freely.

**Both** are driven by a unified token system defined in CSS variables.

---

## Why shadcn/ui?

- **Full ownership:** Components live in your codebase, not node_modules
- **Maximum customization:** Modify any component without fighting a library
- **Radix primitives:** Accessibility handled, behavior solid
- **Tailwind-native:** Already styled with Tailwind, easy to adapt
- **Selective installation:** Only add components you need

---

## Installation

```bash
# Initialize shadcn/ui in your project
npx shadcn@latest init

# This will ask you questions about your setup:
# - TypeScript? (recommended: yes)
# - Style? (recommend: Default)
# - Base color? (match your design direction)
# - CSS variables? (recommended: yes)
# - Tailwind config location
# - Components location (default: @/components)
```

After initialization, add components as needed:

```bash
# Add specific components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add table
npx shadcn@latest add select
npx shadcn@latest add calendar
npx shadcn@latest add popover
```

---

## Tailwind Configuration

shadcn/ui configures Tailwind automatically, but ensure your tokens are integrated:

```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Semantic color tokens (supplement shadcn defaults)
      colors: {
        canvas: 'var(--canvas)',
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          secondary: 'var(--ink-secondary)',
          muted: 'var(--ink-muted)',
        },
        edge: {
          DEFAULT: 'var(--edge)',
          subtle: 'var(--edge-subtle)',
        },
        // shadcn uses these by default
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        control: '0.375rem',
        card: '0.5rem',
        modal: '0.75rem',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

## CSS Variables

shadcn/ui uses HSL color format. Map your design tokens to both formats:

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* shadcn default tokens (HSL format) */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;

    /* Workbench semantic tokens (for layouts, custom components) */
    --canvas: #fafafa;
    --surface: #ffffff;
    --surface-elevated: #ffffff;
    --ink: #0f172a;
    --ink-secondary: #475569;
    --ink-muted: #94a3b8;
    --edge: rgba(0, 0, 0, 0.08);
    --edge-subtle: rgba(0, 0, 0, 0.04);
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;

    --canvas: #0a0a0a;
    --surface: #141414;
    --surface-elevated: #1a1a1a;
    --ink: #fafafa;
    --ink-secondary: #a1a1aa;
    --ink-muted: #71717a;
    --edge: rgba(255, 255, 255, 0.08);
    --edge-subtle: rgba(255, 255, 255, 0.04);
  }
}
```

---

## Theming shadcn Components

shadcn components are in your codebase. Modify them directly to match your design system.

### Customizing Button

```tsx
// components/ui/button.tsx
// Modify the variants to match your design

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-control text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-edge bg-background hover:bg-surface hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-surface hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-control px-3",
        lg: "h-10 rounded-control px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Customizing Input

```tsx
// components/ui/input.tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-control border border-edge bg-canvas px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

---

## Component Installation Guide

### Essential Components for Dashboards

```bash
# Core UI
npx shadcn@latest add button input label

# Data display
npx shadcn@latest add table card badge

# Forms
npx shadcn@latest add select checkbox radio-group switch

# Feedback
npx shadcn@latest add dialog alert-dialog toast

# Navigation
npx shadcn@latest add tabs dropdown-menu

# Advanced
npx shadcn@latest add calendar popover command
```

### For Date Picking

```bash
npx shadcn@latest add calendar popover

# Then build a date picker:
npx shadcn@latest add date-picker
```

---

## Styling Patterns

### Pattern 1: Use Components As-Is with className

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

<div className="bg-surface border border-edge rounded-card p-6">
  <Input className="mb-4" placeholder="Enter email..." />
  <Button className="w-full">Submit</Button>
</div>
```

### Pattern 2: Compose with Tailwind Layout

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card className="bg-surface border-edge">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-ink-muted uppercase tracking-wide">
        Revenue
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-semibold text-ink tabular-nums">$45,231</div>
    </CardContent>
  </Card>
</div>
```

### Pattern 3: Extend with Custom Variants

Since you own the components, add custom variants as needed:

```tsx
// In button.tsx, add a custom variant
variant: {
  // ... existing variants
  subtle: "bg-surface text-ink hover:bg-surface-elevated border border-edge",
}

// Usage
<Button variant="subtle">Subtle Action</Button>
```

---

## When to Use What

| Need | Approach |
|------|----------|
| Layout (flex, grid) | Tailwind utilities |
| Spacing, typography | Tailwind utilities |
| Buttons, inputs | shadcn/ui components |
| Data tables | shadcn/ui Table or TanStack Table |
| Date pickers | shadcn/ui Calendar + Popover |
| Dialogs/modals | shadcn/ui Dialog |
| Dropdowns | shadcn/ui DropdownMenu |
| Select/combobox | shadcn/ui Select or Command |
| Toast notifications | shadcn/ui Toast |
| Cards | shadcn/ui Card or Tailwind |

---

## Data Tables with TanStack

shadcn/ui works well with TanStack Table for complex data:

```bash
npm install @tanstack/react-table
```

See shadcn/ui's data-table documentation for patterns.

---

## Troubleshooting

### Components not found after installation

Ensure your `components.json` has the correct paths and aliases.

### Styles not applying

Check that `globals.css` is imported in your root layout and contains the shadcn base layer.

### TypeScript errors

Ensure the path alias `@/` is configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Dark mode not working

Ensure you're using `class` dark mode strategy and toggling the `dark` class on the html element.
