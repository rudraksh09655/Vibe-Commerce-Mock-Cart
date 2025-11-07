// frontend/src/utils/currency.js

// Static conversion rate (update later or fetch from an API)
export const USD_TO_INR = 83.0;

// format USD
export function formatUSD(amountUSD) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amountUSD);
}

// convert USD -> INR (numeric)
export function convertToINR(amountUSD) {
  return amountUSD * USD_TO_INR;
}

// format INR (Indian numbering and symbol)
export function formatINR(amountUSD) {
  const amountINR = convertToINR(amountUSD);
  // Use en-IN for formatting; show no decimals (typical for small apps)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountINR);
}
