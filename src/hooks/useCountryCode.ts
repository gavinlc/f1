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

/**
 * Hook to get the country code for a given nationality
 * @param nationality - The nationality to get the country code for
 * @returns The country code or undefined if not found
 */
export function useCountryCode(nationality: string): string | undefined {
  return useMemo(() => nationalityToCountryCode[nationality], [nationality]);
}
