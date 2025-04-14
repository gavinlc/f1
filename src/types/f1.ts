export interface F1ApiResponse {
  season: string;
  circuit: string;
  race: string;
  constructor: string;
  driver: string;
  result: string;
  sprint: string;
  qualifying: string;
  pitstop: string;
  lap: string;
  driverstanding: string;
  constructorstanding: string;
  status: string;
}

export interface Season {
  season: string;
  url: string;
}

export interface Circuit {
  circuitId: string;
  circuitName: string;
  Location: {
    locality: string;
    country: string;
    lat: string;
    long: string;
  };
  url: string;
}

export interface Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
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

export interface Result {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: {
    millis: string;
    time: string;
  };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: {
      time: string;
    };
    AverageSpeed: {
      units: string;
      speed: string;
    };
  };
}
