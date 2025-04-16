import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { f1Api } from '../services/f1Api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CircuitMap } from '../components/CircuitMap';
import { CircuitInfo } from '../components/CircuitInfo';

export function CircuitDetails() {
  const { circuitId } = useParams({ from: '/circuits/$circuitId' });

  const { data, isLoading } = useQuery({
    queryKey: ['circuit', circuitId],
    queryFn: () => f1Api.getCircuit(circuitId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const circuit = data?.MRData.CircuitTable.Circuits[0];

  if (!circuit) {
    return <div>Circuit not found</div>;
  }

  // Convert string coordinates to numbers
  const latitude = parseFloat(circuit.Location.lat);
  const longitude = parseFloat(circuit.Location.long);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{circuit.circuitName}</h1>
        <Button asChild variant="outline">
          <Link to="/circuits">Back to Circuits</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Circuit Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CircuitInfo circuit={circuit} />

              <div>
                <h3 className="font-semibold mb-2">Circuit Map</h3>
                <CircuitMap
                  latitude={latitude}
                  longitude={longitude}
                  circuitName={circuit.circuitName}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
