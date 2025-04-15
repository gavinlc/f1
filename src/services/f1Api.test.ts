import { beforeEach, describe, expect, test, vi } from 'vitest';
import { f1Api } from './f1Api';

describe('f1Api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('getApiInfo returns API information', async () => {
    const mockResponse = { version: '1.0.0' };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const result = await f1Api.getApiInfo();
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.jolpi.ca/ergast/?format=json',
    );
  });

  test('getSeasons returns seasons data', async () => {
    const mockResponse = {
      MRData: {
        SeasonTable: {
          Seasons: [{ season: '2024', url: 'http://example.com/2024' }],
        },
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const result = await f1Api.getSeasons();
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.jolpi.ca/ergast/f1/seasons.json',
    );
  });

  test('getCircuits returns circuits data', async () => {
    const mockResponse = {
      MRData: {
        CircuitTable: {
          Circuits: [
            {
              circuitId: 'monaco',
              circuitName: 'Circuit de Monaco',
              url: 'http://example.com/monaco',
              Location: {
                locality: 'Monte Carlo',
                country: 'Monaco',
                lat: '43.7347',
                long: '7.4206',
              },
            },
          ],
        },
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const result = await f1Api.getCircuits();
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.jolpi.ca/ergast/f1/circuits.json?limit=100',
    );
  });

  test('getDrivers returns drivers data for a season', async () => {
    const mockResponse = {
      MRData: {
        DriverTable: {
          Drivers: [
            {
              driverId: 'max_verstappen',
              permanentNumber: '1',
              code: 'VER',
              url: 'http://example.com/verstappen',
              givenName: 'Max',
              familyName: 'Verstappen',
              dateOfBirth: '1997-09-30',
              nationality: 'Dutch',
            },
          ],
        },
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const result = await f1Api.getDrivers('2024');
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.jolpi.ca/ergast/f1/2024/drivers.json',
    );
  });

  test('getConstructors returns constructors data for a season', async () => {
    const mockResponse = {
      MRData: {
        ConstructorTable: {
          Constructors: [
            {
              constructorId: 'red_bull',
              url: 'http://example.com/red-bull',
              name: 'Red Bull Racing',
              nationality: 'Austrian',
            },
          ],
        },
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const result = await f1Api.getConstructors('2024');
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.jolpi.ca/ergast/f1/2024/constructors.json',
    );
  });

  test('getRaceResults returns race results for a season', async () => {
    const mockRacesResponse = {
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
              Results: [], // Empty results array for basic race info
            },
          ],
        },
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        json: () => Promise.resolve(mockRacesResponse),
      }),
    );

    const result = await f1Api.getRaceResults('2024');
    expect(result).toEqual(mockRacesResponse);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.jolpi.ca/ergast/f1/2024/races.json',
    );
  });
});
