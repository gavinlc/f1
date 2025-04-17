import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { useEffect } from 'react';
import { f1Api } from '../services/f1Api';
import { pageTitleStore } from '../stores/pageTitleStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Page } from '../components/Page';
import { CountryFlag } from '../components/CountryFlag';

export function Circuits() {
  const setDetailsPageTitle = useStore(
    pageTitleStore,
    (state) => state.setDetailsPageTitle,
  );

  useEffect(() => {
    setDetailsPageTitle('');
  }, [setDetailsPageTitle]);

  const { data, isLoading } = useQuery({
    queryKey: ['circuits', '2025'],
    queryFn: () => f1Api.getCircuitsForSeason('2025'),
  });

  if (isLoading) {
    return (
      <Page>
        <div className="space-y-6">
          <h1>Loading...</h1>
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="hover:bg-accent transition-colors">
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Page>
    );
  }

  const circuits = data?.MRData.CircuitTable.Circuits || [];

  // Sort circuits alphabetically by circuitName
  const sortedCircuits = [...circuits].sort((a, b) =>
    a.circuitName.localeCompare(b.circuitName),
  );

  return (
    <Page>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCircuits.map((circuit) => (
          <Link
            key={circuit.circuitId}
            to="/circuits/$circuitId"
            params={{ circuitId: circuit.circuitId }}
            className="group"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CountryFlag
                    nationality={circuit.Location.country}
                    className="w-6 h-4"
                  />
                  {circuit.circuitName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-muted-foreground">
                  <p>
                    <span className="font-medium">Location:</span>
                    <br />
                    {circuit.Location.locality}, {circuit.Location.country}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Page>
  );
}
