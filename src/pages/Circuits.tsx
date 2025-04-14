import { useQuery } from '@tanstack/react-query'
import { f1Api } from '../services/f1Api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export function Circuits() {
  const { data, isLoading } = useQuery({
    queryKey: ['circuits'],
    queryFn: f1Api.getCircuits,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  const circuits = data?.MRData.CircuitTable.Circuits || []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">F1 Circuits</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {circuits.map((circuit) => (
          <Card key={circuit.circuitId}>
            <CardHeader>
              <CardTitle>{circuit.circuitName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-muted-foreground">
                <p>
                  <span className="font-medium">Location:</span>{' '}
                  {circuit.Location.locality}, {circuit.Location.country}
                </p>
                <p>
                  <span className="font-medium">Coordinates:</span>{' '}
                  {circuit.Location.lat}, {circuit.Location.long}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
