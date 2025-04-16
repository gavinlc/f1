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
              {race.Circuit.circuitName}
            </p>
          </div>

          {hasSprintResults && (
            <Tabs
              defaultValue={showSprint ? 'sprint' : 'race'}
              onValueChange={(value) => onSprintToggle(value === 'sprint')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sprint">Sprint Results</TabsTrigger>
                <TabsTrigger value="race">Grand Prix Results</TabsTrigger>
              </TabsList>
              <TabsContent value="sprint">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
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
                    <Skeleton className="h-6 w-32" />
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
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
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ) : (
                <ResultsTable
                  results={raceResults || []}
                  title="Grand Prix Results"
                  raceDate={race.date}
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
