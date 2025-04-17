import { render, screen } from '@testing-library/react';
import { NotFoundMessage } from './NotFoundMessage';

// Mock the Page component
jest.mock('../components/Page', () => ({
  Page: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('NotFoundMessage', () => {
  it('renders driver not found message', () => {
    render(<NotFoundMessage type="driver" />);
    expect(screen.getByText('Driver not found')).toBeInTheDocument();
  });

  it('renders constructor not found message', () => {
    render(<NotFoundMessage type="constructor" />);
    expect(screen.getByText('Constructor not found')).toBeInTheDocument();
  });

  it('renders race not found message', () => {
    render(<NotFoundMessage type="race" />);
    expect(screen.getByText('Race not found')).toBeInTheDocument();
  });

  it('renders default message for unknown type', () => {
    // @ts-expect-error Testing invalid type
    render(<NotFoundMessage type="invalid" />);
    expect(screen.getByText('Item not found')).toBeInTheDocument();
  });
});
