import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ResultsTable } from './ResultsTable';
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
            <div className="flex items-center space-x-2 py-2">
              <Switch
                id="results-toggle"
                checked={showSprint}
                onCheckedChange={onSprintToggle}
              />
              <Label htmlFor="results-toggle">
                {showSprint
                  ? 'Showing Sprint Results'
                  : 'Showing Grand Prix Results'}
              </Label>
            </div>
          )}

          {isLoading ? (
            <div className="text-muted-foreground">Loading results...</div>
          ) : (
            <div className="space-y-8">
              {showSprint ? (
                <ResultsTable
                  results={sprintResults || []}
                  title="Sprint Race Results"
                  raceDate={race.date}
                />
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
