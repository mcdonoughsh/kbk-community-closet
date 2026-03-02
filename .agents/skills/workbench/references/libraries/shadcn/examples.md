# shadcn/ui + Tailwind Examples

This shows how systematic precision translates to real decisions using Tailwind + shadcn/ui. The craft principles remain constant — the implementation adapts.

---

## Example: Metric Card

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from 'lucide-react'

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
    <Card className="bg-surface border-edge">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium text-ink-muted uppercase tracking-wide">
            {label}
          </CardTitle>
          {context && (
            <span className="text-xs text-ink-muted">{context}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight text-ink tabular-nums mb-2">
          {value}
        </div>
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
          <span className="text-xs text-ink-muted">{changeLabel}</span>
        </div>
      </CardContent>
    </Card>
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
</div>
```

---

## Example: Data Table

Using shadcn/ui Table with TanStack Table for sorting/filtering:

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const statusVariants = {
  completed: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50",
  pending: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  failed: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
};

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
}

function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-surface border border-edge rounded-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-canvas hover:bg-canvas border-b border-edge">
            <TableHead className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              ID
            </TableHead>
            <TableHead className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              Date
            </TableHead>
            <TableHead className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              Description
            </TableHead>
            <TableHead className="text-xs font-medium text-ink-muted uppercase tracking-wide text-right">
              Amount
            </TableHead>
            <TableHead className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} className="border-b border-edge-subtle hover:bg-surface">
              <TableCell className="font-mono text-xs text-ink-secondary">
                {tx.id}
              </TableCell>
              <TableCell className="text-sm text-ink-secondary tabular-nums">
                {tx.date}
              </TableCell>
              <TableCell className="text-sm text-ink">
                {tx.description}
              </TableCell>
              <TableCell className="font-mono text-sm text-ink tabular-nums text-right">
                {tx.amount}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={statusVariants[tx.status]}>
                  {tx.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

---

## Example: Form with shadcn Components

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

function PaymentForm() {
  return (
    <div className="bg-surface border border-edge rounded-card p-6 max-w-md">
      <h2 className="text-lg font-semibold text-ink mb-6">Payment details</h2>

      <form className="space-y-4">
        {/* Amount */}
        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">$</span>
              <Input
                id="amount"
                placeholder="0.00"
                className="pl-7"
              />
            </div>
            <Select defaultValue="USD">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Recipient */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Recipient email</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description">
            Description <span className="text-ink-muted font-normal">(optional)</span>
          </Label>
          <Textarea
            id="description"
            placeholder="What's this payment for?"
            rows={2}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">
            Send payment
          </Button>
        </div>
      </form>
    </div>
  );
}
```

---

## Example: Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function CreateProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Project</Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-edge sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-ink">Create project</DialogTitle>
          <DialogDescription className="text-ink-secondary">
            Add a new project to your workspace. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="My new project" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Project description..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Example: Date Picker

```tsx
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function DatePicker({ date, onDateChange }: { date?: Date; onDateChange: (date?: Date) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-ink-muted"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-surface border-edge" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
```

---

## Example: Dashboard Layout with Sidebar

```tsx
import { Home, CreditCard, Users, Settings, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-canvas">
      {/* Sidebar */}
      <aside className="w-64 border-r border-edge bg-canvas flex flex-col">
        {/* Logo */}
        <div className="h-14 px-4 flex items-center border-b border-edge">
          <span className="text-lg font-semibold text-ink">Acme</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          <NavItem icon={Home} label="Dashboard" active />
          <NavItem icon={CreditCard} label="Transactions" />
          <NavItem icon={Users} label="Customers" />
          <NavItem icon={Settings} label="Settings" />
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-edge">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">JD</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-ink">John Doe</div>
                  <div className="text-xs text-ink-muted">john@acme.com</div>
                </div>
                <ChevronDown className="h-4 w-4 text-ink-muted" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  active = false
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href="#"
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
        ${active
          ? 'bg-surface text-ink font-medium'
          : 'text-ink-secondary hover:bg-surface hover:text-ink'
        }
      `}
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  );
}
```

---

## Example: Command Menu (Cmd+K)

```tsx
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useEffect, useState } from "react"

function CommandMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Dashboard</CommandItem>
          <CommandItem>Transactions</CommandItem>
          <CommandItem>Customers</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
```

---

## The Craft Check

Same principles apply regardless of component library:

1. Blur your eyes — can you perceive hierarchy?
2. Are borders whisper-quiet, not shouting?
3. Do surfaces stack with subtle distinction?
4. Is spacing consistent with your scale?

shadcn/ui components are styled with Tailwind by default, making it natural to maintain systematic precision.
