import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { f1Api } from '../services/f1Api';
import { createTestQueryClient } from '../test/setup';
import { Constructors } from './Constructors';
import type { ConstructorsResponseMRData, F1ApiResponse } from '../types/f1';

// Mock the f1Api
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getConstructors: vi.fn(),
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
}));

// Mock the pageTitleStore
vi.mock('../stores/pageTitleStore', () => ({
  pageTitleStore: {
    getState: vi.fn().mockReturnValue({
      setPageTitle: vi.fn(),
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

const mockConstructors: F1ApiResponse<ConstructorsResponseMRData> = {
  MRData: {
    xmlns: 'http://ergast.com/mrd/1.5',
    series: 'f1',
    url: 'http://ergast.com/api/f1/2024/constructors',
    limit: '30',
    offset: '0',
    total: '1',
    ConstructorTable: {
      Constructors: [
        {
          constructorId: 'mercedes',
          name: 'Mercedes',
          nationality: 'German',
          url: 'http://en.wikipedia.org/wiki/Mercedes-Benz_in_Formula_One',
        },
      ],
    },
  },
};

const mockEmptyConstructors: F1ApiResponse<ConstructorsResponseMRData> = {
  MRData: {
    xmlns: 'http://ergast.com/mrd/1.5',
    series: 'f1',
    url: 'http://ergast.com/api/f1/2024/constructors',
    limit: '30',
    offset: '0',
    total: '0',
    ConstructorTable: {
      Constructors: [],
    },
  },
};

describe('Constructors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    // Override the default mock to simulate loading
    vi.mocked(f1Api.getConstructors).mockImplementation(
      () => new Promise(() => {}),
    );

    renderWithProviders(<Constructors />);

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  test('renders constructor list when data is loaded', async () => {
    // Mock the API response
    vi.mocked(f1Api.getConstructors).mockResolvedValueOnce(mockConstructors);

    renderWithProviders(<Constructors />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    // Check if the constructor details are rendered
    expect(screen.getByText('Mercedes')).toBeDefined();
    expect(screen.getByText(/German/)).toBeDefined();
  });

  test('handles empty constructor list', async () => {
    // Mock empty API response
    vi.mocked(f1Api.getConstructors).mockResolvedValueOnce(
      mockEmptyConstructors,
    );

    renderWithProviders(<Constructors />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    // Verify no constructors are rendered
    expect(screen.queryByText(/Mercedes/)).toBeNull();
  });
});
