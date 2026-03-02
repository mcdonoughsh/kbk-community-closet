# MUI + Tailwind Examples

This shows how systematic precision translates to real decisions using Tailwind + MUI. Learn the thinking, not just the code. Your values will differ — the approach won't.

---

## The Subtle Layering Mindset

Before looking at any example, internalize this: **you should barely notice the system working.**

When you look at Stripe's dashboard, you don't think "nice borders." You just understand the structure. When you look at Airwallex, you don't think "good surface elevation." You just know what's above what. The craft is invisible — that's how you know it's working.

---

## Example: Stripe-Style Metric Card

Stripe's metric cards aren't just numbers in boxes. They provide context, comparison, and meaning.

### The Token Foundation

First, establish your tokens in `tailwind.config.js`:

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
      },
    },
  },
}
```

```css
/* globals.css */
:root {
  --canvas: #fafafa;
  --surface: #ffffff;
  --surface-elevated: #ffffff;
  --ink: #0f172a;
  --ink-secondary: #475569;
  --ink-muted: #94a3b8;
  --edge: rgba(0, 0, 0, 0.08);
  --edge-subtle: rgba(0, 0, 0, 0.04);
  --accent: #635bff; /* Stripe purple */
}
```

### The Component

```tsx
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  context?: string;
}

function MetricCard({ label, value, change, changeLabel, context }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-surface border border-edge rounded-card p-5">
      {/* Label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          {label}
        </span>
        {context && (
          <span className="text-xs text-ink-muted">
            {context}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <span className="text-2xl font-semibold tracking-tight text-ink tabular-nums">
          {value}
        </span>
      </div>

      {/* Change indicator */}
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
        <span className="text-xs text-ink-muted">
          {changeLabel}
        </span>
      </div>
    </div>
  );
}

// Usage
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <MetricCard
    label="Gross volume"
    value="$142,384"
    change={12.5}
    changeLabel="vs last month"
    context="This month"
  />
  <MetricCard
    label="Successful payments"
    value="1,247"
    change={8.2}
    changeLabel="vs last month"
  />
</div>
```

### Why These Decisions

**Why `p-5` not `p-4`?** Stripe cards breathe. The extra 4px creates comfortable spacing without feeling loose.

**Why uppercase label with `tracking-wide`?** Labels are metadata, not content. Uppercase with wide tracking creates visual distinction.

**Why `tabular-nums` on value and change?** Numbers in adjacent cards should align vertically when values change.

---

## Example: Airwallex-Style Data Table

Airwallex handles dense financial data with clarity. Tables need to breathe even when packed with information.

### Using MUI DataGrid with Tailwind

```tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Transaction ID',
    width: 160,
    renderCell: (params) => (
      <span className="font-mono text-xs text-ink-secondary">
        {params.value}
      </span>
    ),
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
    renderCell: (params) => (
      <span className="text-sm text-ink-secondary tabular-nums">
        {params.value}
      </span>
    ),
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1,
    minWidth: 200,
    renderCell: (params) => (
      <span className="text-sm text-ink truncate">
        {params.value}
      </span>
    ),
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 120,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => (
      <span className="font-mono text-sm text-ink tabular-nums">
        {params.value}
      </span>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => {
      const statusStyles = {
        completed: 'bg-green-50 text-green-700 border-green-200',
        pending: 'bg-amber-50 text-amber-700 border-amber-200',
        failed: 'bg-red-50 text-red-700 border-red-200',
      };
      return (
        <span className={`
          inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
          ${statusStyles[params.value as keyof typeof statusStyles]}
        `}>
          {params.value}
        </span>
      );
    },
  },
];

