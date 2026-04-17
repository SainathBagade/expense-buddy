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

export const monthKey = (iso: string) => iso.slice(0, 7); // yyyy-mm

export const todayISO = () => {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
};
