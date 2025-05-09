import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClientProvider } from '@tanstack/react-query';
import { f1Api } from '../services/f1Api';
import { createTestQueryClient } from '../test/setup';
import { Drivers } from './Drivers';
import type { DriversResponseMRData, F1ApiResponse } from '../types/f1';

// Mock the f1Api
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getDrivers: vi.fn(),
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

// Mock the useAge hook
vi.mock('../hooks/useAge', () => ({
  useAge: () => 26,
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

const mockDrivers: F1ApiResponse<DriversResponseMRData> = {
  MRData: {
    xmlns: 'http://ergast.com/mrd/1.5',
    series: 'f1',
    url: 'http://ergast.com/api/f1/2024/drivers',
    limit: '30',
    offset: '0',
    total: '1',
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

const mockEmptyDrivers: F1ApiResponse<DriversResponseMRData> = {
  MRData: {
    xmlns: 'http://ergast.com/mrd/1.5',
    series: 'f1',
    url: 'http://ergast.com/api/f1/2024/drivers',
    limit: '30',
    offset: '0',
    total: '0',
    DriverTable: {
      Drivers: [],
    },
  },
};

const mockMultipleDrivers: F1ApiResponse<DriversResponseMRData> = {
  MRData: {
    xmlns: 'http://ergast.com/mrd/1.5',
    series: 'f1',
    url: 'http://ergast.com/api/f1/2024/drivers',
    limit: '30',
    offset: '0',
    total: '3',
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
        {
          driverId: 'verstappen',
          permanentNumber: '1',
          code: 'VER',
          url: 'http://en.wikipedia.org/wiki/Max_Verstappen',
          givenName: 'Max',
          familyName: 'Verstappen',
          dateOfBirth: '1997-09-30',
          nationality: 'Dutch',
        },
        {
          driverId: 'norris',
          permanentNumber: '4',
          code: 'NOR',
          url: 'http://en.wikipedia.org/wiki/Lando_Norris',
          givenName: 'Lando',
          familyName: 'Norris',
          dateOfBirth: '1999-11-13',
          nationality: 'British',
        },
      ],
    },
  },
};

describe('Drivers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    // Override the default mock to simulate loading
    vi.mocked(f1Api.getDrivers).mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<Drivers />);

    expect(screen.getByTestId('skeleton')).toBeDefined();
  });

  test('renders driver list when data is loaded', async () => {
    // Mock the API response
    vi.mocked(f1Api.getDrivers).mockResolvedValueOnce(mockDrivers);

    renderWithProviders(<Drivers />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).toBeNull();
    });

    // Check if the driver details are rendered
    expect(screen.getByText('Lewis Hamilton (HAM)')).toBeDefined();
    expect(screen.getByText(/British/)).toBeDefined();
    expect(screen.getByText(/26/)).toBeDefined(); // Age from mocked useAge hook
    expect(screen.getByText(/HAM/)).toBeDefined();
  });

  test('handles empty driver list', async () => {
    // Mock empty API response
    vi.mocked(f1Api.getDrivers).mockResolvedValueOnce(mockEmptyDrivers);

    renderWithProviders(<Drivers />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).toBeNull();
    });

    // Verify no drivers are rendered
    expect(screen.queryByText(/Hamilton/)).toBeNull();
  });

  describe('sorting functionality', () => {
    beforeEach(() => {
      vi.mocked(f1Api.getDrivers).mockResolvedValueOnce(mockMultipleDrivers);
    });

    test('sorts by last name in ascending order by default', async () => {
      renderWithProviders(<Drivers />);

      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).toBeNull();
      });

      const driverCards = screen.getAllByRole('link');
      const driverNames = driverCards.map((card) => card.textContent);

      // Check if drivers are sorted by last name (Hamilton, Norris, Verstappen)
      expect(driverNames[0]).toContain('Hamilton');
      expect(driverNames[1]).toContain('Norris');
      expect(driverNames[2]).toContain('Verstappen');
    });

    test('sorts by first name when selected', async () => {
      renderWithProviders(<Drivers />);

      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).toBeNull();
      });

      // Click the select trigger
      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);

      // Click the "First Name" option
      const firstNameOption = screen.getByRole('option', {
        name: 'First Name',
      });
      await userEvent.click(firstNameOption);

      // Wait for the sort to be applied
      await waitFor(() => {
        const newDriverCards = screen.getAllByRole('link');
        const newDriverNames = newDriverCards.map((card) => card.textContent);

        // Check if drivers are sorted by first name (Lando, Lewis, Max)
        expect(newDriverNames[0]).toContain('Norris');
        expect(newDriverNames[1]).toContain('Hamilton');
        expect(newDriverNames[2]).toContain('Verstappen');
      });
    });

    test('sorts by driver number when selected', async () => {
      renderWithProviders(<Drivers />);

      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).toBeNull();
      });

      // Click the select trigger
      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);

      // Click the "Driver Number" option
      const driverNumberOption = screen.getByRole('option', {
        name: 'Driver Number',
      });
      await userEvent.click(driverNumberOption);

      // Wait for the sort to be applied
      await waitFor(() => {
        const driverCards = screen.getAllByRole('link');
        const driverNames = driverCards.map((card) => card.textContent);

        // Check if drivers are sorted by number (1, 4, 44)
        expect(driverNames[0]).toContain('Verstappen');
        expect(driverNames[1]).toContain('Norris');
        expect(driverNames[2]).toContain('Hamilton');
      });
    });

    test('sorts by age when selected', async () => {
      renderWithProviders(<Drivers />);

      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).toBeNull();
      });

      // Click the select trigger
      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);

      // Click the "Age" option
      const ageOption = screen.getByRole('option', { name: 'Age' });
      await userEvent.click(ageOption);

      // Wait for the sort to be applied
      await waitFor(() => {
        const driverCards = screen.getAllByRole('link');
        const driverNames = driverCards.map((card) => card.textContent);

        // Check if drivers are sorted by age (youngest to oldest)
        expect(driverNames[0]).toContain('Norris');
        expect(driverNames[1]).toContain('Verstappen');
        expect(driverNames[2]).toContain('Hamilton');
      });
    });

    test('toggles sort direction when clicking the sort direction button', async () => {
      renderWithProviders(<Drivers />);

      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).toBeNull();
      });

      // Click the sort direction button (it's the second button in the flex container)
      const sortDirectionButton = screen.getByRole('button', {
        name: /sort direction/i,
      });
      await userEvent.click(sortDirectionButton);

      // Wait for the sort to be applied
      await waitFor(() => {
        const newDriverCards = screen.getAllByRole('link');
        const newDriverNames = newDriverCards.map((card) => card.textContent);

        // Check if the order is reversed
        expect(newDriverNames[0]).toContain('Verstappen');
        expect(newDriverNames[1]).toContain('Norris');
        expect(newDriverNames[2]).toContain('Hamilton');
      });
    });
  });
});
