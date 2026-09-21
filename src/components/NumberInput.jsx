import { useEffect, useState } from 'react';

export default function NumberInput({
  label,
  value,
  onChange,
  helpText,
  disabled = false,
  allowDecimal = false,
  suffix,
}) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) return;
    if (value === null || value === undefined || Number.isNaN(value)) {
      setDisplayValue('');
      return;
    }
    setDisplayValue(
      allowDecimal ? Number(value).toLocaleString('en-US', { maximumFractionDigits: 4 }) : Math.round(value).toLocaleString('en-US')
    );
  }, [value, isFocused, allowDecimal]);

  const commit = (raw) => {
    const numValue = parseFloat(String(raw).replace(/,/g, ''));
    if (!Number.isNaN(numValue)) onChange(numValue);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-brandBlack mb-1">{label}</label>}
      <div className="relative">
        <input
          type="text"
          inputMode={allowDecimal ? 'decimal' : 'numeric'}
          value={displayValue}
          disabled={disabled}
          onChange={(event) => {
            setDisplayValue(event.target.value);
            const cleaned = event.target.value.replace(/,/g, '');
            const num = allowDecimal ? parseFloat(cleaned) : parseInt(cleaned, 10);
            if (!Number.isNaN(num)) onChange(num);
          }}
          onFocus={() => {
            setIsFocused(true);
            setDisplayValue(value === null || value === undefined ? '' : String(value));
          }}
          onBlur={() => {
            setIsFocused(false);
            commit(displayValue);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
          }}
          className={`w-full px-3 py-2 border border-[#C8BCA6] rounded-md bg-white text-brandBlack focus:outline-none focus:ring-2 focus:ring-mustard focus:border-mustard ${
            disabled ? 'bg-beigeLight text-secondary' : ''
          }`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary">{suffix}</span>}
      </div>
      {helpText && <p className="text-xs text-secondary mt-1">{helpText}</p>}
    </div>
  );
}
