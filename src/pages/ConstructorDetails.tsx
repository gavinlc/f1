import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { useEffect } from 'react';
import { f1Api } from '../services/f1Api';
import { pageTitleStore } from '../stores/pageTitleStore';
import { Page } from '../components/Page';
import { CountryFlag } from '../components/CountryFlag';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { DriverCard } from '../components/DriverCard';
import { RaceResultsTable } from '../components/RaceResultsTable';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { NotFoundMessage } from '../components/NotFoundMessage';

export function ConstructorDetails() {
  const { constructorId } = useParams({ from: '/constructors/$constructorId' });
  const setDetailsPageTitle = useStore(
    pageTitleStore,
    (state) => state.setDetailsPageTitle,
  );

  const { data: constructorData, isLoading: isLoadingConstructor } = useQuery({
    queryKey: ['constructor', constructorId],
    queryFn: () => f1Api.getConstructor(constructorId),
  });

  const { data: resultsData, isLoading: isLoadingResults } = useQuery({
    queryKey: ['constructor-results', constructorId, '2025'],
    queryFn: () => f1Api.getConstructorResults(constructorId, '2025'),
  });

  const { data: driversData, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ['constructor-drivers', constructorId, '2025'],
    queryFn: () => f1Api.getConstructorDrivers(constructorId, '2025'),
  });

  const { data: allRacesData, isLoading: isLoadingRaces } = useQuery({
    queryKey: ['races', '2025'],
    queryFn: () => f1Api.getRaces('2025'),
  });

  // Query for sprint results for each race
  const { data: sprintResultsData, isLoading: isLoadingSprintResults } =
    useQuery({
      queryKey: ['constructor-sprint-results', constructorId, '2025'],
      queryFn: async () => {
        const races = allRacesData?.MRData.RaceTable.Races || [];
        console.log('Fetching sprint results for races:', races);
        const sprintResults = await Promise.all(
          races.map(async (race) => {
            try {
              const result = await f1Api.getSprintResults('2025', race.round);
              console.log(`Sprint result for race ${race.round}:`, result);
              const sprintResults =
                result.MRData.RaceTable.Races[0]?.SprintResults;
              // Only return the result if it has sprint results
              if (sprintResults && sprintResults.length > 0) {
                return {
                  round: race.round,
                  Results: sprintResults,
                };
              }
              return null;
            } catch (error) {
              console.log(`No sprint result for race ${race.round}`);
              return null;
            }
          }),
        );
        const filteredResults = sprintResults.filter(Boolean);
        console.log('Final sprint results:', filteredResults);
        return filteredResults;
      },
      enabled: !!allRacesData,
    });

  useEffect(() => {
    if (constructorData?.MRData.ConstructorTable.Constructors[0]) {
      const constructor =
        constructorData.MRData.ConstructorTable.Constructors[0];
      setDetailsPageTitle(constructor.name);
    }
  }, [constructorData, setDetailsPageTitle]);

  if (
    isLoadingConstructor ||
    isLoadingResults ||
    isLoadingDrivers ||
    isLoadingRaces ||
    isLoadingSprintResults
  ) {
    return <LoadingSkeleton type="constructor" />;
  }

  const constructor = constructorData?.MRData.ConstructorTable.Constructors[0];
  const results = resultsData?.MRData.RaceTable.Races || [];
  const drivers = driversData?.MRData.DriverTable.Drivers || [];
  const allRaces = allRacesData?.MRData.RaceTable.Races || [];
  const sprintResults = sprintResultsData || [];

  if (!constructor) {
    return <NotFoundMessage type="constructor" />;
  }

  return (
    <Page>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CountryFlag
                nationality={constructor.nationality}
                className="w-6 h-4"
              />
              <CardTitle>{constructor.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Nationality:</span>{' '}
                {constructor.nationality}
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="drivers">
          <TabsList>
            <TabsTrigger value="drivers">2025 Drivers</TabsTrigger>
            <TabsTrigger value="results">2025 Results</TabsTrigger>
          </TabsList>
          <TabsContent value="drivers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drivers.map((driver) => (
                <DriverCard key={driver.driverId} driver={driver} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="results">
            <RaceResultsTable
              races={allRaces}
              results={results as any}
              sprintResults={sprintResults as any}
              drivers={drivers}
              viewMode="constructor"
            />
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
}
