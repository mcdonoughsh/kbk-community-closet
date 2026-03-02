# Tailwind-Only Component Patterns

This guide covers building interface components using only Tailwind CSS, without external component libraries.

---

## Philosophy

**When to choose Tailwind-only:**
- Maximum control over every detail
- Minimal bundle size
- No external dependencies
- Learning/understanding component patterns
- Simple interfaces without complex interactions

**Trade-offs:**
- You build everything from scratch
- Accessibility requires manual implementation
- Complex interactions (modals, dropdowns) need custom focus management
- No pre-built data tables, date pickers, autocomplete

---

## Token Foundation

Same token system applies:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
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
        accent: 'var(--accent)',
      },
      borderRadius: {
        control: '0.375rem',
        card: '0.5rem',
        modal: '0.75rem',
      },
    },
  },
}
```

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

---

## Button Component

```tsx
import { forwardRef, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center font-medium
      rounded-control transition-colors
      focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-2
      disabled:opacity-50 disabled:pointer-events-none
    `;

    const variants = {
      primary: 'bg-accent text-white hover:bg-accent/90',
      secondary: 'bg-surface border border-edge text-ink hover:bg-canvas',
      ghost: 'text-ink hover:bg-surface',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-6 text-sm',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

// Usage
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost" size="sm">Edit</Button>
```

---

## Input Component

```tsx
import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full h-9 px-3 py-2 text-sm
          bg-canvas border rounded-control
          text-ink placeholder:text-ink-muted
          focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-edge'}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };

// Usage
<Input placeholder="Enter your email..." />
<Input type="password" placeholder="Password" />
<Input error placeholder="Invalid input" />
```

---

## Label Component

```tsx
interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  optional?: boolean;
}

function Label({ htmlFor, children, optional }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-ink mb-1.5"
    >
      {children}
      {optional && (
        <span className="text-ink-muted font-normal ml-1">(optional)</span>
      )}
    </label>
  );
}

// Usage
<Label htmlFor="email">Email address</Label>
<Label htmlFor="notes" optional>Notes</Label>
```

---

## Card Component

```tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

function Card({ children, className = '', padding = 'md' }: CardProps) {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div className={`bg-surface border border-edge rounded-card ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-lg font-semibold text-ink ${className}`}>
      {children}
    </h3>
  );
}

function CardDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-ink-secondary mt-1">
      {children}
    </p>
  );
}

// Usage
<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
    <CardDescription>Manage your account preferences.</CardDescription>
  </CardHeader>
  <div className="space-y-4">
    {/* Content */}
  </div>
</Card>
```

---

## Metric Card

```tsx
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
}

function MetricCard({ label, value, change, changeLabel }: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-surface border border-edge rounded-card p-5">
      <div className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-3">
        {label}
      </div>
      <div className="text-2xl font-semibold tracking-tight text-ink tabular-nums mb-2">
        {value}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-600" />
          )}
          <span className={`text-xs font-medium tabular-nums ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? '+' : ''}{change}%
          </span>
          {changeLabel && (
            <span className="text-xs text-ink-muted">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Badge Component

```tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
}

function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-surface border-edge text-ink',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    outline: 'bg-transparent border-edge text-ink-secondary',
  };

  return (
    <span className={`
      inline-flex items-center px-2 py-0.5
      text-xs font-medium rounded border
      ${variants[variant]}
    `}>
      {children}
    </span>
  );
}

// Usage
<Badge>Default</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
```

---

## Simple Table

```tsx
interface Column<T> {
  key: keyof T;
  header: string;
  align?: 'left' | 'right' | 'center';
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

function Table<T extends { id: string | number }>({ columns, data }: TableProps<T>) {
  return (
    <div className="bg-surface border border-edge rounded-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-canvas border-b border-edge">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`
                  px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide
                  ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                `}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-edge-subtle last:border-0 hover:bg-surface transition-colors">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`
                    px-4 py-3 text-sm
                    ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                  `}
                >
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Usage
const columns = [
  { key: 'id', header: 'ID', render: (v) => <span className="font-mono text-xs text-ink-secondary">{v}</span> },
  { key: 'name', header: 'Name' },
  { key: 'amount', header: 'Amount', align: 'right', render: (v) => <span className="font-mono tabular-nums">{v}</span> },
  { key: 'status', header: 'Status', render: (v) => <Badge variant={v === 'active' ? 'success' : 'default'}>{v}</Badge> },
];

<Table columns={columns} data={data} />
```

---

## Simple Dropdown (Headless Pattern)

For interactive dropdowns without a library, use a headless approach:

```tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

function Dropdown({ trigger, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2"
      >
        {trigger}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 min-w-[160px] bg-surface-elevated border border-edge rounded-card shadow-lg py-1 z-50">
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-3 py-2 text-sm text-left text-ink hover:bg-surface transition-colors"
    >
      {children}
    </button>
  );
}

// Usage
<Dropdown trigger={<span>Options</span>}>
  <DropdownItem onClick={() => console.log('edit')}>Edit</DropdownItem>
  <DropdownItem onClick={() => console.log('delete')}>Delete</DropdownItem>
</Dropdown>
```

---

## Simple Modal

```tsx
import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function Modal({ open, onClose, title, children, footer }: ModalProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface border border-edge rounded-modal shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-edge">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-surface transition-colors"
          >
            <X className="h-4 w-4 text-ink-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-edge flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Usage
const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm action"
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  <p className="text-sm text-ink-secondary">
    Are you sure you want to proceed?
  </p>
</Modal>
```

---

## Accessibility Notes

When building without a library, you're responsible for accessibility:

- **Buttons:** Ensure `type="button"` to prevent form submission
- **Inputs:** Always pair with `<label>` using `htmlFor`
- **Modals:** Trap focus, close on Escape, restore focus on close
- **Dropdowns:** Manage focus, keyboard navigation, ARIA attributes
- **Contrast:** Verify text meets WCAG contrast ratios

For complex components (autocomplete, date pickers, data grids), consider using Headless UI or Radix primitives instead of building from scratch.

---

## When to Use External Libraries

Even with a Tailwind-only approach, some components are complex enough to warrant libraries:

| Component | Recommendation |
|-----------|----------------|
| Simple buttons, cards, badges | Build with Tailwind |
| Inputs, labels, basic forms | Build with Tailwind |
| Dropdowns, modals | Headless UI or custom |
| Date pickers | react-day-picker or similar |
| Data tables | TanStack Table |
| Autocomplete | Headless UI Combobox or Downshift |
| Tooltips | Floating UI |

The Tailwind-only approach works best for interfaces with simpler interaction patterns.
