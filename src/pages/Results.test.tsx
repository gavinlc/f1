import { beforeEach, describe, expect, test, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { router } from '../router'
import { f1Api } from '../services/f1Api'
import { createTestQueryClient } from '../test/setup'
import type { Race } from '../types/f1'

// Mock the f1Api
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getRaceResults: vi.fn(),
    getSingleRaceResult: vi.fn(),
  },
}))

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  )
}

describe('Results', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock response for all tests
    const defaultMockRaces = {
      MRData: {
        RaceTable: {
          Races: [],
        },
      },
    }

    vi.mocked(f1Api.getRaceResults).mockResolvedValue(defaultMockRaces)
    vi.mocked(f1Api.getSingleRaceResult).mockResolvedValue(defaultMockRaces)
  })

  test('renders page title', async () => {
    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />)
    })

    const resultsLink = screen.getByRole('link', { name: 'Results' })
    await act(async () => {
      fireEvent.click(resultsLink)
    })

    expect(await screen.findByText('2024 F1 Race Results')).toBeDefined()
  })

  test('renders loading state initially', async () => {
    // Override the default mock to simulate loading
    vi.mocked(f1Api.getRaceResults).mockImplementation(
      () => new Promise(() => {}),
    )

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />)
    })

    const resultsLink = screen.getByRole('link', { name: 'Results' })
    await act(async () => {
      fireEvent.click(resultsLink)
    })

    expect(await screen.findByText('Loading...')).toBeDefined()
  })

  test('renders race list when data is loaded', async () => {
    // Mock the API response for basic race information
    const mockRaces = {
      MRData: {
        RaceTable: {
          Races: [
            {
              season: '2024',
              round: '1',
              raceName: 'Bahrain Grand Prix',
              date: '2024-03-02',
              time: '15:00:00Z',
              url: 'http://example.com/bahrain-gp',
              Circuit: {
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
              Results: [], // Empty results for basic race info
            },
          ],
        },
      },
    }

    // Mock the API response for detailed race results
    const mockRaceResults = {
      MRData: {
        RaceTable: {
          Races: [
            {
              season: '2024',
              round: '1',
              raceName: 'Bahrain Grand Prix',
              date: '2024-03-02',
              time: '15:00:00Z',
              url: 'http://example.com/bahrain-gp',
              Circuit: {
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
              Results: [
                {
                  number: '1',
                  position: '1',
                  positionText: '1',
                  points: '25',
                  Driver: {
                    driverId: 'max_verstappen',
                    permanentNumber: '1',
                    code: 'VER',
                    url: 'http://example.com/verstappen',
                    givenName: 'Max',
                    familyName: 'Verstappen',
                    dateOfBirth: '1997-09-30',
                    nationality: 'Dutch',
                  },
                  Constructor: {
                    constructorId: 'red_bull',
                    url: 'http://example.com/red-bull',
                    name: 'Red Bull Racing',
                    nationality: 'Austrian',
                  },
                  grid: '1',
                  laps: '57',
                  status: 'Finished',
                  Time: {
                    millis: '5412000',
                    time: '1:30:12.000',
                  },
                },
              ],
            },
          ],
        },
      },
    }

    vi.mocked(f1Api.getRaceResults).mockResolvedValueOnce(mockRaces)
    vi.mocked(f1Api.getSingleRaceResult).mockResolvedValueOnce(mockRaceResults)

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />)
    })

    const resultsLink = screen.getByRole('link', { name: 'Results' })
    await act(async () => {
      fireEvent.click(resultsLink)
    })

    // Wait for race data to load
    const raceName = await screen.findByText('Bahrain Grand Prix')
    expect(raceName).toBeDefined()

    // Check race details
    expect(screen.getByText('Bahrain International Circuit')).toBeDefined()
    expect(screen.getByText('Max Verstappen')).toBeDefined()
    expect(screen.getByText('Red Bull Racing')).toBeDefined()
    expect(screen.getByText('1:30:12.000')).toBeDefined()
  })

  test('handles empty race list', async () => {
    // Mock empty API response
    const mockRaces = {
      MRData: {
        RaceTable: {
          Races: [],
        },
      },
    }

    vi.mocked(f1Api.getRaceResults).mockResolvedValueOnce(mockRaces)
    vi.mocked(f1Api.getSingleRaceResult).mockResolvedValueOnce(mockRaces)

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />)
    })

    const resultsLink = screen.getByRole('link', { name: 'Results' })
    await act(async () => {
      fireEvent.click(resultsLink)
    })

    // Wait for loading to finish
    const title = await screen.findByText('2024 F1 Race Results')
    expect(title).toBeDefined()

    // Verify no races are rendered
    expect(
      screen.getByText('No race results available yet for the 2024 season.'),
    ).toBeDefined()
  })
})
