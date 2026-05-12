interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

export default function StatBar({ label, value, max = 20, color = 'bg-jianghu-gold' }: StatBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="flex items-center gap-2">
      <span className="text-jianghu-ink/60 text-sm w-12 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-jianghu-bg rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-jianghu-ink text-sm w-6 text-right">{value}</span>
    </div>
  );
}
