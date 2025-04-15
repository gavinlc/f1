import { Component } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle } from './ui/card';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">
                Something went wrong
              </CardTitle>
            </CardHeader>
            <div className="p-6 space-y-4">
              <p className="text-muted-foreground">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Refresh page
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
