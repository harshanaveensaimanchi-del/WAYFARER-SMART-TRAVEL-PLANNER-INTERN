import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { CurrencyInfo, CURRENCIES, getCurrencyInfo } from '../data/currencies';

export interface ExchangeRates {
  [key: string]: number;
}

export interface UseCurrencyReturn {
  currency: CurrencyInfo;
  setCurrencyCode: (code: string) => void;
  rates: ExchangeRates;
  ratesLoading: boolean;
  ratesError: string | null;
  lastUpdated: string | null;
  convert: (amountUSD: number) => number;
  formatMoney: (amountUSD: number) => string;
  refreshRates: () => Promise<void>;
  exchangeRateText: string;
}

// Built-in baseline rates in case the API is offline, loading, or network is restricted
const BASELINE_RATES: ExchangeRates = CURRENCIES.reduce((acc, curr) => {
  acc[curr.code] = curr.rateVsUSD;
  return acc;
}, {} as ExchangeRates);

export function useCurrency(): UseCurrencyReturn {
  // Default to INR for an Indian user, or whatever was saved
  const [currencyCode, setCurrencyCode] = useLocalStorage<string>('wf.currency', 'INR');
  const [rates, setRates] = useLocalStorage<ExchangeRates>('wf.rates', BASELINE_RATES);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useLocalStorage<string | null>(
    'wf.ratesUpdated',
    new Date().toISOString()
  );
  const fetchingRef = useRef(false);

  const currency = getCurrencyInfo(currencyCode);

  const fetchRates = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setRatesLoading(true);
    setRatesError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch('https://open.er-api.com/v6/latest/USD', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.result === 'success' && data.rates) {
        setRates((prev) => ({
          ...prev,
          ...data.rates,
        }));
        setLastUpdated(new Date().toISOString());
      }
    } catch (err: any) {
      // Graceful fallback to baseline rates
      console.warn('Real-time rates notice (using current reliable rates):', err.message);
      setRatesError('Using standard market rates');
      setRates((prev) => ({
        ...BASELINE_RATES,
        ...prev,
      }));
    } finally {
      setRatesLoading(false);
      fetchingRef.current = false;
    }
  }, [setRates, setLastUpdated]);

  // Fetch live rates on mount
  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  // Convert USD amount to selected currency
  const convert = useCallback(
    (amountUSD: number): number => {
      const num = Number(amountUSD) || 0;
      if (currencyCode === 'USD') return num;
      const rate = rates[currencyCode] || currency.rateVsUSD || 1;
      return num * rate;
    },
    [currencyCode, rates, currency]
  );

  // Format a USD amount as the selected currency string
  const formatMoney = useCallback(
    (amountUSD: number): string => {
      const converted = convert(amountUSD);
      try {
        const isWhole = Math.abs(converted % 1) < 0.05;
        const maxDecimals = (currency.code === 'JPY' || currency.code === 'INR' || isWhole) ? 0 : 2;

        return new Intl.NumberFormat(currency.locale, {
          style: 'currency',
          currency: currency.code,
          maximumFractionDigits: maxDecimals,
          minimumFractionDigits: 0,
        }).format(converted);
      } catch {
        return `${currency.symbol}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      }
    },
    [convert, currency]
  );

  const currentRate = rates[currencyCode] || currency.rateVsUSD || 1;
  const exchangeRateText =
    currencyCode === 'USD'
      ? '1 USD = $1.00 USD'
      : `1 USD ≈ ${currency.symbol}${currentRate.toFixed(2)} ${currencyCode}`;

  return {
    currency,
    setCurrencyCode,
    rates,
    ratesLoading,
    ratesError,
    lastUpdated,
    convert,
    formatMoney,
    refreshRates: fetchRates,
    exchangeRateText,
  };
}
