import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { f1Api } from '../services/f1Api';
import { pageTitleStore } from '../stores/pageTitleStore';
import { ConstructorDetails } from './ConstructorDetails';

// Mock the router
vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ constructorId: 'mercedes' }),
  useMatches: () => [{ pathname: '/constructors/mercedes' }],
}));

// Mock the f1Api service
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getConstructor: vi.fn(),
    getConstructorResults: vi.fn(),
    getConstructorDrivers: vi.fn(),
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

const mockConstructor = {
  constructorId: 'mercedes',
  name: 'Mercedes',
  nationality: 'German',
};

const mockResults = {
  MRData: {
    RaceTable: {
      Races: [
        {
          round: '1',
          raceName: 'Bahrain Grand Prix',
          Results: [
            {
              position: '1',
              Driver: {
                driverId: 'hamilton',
                permanentNumber: '44',
                code: 'HAM',
                url: 'http://en.wikipedia.org/wiki/Lewis_Hamilton',
                givenName: 'Lewis',
                familyName: 'Hamilton',
                dateOfBirth: '1985-01-07',
                nationality: 'British',
              },
            },
          ],
        },
      ],
    },
  },
};

const mockDrivers = {
  MRData: {
    DriverTable: {
      Drivers: [
        {
          driverId: 'hamilton',
          permanentNumber: '44',
          code: 'HAM',
          url: 'http://en.wikipedia.org/wiki/Lewis_Hamilton',
          givenName: 'Lewis',
          familyName: 'Hamilton',
          dateOfBirth: '1985-01-07',
          nationality: 'British',
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
          date: '2024-03-02',
          time: '15:00:00Z',
        },
        {
          round: '2',
          raceName: 'Saudi Arabian Grand Prix',
          date: '2024-03-09',
          time: '20:00:00Z',
        },
      ],
    },
  },
};

// Helper function to render the component with the necessary providers
const renderConstructorDetails = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ConstructorDetails />
    </QueryClientProvider>,
  );
};

describe('ConstructorDetails', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock implementations
    (
      f1Api.getConstructor as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      MRData: { ConstructorTable: { Constructors: [mockConstructor] } },
    });
    (
      f1Api.getConstructorResults as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockResults);
    (
      f1Api.getConstructorDrivers as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockDrivers);
    (f1Api.getRaces as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockRaces,
    );
  });

  it('shows loading state initially', () => {
    renderConstructorDetails();
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('displays constructor details when data is loaded', async () => {
    renderConstructorDetails();

    await waitFor(() => {
      expect(screen.getByText('Mercedes')).toBeInTheDocument();
      expect(screen.getByText('German')).toBeInTheDocument();
    });
  });

  it('shows not found message when constructor does not exist', async () => {
    (
      f1Api.getConstructor as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      MRData: { ConstructorTable: { Constructors: [] } },
    });

    renderConstructorDetails();

    await waitFor(() => {
      expect(screen.getByText(/constructor not found/i)).toBeInTheDocument();
    });
  });
});
