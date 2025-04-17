import { Skeleton } from './ui/skeleton';
import { Page } from './Page';
import { Card, CardContent, CardHeader } from './ui/card';

interface LoadingSkeletonProps {
  type: 'driver' | 'constructor' | 'race';
}

export function LoadingSkeleton({ type }: LoadingSkeletonProps) {
  return (
    <Page>
      <div className="space-y-6" data-testid="loading-skeleton">
        <h2>Loading...</h2>
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
                {type === 'driver' && (
                  <Skeleton
                    className="h-4 w-32"
                    data-testid="skeleton-driver"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {type === 'constructor' && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              data-testid="skeleton-constructor"
            >
              {[1, 2].map((i) => (
                <Card key={i} className="h-full">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent className="pb-4 pt-0">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  );
}
