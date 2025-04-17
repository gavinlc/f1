import { Link } from '@tanstack/react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ResultsTable } from './ResultsTable';
import { Skeleton } from './ui/skeleton';
import type { Race, RaceResult } from '../types/f1';

interface RaceCardProps {
  race: Race;
  showSprint: boolean;
  onSprintToggle: (show: boolean) => void;
  sprintResults?: Array<RaceResult>;
  raceResults?: Array<RaceResult>;
  isLoading: boolean;
}

export function RaceCard({
  race,
  showSprint,
  onSprintToggle,
  sprintResults,
  raceResults,
  isLoading,
}: RaceCardProps) {
  const hasSprintResults = Boolean(sprintResults?.length);

  const handleSprintRaceToggle = (value: string) => {
    if (value === 'sprint' && !showSprint) {
      onSprintToggle(true);
    } else if (value === 'race' && showSprint) {
      onSprintToggle(false);
    }
  };

  return (
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
              <Link
                to="/circuits/$circuitId"
                params={{ circuitId: race.Circuit.circuitId }}
                className="hover:underline"
              >
                {race.Circuit.circuitName}
              </Link>
            </p>
          </div>

          {hasSprintResults && (
            <Tabs
              defaultValue={showSprint ? 'sprint' : 'race'}
              value={showSprint ? 'sprint' : 'race'}
              onValueChange={handleSprintRaceToggle}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sprint">Sprint Results</TabsTrigger>
                <TabsTrigger value="race">Grand Prix Results</TabsTrigger>
              </TabsList>
              <TabsContent value="sprint">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-32" data-testid="skeleton" />
                    <div className="space-y-2">
                      <Skeleton
                        className="h-10 w-full"
                        data-testid="skeleton"
                      />
                      <Skeleton
                        className="h-10 w-full"
                        data-testid="skeleton"
                      />
                      <Skeleton
                        className="h-10 w-full"
                        data-testid="skeleton"
                      />
                      <Skeleton
                        className="h-10 w-full"
                        data-testid="skeleton"
                      />
                    </div>
                  </div>
                ) : (
                  <ResultsTable
                    results={sprintResults || []}
                    title="Sprint Race Results"
                    raceDate={race.date}
                  />
                )}
              </TabsContent>
              <TabsContent value="race">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-32" data-testid="skeleton" />
                    <div className="space-y-2">
                      <Skeleton
                        className="h-10 w-full"
                        data-testid="skeleton"
                      />
                      <Skeleton
                        className="h-10 w-full"
                        data-testid="skeleton"
                      />
                      <Skeleton
                        className="h-10 w-full"
                        data-testid="skeleton"
                      />
                      <Skeleton
                        className="h-10 w-full"
                        data-testid="skeleton"
                      />
                    </div>
                  </div>
                ) : (
                  <ResultsTable
                    results={raceResults || []}
                    title="Grand Prix Results"
                    raceDate={race.date}
                  />
                )}
              </TabsContent>
            </Tabs>
          )}

          {!hasSprintResults && (
            <div className="space-y-8">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" data-testid="skeleton" />
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" data-testid="skeleton" />
                    <Skeleton className="h-10 w-full" data-testid="skeleton" />
                    <Skeleton className="h-10 w-full" data-testid="skeleton" />
                    <Skeleton className="h-10 w-full" data-testid="skeleton" />
                  </div>
                </div>
              ) : (
                <div data-testid="results-table">
                  {!raceResults || raceResults.length === 0 ? (
                    <div className="p-4 text-center bg-muted rounded-md">
                      <p className="text-muted-foreground">
                        No results available for this race.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <ResultsTable
                        results={raceResults}
                        title="Grand Prix Results"
                        raceDate={race.date}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
