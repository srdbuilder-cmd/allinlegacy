export function formatNumber(num) {
  if (!Number.isFinite(num)) return '0';
  return Math.round(num).toLocaleString('en-US');
}

export function formatCurrency(num) {
  const value = Number.isFinite(num) ? num : 0;
  const sign = value < 0 ? '-' : '';
  return `${sign}$${formatNumber(Math.abs(value))}`;
}

export function formatSignedCurrency(num) {
  const value = Number.isFinite(num) ? num : 0;
  if (value > 0) return `+${formatCurrency(value)}`;
  return formatCurrency(value);
}

export function formatPercent(num, digits = 1) {
  if (!Number.isFinite(num)) return '0%';
  return `${num.toFixed(digits)}%`;
}

export function formatCompactCurrency(num) {
  const value = Number.isFinite(num) ? num : 0;
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  return formatCurrency(value);
}
