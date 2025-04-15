import { useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle } from './ui/card';

interface RouterErrorBoundaryProps {
  error: Error;
}

export function RouterErrorBoundary({ error }: RouterErrorBoundaryProps) {
  const navigate = useNavigate();

  const isRoutingError = (error: Error): boolean => {
    return (
      error.message.includes('route') ||
      error.message.includes('path') ||
      error.message.includes('navigation') ||
      error.message.includes('router')
    );
  };

  const isRouteError = isRoutingError(error);
  const errorMessage = isRouteError
    ? 'There was a problem with the page navigation'
    : error.message || 'An unexpected error occurred';

  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">
            {isRouteError ? 'Navigation Error' : 'Something went wrong'}
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground">{errorMessage}</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="transition-all duration-200 hover:scale-105 hover:bg-accent"
            >
              Refresh page
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/' })}
              className="transition-all duration-200 hover:scale-105 hover:bg-accent"
            >
              Go home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
