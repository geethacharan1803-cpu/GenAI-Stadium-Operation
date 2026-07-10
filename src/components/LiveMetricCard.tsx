import { useEffect, useRef, useState } from 'react';

interface LiveMetricCardProps {
  label: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  iconBg?: 'teal' | 'crimson' | 'gold' | 'blue';
  icon: React.ReactNode;
}

export default function LiveMetricCard({
  label,
  value,
  unit = '',
  trend = 'stable',
  trendValue = 0,
  iconBg = 'teal',
  icon,
}: LiveMetricCardProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(start + (end - start) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    prevValue.current = value;
  }, [value]);

  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <div className="glass-card metric-card">
      <div className={`metric-card-icon ${iconBg}`}>
        {icon}
      </div>
      <div className="metric-value" aria-live="polite">
        {displayValue.toLocaleString()}{unit && <span style={{ fontSize: '0.5em', opacity: 0.7 }}> {unit}</span>}
      </div>
      <div className="metric-label">{label}</div>
      {trendValue !== 0 && (
        <div className={`metric-trend ${trend}`}>
          <span>{trendArrow}</span>
          <span>{Math.abs(trendValue)}%</span>
        </div>
      )}
    </div>
  );
}
