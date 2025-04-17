import { render, screen, waitFor } from '@testing-library/react';
import { LoadingSkeleton } from './LoadingSkeleton';

// Mock the Page component
jest.mock('./Page', () => ({
  Page: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('LoadingSkeleton', () => {
  it('renders driver loading skeleton correctly', () => {
    render(<LoadingSkeleton type="driver" />);

    // Check for the main container
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();

    // Check for heading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Check for driver-specific skeleton
    expect(screen.getByTestId('skeleton-driver')).toBeInTheDocument();

    // Check for skeleton elements
    const skeletons = screen.getAllByTestId(/^skeleton-/);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders constructor loading skeleton correctly', () => {
    render(<LoadingSkeleton type="constructor" />);

    // Check for the main container
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();

    // Check for heading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Check for constructor-specific skeleton
    expect(screen.getByTestId('skeleton-constructor')).toBeInTheDocument();

    // Check for skeleton elements
    const skeletons = screen.getAllByTestId(/^skeleton-/);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders race loading skeleton correctly', () => {
    render(<LoadingSkeleton type="race" />);

    // Check for the main container
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();

    // Check for heading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Check for skeleton elements by class name
    const skeletonElements = document.querySelectorAll('.h-4, .h-6, .h-10');
    expect(skeletonElements.length).toBeGreaterThan(0);

    // Check for the presence of cards
    const cards = document.querySelectorAll('.card');
    waitFor(() => expect(cards.length).toBeGreaterThan(0));
  });
});
