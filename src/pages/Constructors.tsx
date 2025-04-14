import { useQuery } from '@tanstack/react-query'
import { f1Api } from '../services/f1Api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export function Constructors() {
  const { data, isLoading } = useQuery({
    queryKey: ['constructors', '2024'],
    queryFn: () => f1Api.getConstructors('2024'),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  const constructors = data?.MRData.ConstructorTable.Constructors || []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">F1 Constructors 2024</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {constructors.map((constructor) => (
          <Card key={constructor.constructorId}>
            <CardHeader>
              <CardTitle>{constructor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-muted-foreground">
                <p>
                  <span className="font-medium">Nationality:</span>{' '}
                  {constructor.nationality}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
