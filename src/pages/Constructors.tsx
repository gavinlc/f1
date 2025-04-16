import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { useEffect } from 'react';
import { f1Api } from '../services/f1Api';
import { pageTitleStore } from '../stores/pageTitleStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Page } from '../components/Page';

export function Constructors() {
  const setTitle = useStore(pageTitleStore, (state) => state.setTitle);

  useEffect(() => {
    setTitle('');
  }, [setTitle]);

  const { data, isLoading } = useQuery({
    queryKey: ['constructors', '2025'],
    queryFn: () => f1Api.getConstructors('2025'),
  });

  if (isLoading) {
    return (
      <Page>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Page>
    );
  }

  const constructors = data?.MRData.ConstructorTable.Constructors || [];

  return (
    <Page>
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
    </Page>
  );
}
