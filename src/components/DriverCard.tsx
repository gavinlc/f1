import { useAge } from '../hooks/useAge';
import { CountryFlag } from './CountryFlag';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

import type { Driver } from '@/types/f1';

interface DriverCardProps {
  driver: Driver;
}

export function DriverCard({ driver }: DriverCardProps) {
  const age = useAge(driver.dateOfBirth);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CountryFlag nationality={driver.nationality} className="w-5 h-4" />
          <CardTitle className="text-lg">
            {`${driver.givenName} ${driver.familyName} (${driver.code})`}
          </CardTitle>
        </div>
        <CardDescription>Driver #{driver.permanentNumber}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <div className="text-sm text-muted-foreground">
          <p data-testid="nationality">
            <span className="font-medium">Nationality:</span>{' '}
            {driver.nationality}
          </p>
          <p>
            <span className="font-medium">Age:</span> {age}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
