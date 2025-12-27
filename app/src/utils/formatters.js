export const formatCurrency = (value) => {
  if (isNaN(value) || value === null || value === undefined) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercentage = (value) => {
  if (!isFinite(value) || isNaN(value)) return 'N/A';
  const sign = value > 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(1)}%`;
};

export const formatNumber = (value) => {
  if (isNaN(value) || value === null || value === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(value);
};
