export type CategoryId =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "entertainment"
  | "health"
  | "other";

export type Expense = {
  id: string;
  amount: number;
  category: CategoryId;
  note: string;
  date: string; // ISO date (yyyy-mm-dd)
  createdAt: number;
};

export const CATEGORIES: {
  id: CategoryId;
  label: string;
  emoji: string;
  colorVar: string;
}[] = [
  { id: "food", label: "Food", emoji: "🍜", colorVar: "--cat-food" },
  { id: "transport", label: "Transport", emoji: "🚇", colorVar: "--cat-transport" },
  { id: "shopping", label: "Shopping", emoji: "🛍️", colorVar: "--cat-shopping" },
  { id: "bills", label: "Bills", emoji: "🧾", colorVar: "--cat-bills" },
  { id: "entertainment", label: "Fun", emoji: "🎬", colorVar: "--cat-entertainment" },
  { id: "health", label: "Health", emoji: "💊", colorVar: "--cat-health" },
  { id: "other", label: "Other", emoji: "✨", colorVar: "--cat-other" },
];

export const getCategory = (id: CategoryId) =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

const STORAGE_KEY = "expenses.v1";
const BUDGET_KEY = "budget.v1";

export const loadExpenses = (): Expense[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveExpenses = (items: Expense[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const loadBudget = (): number => {
  try {
    const raw = localStorage.getItem(BUDGET_KEY);
    if (!raw) return 0;
    const n = parseFloat(raw);
    return isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
};

export const saveBudget = (n: number) => {
  localStorage.setItem(BUDGET_KEY, String(n));
};

export const monthKey = (iso: string) => iso.slice(0, 7); // yyyy-mm

export const todayISO = () => {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
};

export const exportCSV = (items: Expense[]) => {
  const header = ["Date", "Category", "Amount", "Note"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = items
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((e) =>
      [
        e.date,
        getCategory(e.category).label,
        e.amount.toFixed(2),
        escape(e.note ?? ""),
      ].join(",")
    );
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expenses-${todayISO()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
