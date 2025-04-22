import type {
  CircuitsResponseMRData,
  ConstructorStandingsResponseMRData,
  ConstructorsResponseMRData,
  DriverStandingsResponseMRData,
  DriversResponseMRData,
  F1ApiInfoResponse,
  F1ApiResponse,
  RacesResponseMRData,
  SeasonsResponseMRData,
} from '../types/f1';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export const f1Api = {
  getApiInfo: async (): Promise<F1ApiInfoResponse> => {
    const response = await fetch('https://api.jolpi.ca/ergast/?format=json');
    return response.json();
  },

  getSeasons: async (): Promise<F1ApiResponse<SeasonsResponseMRData>> => {
    const response = await fetch(`${BASE_URL}/seasons.json`);
    return response.json();
  },

  getCircuits: async (): Promise<F1ApiResponse<CircuitsResponseMRData>> => {
    const response = await fetch(`${BASE_URL}/circuits.json?limit=100`);
    return response.json();
  },

  getCircuitsForSeason: async (
    season: string,
  ): Promise<F1ApiResponse<CircuitsResponseMRData>> => {
    const response = await fetch(`${BASE_URL}/${season}/circuits.json`);
    return response.json();
  },

  getRaces: async (
    season: string,
  ): Promise<F1ApiResponse<RacesResponseMRData>> => {
    const response = await fetch(`${BASE_URL}/${season}/races.json`);
    return response.json();
  },

  getDrivers: async (
    season: string,
  ): Promise<F1ApiResponse<DriversResponseMRData>> => {
    const response = await fetch(`${BASE_URL}/${season}/drivers.json`);
    return response.json();
  },

  getConstructors: async (
    season: string,
  ): Promise<F1ApiResponse<ConstructorsResponseMRData>> => {
    const response = await fetch(`${BASE_URL}/${season}/constructors.json`);
    return response.json();
  },

  getRaceResults: async (
    season: string,
  ): Promise<F1ApiResponse<RacesResponseMRData>> => {
    // Only fetch basic race information without results
    const response = await fetch(`${BASE_URL}/${season}/races.json`);
    return response.json();
  },

  getSingleRaceResult: async (
    season: string,
    round: string,
  ): Promise<F1ApiResponse<RacesResponseMRData>> => {
    const response = await fetch(`${BASE_URL}/${season}/${round}/results.json`);
    return response.json();
  },

  getSprintResults: async (
    season: string,
    round: string,
  ): Promise<F1ApiResponse<RacesResponseMRData>> => {
    const response = await fetch(`${BASE_URL}/${season}/${round}/sprint.json`);
    return response.json();
  },

  getCircuit: async (
    circuitId: string,
  ): Promise<F1ApiResponse<CircuitsResponseMRData>> => {
    const response = await fetch(`${BASE_URL}/circuits/${circuitId}.json`);
    return response.json();
  },

  getDriverStandings: async (
    season: string,
  ): Promise<F1ApiResponse<DriverStandingsResponseMRData>> => {
    const response = await fetch(`${BASE_URL}/${season}/driverstandings.json`);
    return response.json();
  },

  getConstructorStandings: async (
    season: string,
  ): Promise<F1ApiResponse<ConstructorStandingsResponseMRData>> => {
    const response = await fetch(
      `${BASE_URL}/${season}/constructorstandings.json`,
    );
    return response.json();
  },

  getDriver: async (
    driverId: string,
  ): Promise<F1ApiResponse<DriversResponseMRData>> => {
    const response = await fetch(`${BASE_URL}/drivers/${driverId}.json`);
    return response.json();
  },

  getDriverResults: async (
    driverId: string,
    season: string,
  ): Promise<F1ApiResponse<RacesResponseMRData>> => {
    const response = await fetch(
      `${BASE_URL}/${season}/drivers/${driverId}/results.json`,
    );
    return response.json();
  },

  getConstructor: async (
    constructorId: string,
  ): Promise<F1ApiResponse<ConstructorsResponseMRData>> => {
    const response = await fetch(
      `${BASE_URL}/constructors/${constructorId}.json`,
    );
    return response.json();
  },

  getConstructorResults: async (
    constructorId: string,
    season: string,
  ): Promise<F1ApiResponse<RacesResponseMRData>> => {
    const response = await fetch(
      `${BASE_URL}/${season}/constructors/${constructorId}/results.json`,
    );
    return response.json();
  },

  getConstructorDrivers: async (
    constructorId: string,
    season: string,
  ): Promise<F1ApiResponse<DriversResponseMRData>> => {
    const response = await fetch(
      `${BASE_URL}/${season}/constructors/${constructorId}/drivers.json`,
    );
    return response.json();
  },
};
