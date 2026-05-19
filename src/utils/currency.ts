import type { CurrencyCode } from '../types';

const currencyConfig: Record<CurrencyCode, { symbol: string; locale: string; name: string }> = {
  USD: { symbol: '$', locale: 'en-US', name: 'US Dollar' },
  EUR: { symbol: '\u20AC', locale: 'de-DE', name: 'Euro' },
  GBP: { symbol: '\u00A3', locale: 'en-GB', name: 'British Pound' },
  HKD: { symbol: 'HK$', locale: 'en-HK', name: 'Hong Kong Dollar' },
  JPY: { symbol: '\u00A5', locale: 'ja-JP', name: 'Japanese Yen' },
  CHF: { symbol: 'CHF', locale: 'de-CH', name: 'Swiss Franc' },
  CAD: { symbol: 'CA$', locale: 'en-CA', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar' },
  CNY: { symbol: '\u00A5', locale: 'zh-CN', name: 'Chinese Yuan' },
  SGD: { symbol: 'S$', locale: 'en-SG', name: 'Singapore Dollar' },
};

export function getCurrencySymbol(code: CurrencyCode): string {
  return currencyConfig[code].symbol;
}

export function formatCurrencyValue(
  value: number,
  currency: CurrencyCode,
  options?: { compact?: boolean; decimals?: number }
): string {
  const { symbol } = currencyConfig[currency];
  const decimals = options?.decimals ?? (currency === 'JPY' ? 0 : 2);

  if (options?.compact) {
    if (Math.abs(value) >= 1e12) return `${symbol}${(value / 1e12).toFixed(2)}T`;
    if (Math.abs(value) >= 1e9) return `${symbol}${(value / 1e9).toFixed(2)}B`;
    if (Math.abs(value) >= 1e6) return `${symbol}${(value / 1e6).toFixed(2)}M`;
  }

  return `${symbol}${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function getCurrencyName(code: CurrencyCode): string {
  return currencyConfig[code].name;
}
