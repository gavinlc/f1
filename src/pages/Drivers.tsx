import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { useEffect, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { f1Api } from '../services/f1Api';
import { pageTitleStore } from '../stores/pageTitleStore';
import { Skeleton } from '../components/ui/skeleton';
import { Page } from '../components/Page';
import { DriverCard } from '../components/DriverCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Button } from '../components/ui/button';

type SortField = 'firstName' | 'lastName' | 'driverNumber' | 'age';
type SortDirection = 'asc' | 'desc';

export function Drivers() {
  const setDetailsPageTitle = useStore(
    pageTitleStore,
    (state) => state.setDetailsPageTitle,
  );

  const [sortField, setSortField] = useState<SortField>('lastName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    setDetailsPageTitle('');
  }, [setDetailsPageTitle]);

  const { data, isLoading } = useQuery({
    queryKey: ['drivers', '2025'],
    queryFn: () => f1Api.getDrivers('2025'),
  });

  if (isLoading) {
    return (
      <Page>
        <div className="space-y-6">
          <h1>Loading...</h1>
          <Skeleton className="h-10 w-48" data-testid="skeleton" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Page>
    );
  }

  const drivers = data?.MRData.DriverTable.Drivers || [];

  const sortedDrivers = [...drivers].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;

    switch (sortField) {
      case 'firstName':
        return multiplier * a.givenName.localeCompare(b.givenName);
      case 'lastName':
        return multiplier * a.familyName.localeCompare(b.familyName);
      case 'driverNumber':
        return (
          multiplier *
          (parseInt(a.permanentNumber || '0') -
            parseInt(b.permanentNumber || '0'))
        );
      case 'age': {
        const ageA =
          new Date().getFullYear() - new Date(a.dateOfBirth).getFullYear();
        const ageB =
          new Date().getFullYear() - new Date(b.dateOfBirth).getFullYear();
        return multiplier * (ageA - ageB);
      }
      default:
        return 0;
    }
  });

  return (
    <Page>
      <div className="mb-6 flex items-center gap-4">
        <Select
          value={sortField}
          onValueChange={(value) => setSortField(value as SortField)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="firstName">First Name</SelectItem>
            <SelectItem value="lastName">Last Name</SelectItem>
            <SelectItem value="driverNumber">Driver Number</SelectItem>
            <SelectItem value="age">Age</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
          }
          aria-label="sort direction"
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedDrivers.map((driver) => (
          <Link
            key={driver.driverId}
            to="/drivers/$driverId"
            params={{ driverId: driver.driverId }}
            className="group"
          >
            <DriverCard driver={driver} />
          </Link>
        ))}
      </div>
    </Page>
  );
}
