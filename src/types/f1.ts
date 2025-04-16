export interface F1ApiResponse {
  [key: string]: string;
}

export interface Season {
  season: string;
  url: string;
}

export interface Circuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: {
    locality: string;
    country: string;
    lat: string;
    long: string;
  };
}

export interface Driver {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface Constructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

export interface Time {
  millis?: string;
  time: string;
}

export interface FastestLap {
  rank: string;
  lap: string;
  Time: {
    time: string;
  };
  AverageSpeed: {
    units: string;
    speed: string;
  };
}

export interface RaceResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: Time;
  FastestLap?: FastestLap;
}

export interface Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  Results?: Array<RaceResult>;
  SprintResults?: Array<RaceResult>;
  QualifyingResults?: Array<QualifyingResult>;
  FirstPractice?: Session;
  SecondPractice?: Session;
  ThirdPractice?: Session;
  Sprint?: Session;
  Qualifying?: Session;
}

export interface QualifyingResult {
  position: string;
  Driver: Driver;
  Constructor: Constructor;
  Q1?: string;
  Q2?: string;
  Q3?: string;
}

export interface Session {
  date: string;
  time: string;
}

export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Array<Constructor>;
}

export interface ConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor;
}

export interface Lap {
  number: string;
  Timings: Array<{
    driverId: string;
    position: string;
    time: string;
  }>;
}

export interface RaceTable {
  season: string;
  round?: string;
  Races: Array<Race>;
}

export interface DriverTable {
  season: string;
  round?: string;
  Drivers: Array<Driver>;
}

export interface ConstructorTable {
  season: string;
  round?: string;
  Constructors: Array<Constructor>;
}

export interface CircuitTable {
  Circuits: Array<Circuit>;
}

export interface DriverStandingsTable {
  season: string;
  round?: string;
  DriverStandings: Array<DriverStanding>;
}

export interface ConstructorStandingsTable {
  season: string;
  round?: string;
  ConstructorStandings: Array<ConstructorStanding>;
}

export interface LapTable {
  season: string;
  round: string;
  Races: Array<{
    season: string;
    round: string;
    url: string;
    raceName: string;
    date: string;
    time: string;
    Laps: Array<Lap>;
  }>;
}

export interface MRData {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
  RaceTable?: RaceTable;
  DriverTable?: DriverTable;
  ConstructorTable?: ConstructorTable;
  CircuitTable?: CircuitTable;
  DriverStandingsTable?: DriverStandingsTable;
  ConstructorStandingsTable?: ConstructorStandingsTable;
  LapTable?: LapTable;
}

export interface F1Response {
  MRData: MRData;
}
