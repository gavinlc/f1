import { useQuery } from '@tanstack/react-query'
import { f1Api } from '../services/f1Api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export function Drivers() {
  const { data, isLoading } = useQuery({
    queryKey: ['drivers', '2024'],
    queryFn: () => f1Api.getDrivers('2024'),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  const drivers = data?.MRData.DriverTable.Drivers || []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">F1 Drivers 2024</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <Card key={driver.driverId}>
            <CardHeader>
              <CardTitle>
                {driver.givenName} {driver.familyName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-muted-foreground">
                <p>
                  <span className="font-medium">Number:</span>{' '}
                  {driver.permanentNumber || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Code:</span>{' '}
                  {driver.code || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Nationality:</span>{' '}
                  {driver.nationality}
                </p>
                <p>
                  <span className="font-medium">Date of Birth:</span>{' '}
                  {new Date(driver.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
