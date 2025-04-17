import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { useEffect } from 'react';
import { f1Api } from '../services/f1Api';
import { pageTitleStore } from '../stores/pageTitleStore';
import { Skeleton } from '../components/ui/skeleton';
import { Page } from '../components/Page';
import { DriverCard } from '../components/DriverCard';

export function Drivers() {
  const setDetailsPageTitle = useStore(
    pageTitleStore,
    (state) => state.setDetailsPageTitle,
  );

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

  return (
    <Page>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
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
