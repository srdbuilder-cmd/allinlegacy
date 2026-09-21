export function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 ${className}`}>{children}</div>;
}

export function SectionTitle({ children, color = 'text-slate-900' }) {
  return <h2 className={`text-xl font-bold mb-4 ${color}`}>{children}</h2>;
}

export function Toggle({ checked, onChange, title, description, accent = 'indigo' }) {
  const accents = {
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    amber: 'text-amber-600',
  };
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className={`mt-1 w-5 h-5 rounded ${accents[accent] || accents.indigo}`}
      />
      <div>
        <span className="font-semibold text-slate-900">{title}</span>
        {description && <p className="text-sm text-slate-600 mt-0.5">{description}</p>}
      </div>
    </label>
  );
}

export function AlertCircle({ className = '', size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function ColorDot({ color }) {
  const map = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
  };
  return <span className={`inline-block w-3 h-3 rounded-full ${map[color] || 'bg-slate-500'}`} />;
}
