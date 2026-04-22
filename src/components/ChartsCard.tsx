import { useMemo } from "react";
import { CATEGORIES, Expense, formatCurrency, monthKey } from "@/lib/expenses";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Props = { expenses: Expense[] };

export const ChartsCard = ({ expenses }: Props) => {
  const currentMonth = monthKey(new Date().toISOString().slice(0, 10));

  const categoryData = useMemo(() => {
    const monthItems = expenses.filter((e) => monthKey(e.date) === currentMonth);
    return CATEGORIES.map((c) => ({
      name: c.label,
      emoji: c.emoji,
      value: monthItems
        .filter((e) => e.category === c.id)
        .reduce((s, e) => s + e.amount, 0),
      color: `hsl(var(${c.colorVar}))`,
    })).filter((d) => d.value > 0);
  }, [expenses, currentMonth]);

  const trendData = useMemo(() => {
    const days = 14;
    const today = new Date();
    const arr: { date: string; label: string; total: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const tz = d.getTimezoneOffset() * 60000;
      const iso = new Date(d.getTime() - tz).toISOString().slice(0, 10);
      const total = expenses
        .filter((e) => e.date === iso)
        .reduce((s, e) => s + e.amount, 0);
      arr.push({
        date: iso,
        label: d.toLocaleDateString(undefined, { day: "numeric" }),
        total,
      });
    }
    return arr;
  }, [expenses]);

  const totalMonth = categoryData.reduce((s, d) => s + d.value, 0);
  const hasData = totalMonth > 0;

  return (
    <div className="glass rounded-3xl p-6 md:p-7">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-base font-semibold">Insights</h3>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
          Last 14 days · This month
        </span>
      </div>

      {!hasData ? (
        <div className="text-center py-10 text-sm text-muted-foreground">
          Add some expenses to see your charts come to life ✨
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Donut */}
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono mb-2">
              By category
            </div>
            <div className="relative h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {categoryData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => formatCurrency(v)}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono">
                  Total
                </div>
                <div className="num font-display text-lg font-semibold">
                  {formatCurrency(totalMonth)}
                </div>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2 text-xs">
              {categoryData.map((d) => (
                <li key={d.name} className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="truncate text-foreground/80">{d.name}</span>
                  <span className="num text-muted-foreground ml-auto tabular-nums">
                    {((d.value / totalMonth) * 100).toFixed(0)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trend */}
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono mb-2">
              Daily spending
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => formatCurrency(v)}
                    labelFormatter={(l, p) => p?.[0]?.payload?.date ?? l}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#spendFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
