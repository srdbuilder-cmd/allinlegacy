export function Card({ children, className = '', style, ...rest }) {
  return (
    <div
      className={`border rounded-lg bg-white shadow-sm text-brandBlack ${className}`}
      style={{ borderColor: 'var(--card-border)', ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div
      className={`border-b p-3 bg-beigeLight text-brandBlack ${className}`}
      style={{ borderColor: 'var(--card-border)', borderLeft: '4px solid #2C4433' }}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-5 md:p-6 ${className}`}>{children}</div>;
}

export function SectionTitle({ children, className = '' }) {
  return (
    <h2 className={`font-display uppercase tracking-wide text-lg font-normal text-forestDeep mb-4 ${className}`}>
      {children}
    </h2>
  );
}

export function Eyebrow({ children }) {
  return (
    <p className="text-xs uppercase tracking-[0.08em] text-mustard font-semibold mb-2">{children}</p>
  );
}

export function Button({ children, className = '', variant = 'default', type = 'button', ...props }) {
  const styles =
    variant === 'outline'
      ? 'border border-[#545656]/30 bg-white hover:bg-[#DAD0C0]/30 text-brandBlack'
      : variant === 'danger'
        ? 'border border-[#A5442E]/40 text-[#A5442E] bg-white hover:bg-[#A5442E]/10'
        : 'border border-transparent text-white hover:opacity-90';
  const style = variant === 'default' ? { backgroundColor: '#231F20' } : undefined;
  return (
    <button
      type={type}
      className={`px-4 py-2 text-sm font-medium rounded ${styles} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}

export function Toggle({ checked, onChange, title, description }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 w-5 h-5 rounded accent-forestDeep"
      />
      <div>
        <span className="font-semibold text-brandBlack">{title}</span>
        {description && <p className="text-sm text-secondary mt-0.5">{description}</p>}
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

const DOT = {
  forest: 'bg-forest',
  mustard: 'bg-mustard',
  ink: 'bg-brandBlack',
};

export function ColorDot({ color }) {
  return <span className={`inline-block w-3 h-3 rounded-full ${DOT[color] || 'bg-secondary'}`} />;
}
