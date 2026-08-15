import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
type Point = { day: string; minutes: number; words: number };

const emptyWeek: Point[] = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => ({
  day,
  minutes: 0,
  words: 0,
}));
const emptyWords = [1, 2, 3, 4].map((n) => ({ week: `${n} нед.`, words: 0 }));

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "14px",
  color: "var(--popover-foreground)",
  fontSize: "12px",
} as const;

export function WeeklyActivityChart({
  height = 220,
  data,
}: {
  height?: number;
  data?: Point[];
}) {
  const weeklyActivity = data?.length ? data : emptyWeek;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={weeklyActivity} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
        <defs>
          <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-red)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="var(--brand-red)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
        <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} мин`, "Занятия"]} />
        <Area
          type="monotone"
          dataKey="minutes"
          stroke="var(--brand-red)"
          strokeWidth={2.5}
          fill="url(#actGrad)"
          animationDuration={1200}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function WordsChart({ data }: { data?: { week: string; words: number }[] }) {
  const weeklyWords = data?.length ? data : emptyWords;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={weeklyWords} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
        <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
        <Tooltip cursor={{ fill: "var(--secondary)" }} contentStyle={tooltipStyle} formatter={(v) => [`${v} слов`, "Выучено"]} />
        <Bar dataKey="words" radius={[10, 10, 4, 4]} fill="var(--brand-green)" animationDuration={1200} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AccuracyChart({ accuracy }: { accuracy?: number | null }) {
  const value = accuracy ?? 0;
  const accuracyData = [
    { name: "Верно", value },
    { name: "Ошибки", value: 100 - value },
  ];
  const colors = ["var(--brand-green)", "var(--secondary)"];
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={accuracyData}
            dataKey="value"
            innerRadius={62}
            outerRadius={86}
            paddingAngle={3}
            stroke="none"
            animationDuration={1200}
          >
            {accuracyData.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, ""]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-display text-2xl font-bold">{accuracy === null || accuracy === undefined ? "—" : `${value}%`}</div>
          <div className="text-xs text-muted-foreground">точность</div>
        </div>
      </div>
    </div>
  );
}