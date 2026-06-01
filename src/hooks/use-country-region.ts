'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { Country, State } from 'country-state-city';

const ALL_COUNTRIES = Country.getAllCountries();

export const COUNTRY_OPTIONS = [...ALL_COUNTRIES]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((c) => ({ label: c.name, value: c.name }));

export function useCountryRegion(
  selectedCountryName: string | undefined,
  onCountryChange?: () => void,
) {
  const prevCountryRef = useRef<string | undefined>(undefined);

  const country = useMemo(
    () => ALL_COUNTRIES.find((c) => c.name === selectedCountryName) ?? null,
    [selectedCountryName],
  );

  const regionOptions = useMemo(() => {
    if (!country) return [];
    return State.getStatesOfCountry(country.isoCode)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((r) => ({ label: r.name, value: r.name }));
  }, [country]);

  const regionDisabled = !selectedCountryName || regionOptions.length === 0;

  const stableOnChange = useCallback(() => onCountryChange?.(), [onCountryChange]);

  useEffect(() => {
    if (prevCountryRef.current === undefined) {
      prevCountryRef.current = selectedCountryName;
      return;
    }
    if (prevCountryRef.current !== selectedCountryName) {
      stableOnChange();
      prevCountryRef.current = selectedCountryName;
    }
  }, [selectedCountryName, stableOnChange]);

  return { countryOptions: COUNTRY_OPTIONS, regionOptions, regionDisabled };
}
