import * as Flags from 'country-flag-icons/react/3x2';
import { useCountryCode } from '../hooks/useCountryCode';

interface CountryFlagProps {
  nationality: string;
  className?: string;
}

export function CountryFlag({ nationality, className }: CountryFlagProps) {
  const countryCode = useCountryCode(nationality);
  if (!countryCode) return null;

  const Flag = Flags[countryCode as keyof typeof Flags] as
    | React.ComponentType<{ className?: string }>
    | undefined;
  if (!Flag) return null;

  return <Flag className={className} />;
}
