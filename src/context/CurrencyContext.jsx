// src/context/CurrencyContext.jsx

import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';

// ─── Supported currencies ────────────────────────────────────────────────────
export const CURRENCIES = [
  { code: 'INR', symbol: '₹', locale: 'en-IN',  label: 'INR ₹' },
  { code: 'USD', symbol: '$', locale: 'en-US',  label: 'USD $' },
  { code: 'EUR', symbol: '€', locale: 'de-DE',  label: 'EUR €' },
  { code: 'GBP', symbol: '£', locale: 'en-GB',  label: 'GBP £' },
  { code: 'AED', symbol: 'د.إ', locale: 'ar-AE', label: 'AED د.إ' },
];

// ─── Fallback rates (INR base) — used if the API call fails ─────────────────
// Update these numbers periodically as a safe offline default.
const FALLBACK_RATES = {
  INR: 1,
  USD: 0.01195,
  EUR: 0.01104,
  GBP: 0.00942,
  AED: 0.04389,
};

// ─── Cache key & TTL ─────────────────────────────────────────────────────────
const CACHE_KEY   = 'nexacare_fx_rates';
const CACHE_TS_KEY = 'nexacare_fx_timestamp';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour — free API allows ~1500 req/month

// ─── Context ─────────────────────────────────────────────────────────────────
const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  // Selected currency code, persisted in localStorage
  const [currencyCode, setCurrencyCode] = useState(
    () => localStorage.getItem('nexacare_currency') || 'INR'
  );

  // Exchange rates keyed by currency code, INR = 1 (base)
  const [rates, setRates] = useState(FALLBACK_RATES);

  // Whether a live fetch is in progress (used to show a subtle loading indicator in Topbar if desired)
  const [ratesLoading, setRatesLoading] = useState(false);

  // ── Fetch live rates from open.er-api.com (free, no API key required) ──────
  // Base = INR. Response shape: { result: "success", rates: { USD: 0.012, ... } }
  const fetchRates = useCallback(async () => {
    try {
      setRatesLoading(true);

      // Check localStorage cache first to avoid hammering the API
      const cachedRates = localStorage.getItem(CACHE_KEY);
      const cachedTs    = parseInt(localStorage.getItem(CACHE_TS_KEY) || '0', 10);
      const now         = Date.now();

      if (cachedRates && now - cachedTs < CACHE_TTL_MS) {
        // Cache is fresh — use it, no network call needed
        setRates(JSON.parse(cachedRates));
        return;
      }

      const res  = await fetch('https://open.er-api.com/v6/latest/INR');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.result !== 'success') throw new Error('API returned non-success');

      // Pick only the currencies we support
      const picked = {};
      CURRENCIES.forEach(({ code }) => {
        picked[code] = data.rates[code] ?? FALLBACK_RATES[code];
      });
      // Always ensure INR base = 1
      picked.INR = 1;

      // Persist to localStorage cache
      localStorage.setItem(CACHE_KEY,    JSON.stringify(picked));
      localStorage.setItem(CACHE_TS_KEY, String(now));

      setRates(picked);
    } catch (err) {
      // Silently fall back to hardcoded rates — app stays functional
      console.warn('[CurrencyContext] Live rate fetch failed, using fallback rates.', err.message);
      setRates(FALLBACK_RATES);
    } finally {
      setRatesLoading(false);
    }
  }, []);

  // Fetch rates once on mount
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // ── Derived currency object ───────────────────────────────────────────────
  const currency = useMemo(
    () => CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0],
    [currencyCode]
  );

  // ── formatAmount — converts from INR base, then formats ──────────────────
  // This is memoised: only recreates when currency or rates change.
  // All 16 consumer components call formatAmount(inrValue) — zero other changes needed.
  const formatAmount = useMemo(() => {
    const rate = rates[currencyCode] ?? FALLBACK_RATES[currencyCode] ?? 1;
    return (n) => {
      if (n === null || n === undefined) return '—';
      const converted = Number(n) * rate;
      // Use maximumFractionDigits: 0 for INR (no decimals, matches Indian convention)
      // Use 2 decimal places for all other currencies
      const fractionDigits = currencyCode === 'INR' ? 0 : 2;
      return (
        currency.symbol +
        converted.toLocaleString(currency.locale, {
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits,
        })
      );
    };
  }, [currencyCode, rates, currency]);

  // ── switchCurrency ───────────────────────────────────────────────────────
  const switchCurrency = (code) => {
    localStorage.setItem('nexacare_currency', code);
    setCurrencyCode(code);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyCode,
        switchCurrency,
        formatAmount,
        CURRENCIES,
        ratesLoading,
        rates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);