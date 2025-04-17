import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { f1Api } from '../services/f1Api';
import { createTestQueryClient } from '../test/setup';
import { CircuitDetails } from './CircuitDetails';

// Mock the f1Api
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getCircuit: vi.fn(),
  },
}));

// Mock the router
vi.mock('@tanstack/react-router', () => ({
  Link: ({
    href,
    children,
    to,
    className,
  }: {
    href?: string;
    to?: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href || to} className={className} role="link">
      {children}
    </a>
  ),
  useParams: vi.fn().mockReturnValue({ circuitId: 'bahrain' }),
}));

// Mock the CircuitMap component
vi.mock('../components/CircuitMap', () => ({
  CircuitMap: () => <div data-testid="mock-circuit-map">Circuit Map</div>,
}));

// Mock the pageTitleStore
vi.mock('../stores/pageTitleStore', () => ({
  pageTitleStore: {
    getState: vi.fn().mockReturnValue({
      setDetailsPageTitle: vi.fn(),
    }),
  },
}));

// Mock the useStore hook
vi.mock('@tanstack/react-store', () => ({
  useStore: vi.fn().mockReturnValue(vi.fn()),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  );
};

describe('CircuitDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    // Override the default mock to simulate loading
    vi.mocked(f1Api.getCircuit).mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<CircuitDetails />);

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  test('renders circuit details when data is loaded', async () => {
    // Mock the circuit details
    const mockCircuit = {
      MRData: {
        CircuitTable: {
          Circuits: [
            {
              circuitId: 'bahrain',
              circuitName: 'Bahrain International Circuit',
              url: 'http://example.com/bahrain',
              Location: {
                locality: 'Sakhir',
                country: 'Bahrain',
                lat: '26.0325',
                long: '50.5106',
              },
            },
          ],
        },
      },
    };

    vi.mocked(f1Api.getCircuit).mockResolvedValueOnce(mockCircuit);

    renderWithProviders(<CircuitDetails />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    // Check if the circuit details are rendered
    expect(screen.getByText('Circuit Information')).toBeDefined();
    expect(screen.getByText('Sakhir, Bahrain')).toBeDefined();
    expect(screen.getByTestId('mock-circuit-map')).toBeDefined();
    expect(
      screen.getByRole('link', { name: 'Back to Circuits' }),
    ).toBeDefined();
  });

  test('handles circuit not found', async () => {
    // Mock empty API response
    const mockCircuit = {
      MRData: {
        CircuitTable: {
          Circuits: [],
        },
      },
    };

    vi.mocked(f1Api.getCircuit).mockResolvedValueOnce(mockCircuit);

    renderWithProviders(<CircuitDetails />);

    // Wait for the "not found" message
    const notFoundMessage = await screen.findByText('Circuit not found');
    expect(notFoundMessage).toBeDefined();
  });
});
