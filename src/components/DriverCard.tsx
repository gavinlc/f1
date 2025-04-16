import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CountryFlag } from './CountryFlag';
import { useAge } from '../hooks/useAge';
import type { Driver } from '../types/f1';

interface DriverCardProps {
  driver: Driver;
}

export function DriverCard({ driver }: DriverCardProps) {
  const age = useAge(driver.dateOfBirth);

  return (
    <Card key={driver.driverId}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CountryFlag nationality={driver.nationality} className="w-6 h-4" />
          {driver.givenName} {driver.familyName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-muted-foreground">
          <p>
            <span className="font-medium">Number:</span>{' '}
            {driver.permanentNumber || 'N/A'}
          </p>
          <p>
            <span className="font-medium">Code:</span> {driver.code || 'N/A'}
          </p>
          <p>
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
