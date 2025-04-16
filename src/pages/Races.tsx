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

export function Races() {
  const setTitle = useStore(pageTitleStore, (state) => state.setTitle);

  useEffect(() => {
    setTitle('');
  }, [setTitle]);

  const { data, isLoading } = useQuery({
    queryKey: ['races', '2025'],
    queryFn: async () => {
      const response = await f1Api.getRaces('2025');
      return response;
    },
  });

  return (
    <Page>
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.MRData.RaceTable.Races.map((race) => (
            <Link
              key={race.round}
              to="/races/$raceId"
              params={{ raceId: race.round }}
            >
              <Card className="hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle>{race.raceName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {race.Circuit.circuitName}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(race.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Page>
  );
}
