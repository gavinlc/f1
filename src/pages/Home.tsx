import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@tanstack/react-store';
import { useEffect } from 'react';
import { f1Api } from '../services/f1Api';
import { pageTitleStore } from '../stores/pageTitleStore';
import { StandingsTable } from '../components/StandingsTable';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Page } from '../components/Page';

export function Home() {
  const setDetailsPageTitle = useStore(
    pageTitleStore,
    (state) => state.setDetailsPageTitle,
  );

  useEffect(() => {
    setDetailsPageTitle('');
  }, [setDetailsPageTitle]);

  const {
    data: driverStandingsData,
    isLoading: isLoadingDriverStandings,
    error: driverStandingsError,
  } = useQuery({
    queryKey: ['driver-standings', '2025'],
    queryFn: () => f1Api.getDriverStandings('2025'),
  });

  const {
    data: constructorStandingsData,
    isLoading: isLoadingConstructorStandings,
    error: constructorStandingsError,
  } = useQuery({
    queryKey: ['constructor-standings', '2025'],
    queryFn: () => f1Api.getConstructorStandings('2025'),
  });

  const sections = [
    {
      title: '2025 Results',
      description: 'View race results and standings for the 2025 season',
      path: '/results',
    },

    {
      title: '2025 Drivers',
      description: 'View current Formula 1 drivers and their information',
      path: '/drivers',
    },
    {
      title: '2025 Constructors',
      description: 'Explore Formula 1 teams and their details',
      path: '/constructors',
    },
    {
      title: '2025 Circuits',
      description: 'Browse Formula 1 circuits used in the 2025 season',
      path: '/circuits',
    },
  ];

  return (
    <Page>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Welcome to F1 Browser</h1>
        <p className="text-muted-foreground">
          Explore Formula 1 data from the Ergast API. Browse through circuits,
          drivers, constructors, and race results.
        </p>
      </header>
      <div className="flex flex-col gap-6">
        <section
          aria-labelledby="standings-heading"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <h2 id="standings-heading" className="sr-only">
            Current Standings
          </h2>
          <div>
            {isLoadingDriverStandings ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" data-testid="skeleton" />
                <Skeleton className="h-[200px] w-full" data-testid="skeleton" />
              </div>
            ) : driverStandingsError ? (
              <div className="p-4 border border-destructive rounded-lg">
                <p className="text-destructive">
                  Failed to load driver standings
                </p>
              </div>
            ) : (
              <StandingsTable
                title="Driver Standings"
                standings={
                  driverStandingsData?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings.slice(
                    0,
                    10,
                  ) ?? []
                }
                type="driver"
              />
            )}
          </div>

          <div>
            {isLoadingConstructorStandings ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" data-testid="skeleton" />
                <Skeleton className="h-[200px] w-full" data-testid="skeleton" />
              </div>
            ) : constructorStandingsError ? (
              <div className="p-4 border border-destructive rounded-lg">
                <p className="text-destructive">
                  Failed to load constructor standings
                </p>
              </div>
            ) : (
              <StandingsTable
                title="Constructor Standings"
                standings={
                  constructorStandingsData?.MRData.StandingsTable
                    .StandingsLists[0]?.ConstructorStandings ?? []
                }
                type="constructor"
              />
            )}
          </div>
        </section>

        <section
          aria-labelledby="navigation-heading"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <h2 id="navigation-heading" className="sr-only">
            Quick Navigation
          </h2>
          {sections.map((section) => (
            <Link key={section.path} to={section.path} className="group">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle
                    data-testid={`${section.title.toLowerCase()}-card-title`}
                  >
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      </div>
    </Page>
  );
}