function TransactionTable({ rows }: { rows: any[] }) {
  return (
    <div className="bg-surface border border-edge rounded-card overflow-hidden">
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        hideFooterSelectedRowCount
        className="border-none"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'var(--canvas)',
            borderBottom: '1px solid var(--edge)',
            minHeight: '44px !important',
            maxHeight: '44px !important',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--ink-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid var(--edge-subtle)',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'var(--surface)',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid var(--edge)',
            backgroundColor: 'var(--canvas)',
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
        }}
      />
    </div>
  );
}
```

### Why These Decisions

**Why card wrapper with `overflow-hidden`?** The DataGrid needs containment. The border-radius on the card should clip the table edges cleanly.

**Why uppercase column headers?** Column headers are labels, not content. The uppercase treatment with muted color creates hierarchy.

**Why custom status badges instead of MUI Chip?** MUI Chips carry too much visual weight for inline status. Lighter badges communicate status without competing for attention.

---

## Example: Form with MUI Components

```tsx
import { TextField, Button, Select, MenuItem } from '@mui/material';

function PaymentForm() {
  return (
    <div className="bg-surface border border-edge rounded-card p-6 max-w-md">
      <h2 className="text-lg font-semibold text-ink mb-6">Payment details</h2>

      <form className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">
            Amount
          </label>
          <div className="flex gap-2">
            <TextField
              variant="outlined"
              size="small"
              placeholder="0.00"
              className="flex-1"
              InputProps={{
                startAdornment: <span className="text-ink-muted mr-1">$</span>,
              }}
              sx={textFieldStyles}
            />
            <Select
              size="small"
              defaultValue="USD"
              className="w-24"
              sx={selectStyles}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
            </Select>
          </div>
        </div>

        {/* Recipient */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">
            Recipient email
          </label>
          <TextField
            variant="outlined"
            size="small"
            placeholder="email@example.com"
            fullWidth
            sx={textFieldStyles}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outlined"
            className="flex-1 normal-case font-medium text-ink border-edge hover:bg-canvas"
            sx={buttonOutlinedStyles}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="flex-1 normal-case font-medium bg-accent hover:bg-accent/90 shadow-none"
            disableElevation
          >
            Send payment
          </Button>
        </div>
      </form>
    </div>
  );
}

// Shared MUI style overrides
const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.375rem',
    '& fieldset': {
      borderColor: 'var(--edge)',
    },
    '&:hover fieldset': {
      borderColor: 'var(--edge)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--accent)',
      borderWidth: '1px',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px 12px',
    fontSize: '0.875rem',
  },
};

const selectStyles = {
  borderRadius: '0.375rem',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--edge)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--edge)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--accent)',
    borderWidth: '1px',
  },
};

const buttonOutlinedStyles = {
  borderColor: 'var(--edge)',
  '&:hover': {
    borderColor: 'var(--edge)',
    backgroundColor: 'var(--canvas)',
  },
};
```

---

## Example: Styled Dialog

```tsx
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function StyledDialog({ open, onClose, title, children, actions }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: "bg-surface border border-edge rounded-modal",
        sx: {
          maxWidth: '480px',
          width: '100%',
        },
      }}
    >
      <DialogTitle className="text-lg font-semibold text-ink px-6 py-4 border-b border-edge">
        {title}
      </DialogTitle>
      <DialogContent className="px-6 py-4">
        {children}
      </DialogContent>
      <DialogActions className="px-6 py-4 border-t border-edge gap-3">
        {actions}
      </DialogActions>
    </Dialog>
  );
}
```

---

## Example: Styled Autocomplete

```tsx
import { Autocomplete, TextField } from '@mui/material';

function StyledAutocomplete({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">
        {label}
      </label>
      <Autocomplete
        options={options}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 'var(--radius-control)',
                '& fieldset': {
                  borderColor: 'var(--edge)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--accent)',
                  borderWidth: '1px',
                },
              },
            }}
          />
        )}
        PaperComponent={({ children, ...props }) => (
          <div
            {...props}
            className="bg-surface-elevated border border-edge rounded-card shadow-lg mt-1"
          >
            {children}
          </div>
        )}
        {...props}
      />
    </div>
  );
}
```

---

## The Craft Check

Apply the squint test to your work:

1. Blur your eyes or step back
2. Can you still perceive hierarchy?
3. Is anything jumping out at you?
4. Can you tell where regions begin and end?

If hierarchy is visible and nothing is harsh — the subtle layering is working.
