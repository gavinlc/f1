import { useCallback, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { f1Api } from '../services/f1Api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';

export function Results() {
  const [selectedRound, setSelectedRound] = useState<string>('1');
  const [showSprint, setShowSprint] = useState<boolean>(false);
  const tabsListRef = useRef<HTMLDivElement>(null);

  // Query for basic race information
  const { data: racesData, isLoading: isLoadingRaces } = useQuery({
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

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsListRef.current) {
      const scrollAmount = 200; // Adjust this value as needed
      const currentScroll = tabsListRef.current.scrollLeft;
      const newScroll =
        direction === 'left'
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      tabsListRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth',
      });
    }
  };

  if (isLoadingRaces) {
    return <div>Loading...</div>;
  }

  const races = racesData?.MRData.RaceTable.Races || [];

  // If no races are available, show a message
  if (races.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">2025 F1 Race Results</h1>
        <p className="text-muted-foreground">
          No race results available yet for the 2025 season.
        </p>
      </div>
    );
  }

  const renderResultsTable = (results: Array<any>, title: string) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Time/Gap
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Points
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {results.map((result) => (
              <tr key={result.Driver.driverId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {result.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {result.Driver.givenName} {result.Driver.familyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {result.Constructor.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {result.Time?.time || result.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {result.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Check if sprint results are available
  const hasSprintResults = Boolean(
    sprintData?.MRData.RaceTable.Races[0]?.SprintResults?.length,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">2025 F1 Race Results</h1>
      <Tabs
        defaultValue={selectedRound}
        onValueChange={setSelectedRound}
        className="w-full"
      >
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
            onClick={() => scrollTabs('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div
            className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            ref={tabsListRef}
          >
            <TabsList className="flex gap-1 min-w-max px-10">
              {races.map((race) => (
                <TabsTrigger
                  key={race.round}
                  value={race.round}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Round {race.round}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
            onClick={() => scrollTabs('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {races.map((race) => (
          <TabsContent key={race.round} value={race.round}>
            <Card>
              <CardHeader>
                <CardTitle>{race.raceName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-muted-foreground">
                    <p>
                      <span className="font-medium">Date:</span>{' '}
                      {new Date(race.date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Circuit:</span>{' '}
                      {race.Circuit.circuitName}
                    </p>
                  </div>

                  {/* Results toggle */}
                  {hasSprintResults && (
                    <div className="flex items-center space-x-2 py-2">
                      <Switch
                        id="results-toggle"
                        checked={showSprint}
                        onCheckedChange={setShowSprint}
                      />
                      <Label htmlFor="results-toggle">
                        {showSprint
                          ? 'Showing Sprint Results'
                          : 'Showing Grand Prix Results'}
                      </Label>
                    </div>
                  )}

                  {isLoadingResults || isLoadingSprint ? (
                    <div className="text-muted-foreground">
                      Loading results...
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {showSprint &&
                        hasSprintResults &&
                        sprintData?.MRData.RaceTable.Races[0]?.SprintResults &&
                        renderResultsTable(
                          sprintData.MRData.RaceTable.Races[0].SprintResults,
                          'Sprint Race Results',
                        )}
                      {!showSprint &&
                        selectedRaceData?.MRData.RaceTable.Races[0]?.Results &&
                        renderResultsTable(
                          selectedRaceData.MRData.RaceTable.Races[0].Results,
                          'Grand Prix Results',
                        )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
