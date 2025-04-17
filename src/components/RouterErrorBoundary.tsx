import { useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle } from './ui/card';

interface RouterErrorBoundaryProps {
  error: Error;
}

export function RouterErrorBoundary({ error }: RouterErrorBoundaryProps) {
  const navigate = useNavigate();

  const isRoutingError = (): boolean => {
    const message = error.message.toLowerCase();
    return (
      message.includes('route') ||
      message.includes('path') ||
      message.includes('navigation') ||
      message.includes('router')
    );
  };

  const isRouteError = isRoutingError();
  const errorMessage = isRouteError
    ? 'There was a problem with the page navigation'
    : error.message || 'An unexpected error occurred';

  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive" data-testid="error-title">
            {isRouteError ? 'Navigation Error' : 'Something went wrong'}
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground" data-testid="error-message">
            {errorMessage}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="transition-all duration-200 hover:scale-105 hover:bg-accent"
              data-testid="refresh-button"
            >
              Refresh page
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/' })}
              className="transition-all duration-200 hover:scale-105 hover:bg-accent"
              data-testid="home-button"
            >
              Go home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
