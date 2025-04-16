import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { useEffect } from 'react';
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
import { Skeleton } from '../components/ui/skeleton';
import { Page } from '../components/Page';
import { pageTitleStore } from '../stores/pageTitleStore';

export function CircuitDetails() {
  const { circuitId } = useParams({ from: '/circuits/$circuitId' });
  const setTitle = useStore(pageTitleStore, (state) => state.setTitle);

  const { data, isLoading } = useQuery({
    queryKey: ['circuit', circuitId],
    queryFn: () => f1Api.getCircuit(circuitId),
  });

  useEffect(() => {
    if (data?.MRData.CircuitTable.Circuits[0]) {
      setTitle(data.MRData.CircuitTable.Circuits[0].circuitName);
    }
  }, [data, setTitle]);

  if (isLoading) {
    return (
      <Page>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Page>
    );
  }

  const circuit = data?.MRData.CircuitTable.Circuits[0];

  if (!circuit) {
    return (
      <Page>
        <div>Circuit not found</div>
      </Page>
    );
  }

  // Convert string coordinates to numbers
  const latitude = parseFloat(circuit.Location.lat);
  const longitude = parseFloat(circuit.Location.long);

  return (
    <Page>
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
    </Page>
  );
}
