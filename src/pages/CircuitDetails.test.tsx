import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { f1Api } from '../services/f1Api';
import { createTestQueryClient } from '../test/setup';
import { CircuitDetails } from './CircuitDetails';
import type { CircuitsResponseMRData, F1ApiResponse } from '../types/f1';

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
    const mockCircuit: F1ApiResponse<CircuitsResponseMRData> = {
      MRData: {
        xmlns: 'http://ergast.com/mrd/1.5',
        series: 'f1',
        url: 'http://ergast.com/api/f1/2024/circuits/monaco',
        limit: '30',
        offset: '0',
        total: '1',
        CircuitTable: {
          Circuits: [
            {
              circuitId: 'monaco',
              circuitName: 'Circuit de Monaco',
              url: 'http://en.wikipedia.org/wiki/Circuit_de_Monaco',
              Location: {
                locality: 'Monte-Carlo',
                country: 'Monaco',
                lat: '43.7347',
                long: '7.42056',
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
    expect(screen.getByText('Monte-Carlo, Monaco')).toBeDefined();
    expect(screen.getByTestId('mock-circuit-map')).toBeDefined();
    expect(
      screen.getByRole('link', { name: 'Back to Circuits' }),
    ).toBeDefined();
  });

  test('handles circuit not found', async () => {
    // Mock empty API response
    const mockEmptyCircuit: F1ApiResponse<CircuitsResponseMRData> = {
      MRData: {
        xmlns: 'http://ergast.com/mrd/1.5',
        series: 'f1',
        url: 'http://ergast.com/api/f1/2024/circuits/monaco',
        limit: '30',
        offset: '0',
        total: '0',
        CircuitTable: {
          Circuits: [],
        },
      },
    };

    vi.mocked(f1Api.getCircuit).mockResolvedValueOnce(mockEmptyCircuit);

    renderWithProviders(<CircuitDetails />);

    // Wait for the "not found" message
    const notFoundMessage = await screen.findByText('Circuit not found');
    expect(notFoundMessage).toBeDefined();
  });
});
