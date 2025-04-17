import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { useEffect } from 'react';
import { f1Api } from '../services/f1Api';
import { pageTitleStore } from '../stores/pageTitleStore';
import { Page } from '../components/Page';
import { CountryFlag } from '../components/CountryFlag';
import { useAge } from '../hooks/useAge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { RaceResultsTable } from '../components/RaceResultsTable';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { NotFoundMessage } from '../components/NotFoundMessage';

export function DriverDetails() {
  const { driverId } = useParams({ from: '/drivers/$driverId' });
  const setDetailsPageTitle = useStore(
    pageTitleStore,
    (state) => state.setDetailsPageTitle,
  );

  const { data: driverData, isLoading: isLoadingDriver } = useQuery({
    queryKey: ['driver', driverId],
    queryFn: () => f1Api.getDriver(driverId),
  });

  const { data: resultsData, isLoading: isLoadingResults } = useQuery({
    queryKey: ['driver-results', driverId, '2025'],
    queryFn: () => f1Api.getDriverResults(driverId, '2025'),
  });

  const { data: allRacesData, isLoading: isLoadingRaces } = useQuery({
    queryKey: ['races', '2025'],
    queryFn: () => f1Api.getRaces('2025'),
  });

  // Query for sprint results for each race
  const { data: sprintResultsData, isLoading: isLoadingSprintResults } =
    useQuery({
      queryKey: ['driver-sprint-results', driverId, '2025'],
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

  const driver = driverData?.MRData.DriverTable.Drivers[0];
  const age = useAge(driver?.dateOfBirth || '');

  useEffect(() => {
    if (driver) {
      setDetailsPageTitle(`${driver.givenName} ${driver.familyName}`);
    }
  }, [driver, setDetailsPageTitle]);

  if (
    isLoadingDriver ||
    isLoadingResults ||
    isLoadingRaces ||
    isLoadingSprintResults
  ) {
    return <LoadingSkeleton type="driver" />;
  }

  const results = resultsData?.MRData.RaceTable.Races || [];
  const allRaces = allRacesData?.MRData.RaceTable.Races || [];
  const sprintResults = sprintResultsData || [];

  if (!driver) {
    return <NotFoundMessage type="driver" />;
  }

  // Get the constructor from the most recent race result
  const mostRecentResult = results.length > 0 ? results[0].Results?.[0] : null;
  const constructor = mostRecentResult?.Constructor;

  return (
    <Page>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CountryFlag
                nationality={driver.nationality}
                className="w-6 h-4"
              />
              <CardTitle>{`${driver.givenName} ${driver.familyName}`}</CardTitle>
            </div>
            <CardDescription>Driver #{driver.permanentNumber}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Nationality:</span>{' '}
                {driver.nationality}
              </p>
              <p>
                <span className="font-medium">Age:</span> {age}
              </p>
              {constructor && (
                <p>
                  <span className="font-medium">Constructor:</span>{' '}
                  {constructor.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2025 Results</CardTitle>
          </CardHeader>
          <CardContent>
            <RaceResultsTable
              races={allRaces}
              results={results as any}
              sprintResults={sprintResults as any}
              drivers={[driver]}
              viewMode="driver"
            />
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
