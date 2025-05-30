import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { f1Api } from '../services/f1Api';
import { RaceTabs } from '../components/RaceTabs';
import { RaceCard } from '../components/RaceCard';
import { TabsContent } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import { Page } from '../components/Page';

export function Results() {
  const [selectedRound, setSelectedRound] = useState<string>('1');
  const [showSprint, setShowSprint] = useState<boolean>(false);

  // Query for basic race information
  const {
    data: racesData,
    isLoading: isLoadingRaces,
    error: racesError,
  } = useQuery({
    queryKey: ['races', '2025'],
    queryFn: () => f1Api.getRaceResults('2025'),
  });

  // Query for selected race results
  const { data: selectedRaceData, isLoading: isLoadingResults } = useQuery({
    queryKey: ['race-results', '2025', selectedRound],
    queryFn: () => f1Api.getSingleRaceResult('2025', selectedRound),
    enabled: !!selectedRound,
  });

  // Query for sprint results
  const { data: sprintData, isLoading: isLoadingSprint } = useQuery({
    queryKey: ['sprint-results', '2025', selectedRound],
    queryFn: () => f1Api.getSprintResults('2025', selectedRound),
    enabled: !!selectedRound,
  });

  if (isLoadingRaces) {
    return (
      <Page>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Loading...</h1>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>
        </div>
      </Page>
    );
  }

  if (racesError) {
    return (
      <Page>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">2025 F1 Race Results</h1>
          <p className="text-destructive">Error loading race results</p>
        </div>
      </Page>
    );
  }

  const races = racesData?.MRData.RaceTable.Races || [];

  // If no races are available, show a message
  if (races.length === 0) {
    return (
      <Page>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">2025 F1 Race Results</h1>
          <p className="text-muted-foreground">
            No race results available yet for the 2025 season.
          </p>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <RaceTabs
        races={races}
        selectedRound={selectedRound}
        onRoundChange={setSelectedRound}
      >
        {races.map((race) => (
          <TabsContent key={race.round} value={race.round}>
            <RaceCard
              race={race}
              showSprint={showSprint}
              onSprintToggle={setShowSprint}
              sprintResults={
                sprintData?.MRData.RaceTable.Races[0]?.SprintResults
              }
              raceResults={selectedRaceData?.MRData.RaceTable.Races[0]?.Results}
              isLoading={isLoadingResults || isLoadingSprint}
            />
          </TabsContent>
        ))}
      </RaceTabs>
    </Page>
  );
}
