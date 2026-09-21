import { useMemo, useState } from 'react';
import { formatCompactCurrency, formatCurrency } from '../utils/formatters.js';

const COLORS = {
  1: '#7c3aed',
  2: '#2563eb',
  3: '#d97706',
};

const LABELS = {
  1: 'Care Facility',
  2: 'Build Casita',
  3: 'Sell & Build New',
};

export default function WealthChart({ results }) {
  const [hover, setHover] = useState(null);
  const width = 720;
  const height = 320;
  const pad = { top: 24, right: 20, bottom: 36, left: 64 };

  const series = useMemo(() => {
    const points = [1, 2, 3].map((id) => (results[id] || []).map((row) => ({ year: row.year, value: row.totalWealth })));
    const values = points.flatMap((list) => list.map((item) => item.value));
    const years = points[0]?.map((item) => item.year) || [];
    const min = Math.min(0, ...values);
    const max = Math.max(...values, 1);
    return { points, years, min, max };
  }, [results]);

  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const x = (year) => {
    const maxYear = series.years[series.years.length - 1] || 1;
    return pad.left + ((year - 1) / Math.max(1, maxYear - 1)) * innerW;
  };
  const y = (value) => {
    const span = series.max - series.min || 1;
    return pad.top + (1 - (value - series.min) / span) * innerH;
  };

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => series.min + ((series.max - series.min) * i) / ticks);

  const toPath = (list) =>
    list.map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(point.year)} ${y(point.value)}`).join(' ');

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label="Family net worth over time for the three care scenarios"
        onMouseLeave={() => setHover(null)}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" />
            <text x={pad.left - 8} y={y(tick) + 4} textAnchor="end" className="fill-slate-500" fontSize="11">
              {formatCompactCurrency(tick)}
            </text>
          </g>
        ))}
        {series.years
          .filter((year) => year === 1 || year % 5 === 0 || year === series.years[series.years.length - 1])
          .map((year) => (
            <text key={year} x={x(year)} y={height - 10} textAnchor="middle" className="fill-slate-500" fontSize="11">
              Yr {year}
            </text>
          ))}
        {[1, 2, 3].map((id) => (
          <path key={id} d={toPath(series.points[id - 1])} fill="none" stroke={COLORS[id]} strokeWidth="2.5" />
        ))}
        {series.years.map((year, index) => (
          <rect
            key={year}
            x={x(year) - innerW / (series.years.length * 2)}
            y={pad.top}
            width={innerW / series.years.length}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHover(index)}
          />
        ))}
        {hover !== null && series.years[hover] && (
          <line
            x1={x(series.years[hover])}
            x2={x(series.years[hover])}
            y1={pad.top}
            y2={height - pad.bottom}
            stroke="#94a3b8"
            strokeDasharray="4 4"
          />
        )}
      </svg>
      <div className="flex flex-wrap gap-4 mt-3 text-sm">
        {[1, 2, 3].map((id) => (
          <div key={id} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[id] }} />
            <span className="text-slate-700">{LABELS[id]}</span>
          </div>
        ))}
      </div>
      {hover !== null && results[1][hover] && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          {[1, 2, 3].map((id) => (
            <div key={id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-slate-500">Year {results[id][hover].year} · {LABELS[id]}</div>
              <div className="font-semibold" style={{ color: COLORS[id] }}>
                {formatCurrency(results[id][hover].totalWealth)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
