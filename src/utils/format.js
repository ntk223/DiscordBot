const formatPercent = (value) => (Number.isFinite(value) ? `${value.toFixed(1)}%` : 'N/A');

const formatNumber = (value, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : 'N/A';

const formatBytes = (dataSize) =>
  dataSize && typeof dataSize.toString === 'function' ? dataSize.toString('auto') : 'N/A';

const truncateText = (value, maxLength = 48) => {
  if (!value || typeof value !== 'string') {
    return '';
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
};

module.exports = {
  formatPercent,
  formatNumber,
  formatBytes,
  truncateText
};
