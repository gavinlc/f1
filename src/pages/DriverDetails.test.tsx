import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { f1Api } from '../services/f1Api';
import { DriverDetails } from './DriverDetails';

// Mock the router
vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ driverId: 'hamilton' }),
  useMatches: () => [{ pathname: '/drivers/hamilton' }],
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
}));

// Mock the f1Api service
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getDriver: vi.fn(),
    getDriverResults: vi.fn(),
    getRaces: vi.fn(),
  },
}));

// Mock the page title store
vi.mock('../stores/pageTitleStore', () => {
  const mockState = {
    detailsPageTitle: '',
    setDetailsPageTitle: vi.fn(),
  };

  return {
    pageTitleStore: {
      state: mockState,
      getState: () => mockState,
      setState: vi.fn((fn) => {
        const newState = fn(mockState);
        Object.assign(mockState, newState);
      }),
      subscribe: vi.fn(),
    },
  };
});

// Mock the useAge hook
vi.mock('../hooks/useAge', () => ({
  useAge: () => 39,
}));

const mockDriver = {
  driverId: 'hamilton',
  permanentNumber: '44',
  code: 'HAM',
  url: 'http://example.com/hamilton',
  givenName: 'Lewis',
  familyName: 'Hamilton',
  dateOfBirth: '1985-01-07',
  nationality: 'British',
};

const mockResults = {
  MRData: {
    RaceTable: {
      Races: [
        {
          round: '1',
          raceName: 'Bahrain Grand Prix',
          date: '2025-03-02',
          Results: [
            {
              position: '1',
              points: '25',
              status: 'Finished',
              grid: '2',
              Driver: {
                driverId: 'hamilton',
              },
              Constructor: {
                constructorId: 'mercedes',
                name: 'Mercedes',
              },
            },
          ],
        },
        {
          round: '2',
          raceName: 'Saudi Arabian Grand Prix',
          date: '2025-03-09',
          Results: [
            {
              position: '3',
              points: '15',
              status: 'Finished',
              grid: '1',
              Driver: {
                driverId: 'hamilton',
              },
              Constructor: {
                constructorId: 'mercedes',
                name: 'Mercedes',
              },
            },
          ],
        },
      ],
    },
  },
};

const mockRaces = {
  MRData: {
    RaceTable: {
      Races: [
        {
          round: '1',
          raceName: 'Bahrain Grand Prix',
          date: '2025-03-02',
        },
        {
          round: '2',
          raceName: 'Saudi Arabian Grand Prix',
          date: '2025-03-09',
        },
        {
          round: '3',
          raceName: 'Australian Grand Prix',
          date: '2025-03-23',
        },
      ],
    },
  },
};

// Helper function to render the component with the necessary providers
const renderDriverDetails = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <DriverDetails />
    </QueryClientProvider>,
  );
};

describe('DriverDetails', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock implementations
    (f1Api.getDriver as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      MRData: { DriverTable: { Drivers: [mockDriver] } },
    });
    (
      f1Api.getDriverResults as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockResults);
    (f1Api.getRaces as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockRaces,
    );
  });

  it('shows loading state initially', () => {
    // Override the default mock to simulate loading
    (f1Api.getDriver as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {}),
    );

    renderDriverDetails();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays driver details when data is loaded', async () => {
    renderDriverDetails();

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    // Check if the driver details are rendered
    expect(screen.getByText('Lewis Hamilton (HAM)')).toBeInTheDocument();
    expect(screen.getByText('Driver #44')).toBeInTheDocument();
    expect(screen.getByText('British')).toBeInTheDocument();
    expect(screen.getByText('39')).toBeInTheDocument();
    expect(screen.getByText('Mercedes')).toBeInTheDocument();
  });

  it('shows not found message when driver does not exist', async () => {
    (f1Api.getDriver as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      MRData: { DriverTable: { Drivers: [] } },
    });

    renderDriverDetails();

    // Wait for the "not found" message
    const notFoundMessage = await screen.findByText(/driver not found/i);
    expect(notFoundMessage).toBeInTheDocument();
  });

  it('renders constructor link correctly', async () => {
    renderDriverDetails();

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    const constructorLink = screen.getByRole('link', { name: 'Mercedes' });
    expect(constructorLink).toBeInTheDocument();
    expect(constructorLink).toHaveAttribute('href', '/constructors/mercedes');
  });
});
