import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { f1Api } from '../services/f1Api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

export function Circuits() {
  // Fetch races for the 2025 season
  const { data: racesData, isLoading: isLoadingRaces } = useQuery({
    queryKey: ['races', '2025'],
    queryFn: () => f1Api.getRaceResults('2025'),
  });

  if (isLoadingRaces) {
    return <div>Loading...</div>;
  }

  // Extract unique circuits from the races
  const races = racesData?.MRData.RaceTable.Races || [];
  const uniqueCircuits = Array.from(
    new Map(
      races.map((race) => [race.Circuit.circuitId, race.Circuit]),
    ).values(),
  );

  // Sort circuits alphabetically by circuitName
  const sortedCircuits = [...uniqueCircuits].sort((a, b) =>
    a.circuitName.localeCompare(b.circuitName),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">F1 Circuits 2025</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCircuits.map((circuit) => (
          <Link
            key={circuit.circuitId}
            to="/circuits/$circuitId"
            params={{ circuitId: circuit.circuitId }}
          >
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle>{circuit.circuitName}</CardTitle>
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
    </div>
  );
}
