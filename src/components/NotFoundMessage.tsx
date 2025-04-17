import { Page } from './Page';

interface NotFoundMessageProps {
  type: 'driver' | 'constructor' | 'race';
}

export function NotFoundMessage({ type }: NotFoundMessageProps) {
  const getMessage = () => {
    switch (type) {
      case 'driver':
        return 'Driver not found';
      case 'constructor':
        return 'Constructor not found';
      case 'race':
        return 'Race not found';
      default:
        return 'Item not found';
    }
  };

  return (
    <Page>
      <div className="text-center">
        <h1 className="text-2xl font-bold">{getMessage()}</h1>
      </div>
    </Page>
  );
}
