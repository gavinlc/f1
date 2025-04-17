import { useMemo } from 'react';

const nationalityToCountryCode: Record<string, string> = {
  American: 'US',
  Argentine: 'AR',
  Australian: 'AU',
  Austrian: 'AT',
  Belgian: 'BE',
  Brazilian: 'BR',
  British: 'GB',
  Canadian: 'CA',
  Chinese: 'CN',
  Colombian: 'CO',
  Danish: 'DK',
  Dutch: 'NL',
  Finnish: 'FI',
  French: 'FR',
  German: 'DE',
  Indian: 'IN',
  Italian: 'IT',
  Japanese: 'JP',
  Mexican: 'MX',
  Monégasque: 'MC',
  Monegasque: 'MC',
  'New Zealander': 'NZ',
  Polish: 'PL',
  Portuguese: 'PT',
  Russian: 'RU',
  Spanish: 'ES',
  Swedish: 'SE',
  Swiss: 'CH',
  Thai: 'TH',
  Venezuelan: 'VE',
};

const countryToCountryCode: Record<string, string> = {
  'United States': 'US',
  'United States of America': 'US',
  Argentina: 'AR',
  Australia: 'AU',
  Austria: 'AT',
  Belgium: 'BE',
  Brazil: 'BR',
  'United Kingdom': 'GB',
  'Great Britain': 'GB',
  Canada: 'CA',
  China: 'CN',
  Colombia: 'CO',
  Denmark: 'DK',
  Netherlands: 'NL',
  Finland: 'FI',
  France: 'FR',
  Germany: 'DE',
  India: 'IN',
  Italy: 'IT',
  Japan: 'JP',
  Mexico: 'MX',
  Monaco: 'MC',
  'New Zealand': 'NZ',
  Poland: 'PL',
  Portugal: 'PT',
  Russia: 'RU',
  Spain: 'ES',
  Sweden: 'SE',
  Switzerland: 'CH',
  Thailand: 'TH',
  Venezuela: 'VE',
  Bahrain: 'BH',
  'Saudi Arabia': 'SA',
  Azerbaijan: 'AZ',
  Hungary: 'HU',
  Singapore: 'SG',
  Qatar: 'QA',
  'United Arab Emirates': 'AE',
  UAE: 'AE',
  Holland: 'NL',
};

/**
 * Hook to get the country code for a given nationality or country name
 * @param input - The nationality or country name to get the country code for
 * @returns The country code or undefined if not found
 */
export function useCountryCode(input: string): string | undefined {
  return useMemo(() => {
    // First check if it's a nationality
    const nationalityCode = nationalityToCountryCode[input];
    if (nationalityCode) return nationalityCode;

    // Then check if it's a country name
    return countryToCountryCode[input];
  }, [input]);
}
