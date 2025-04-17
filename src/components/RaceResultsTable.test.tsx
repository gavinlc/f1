import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { RaceResultsTable } from './RaceResultsTable';
import type { Race } from '../types/f1';

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

describe('RaceResultsTable', () => {
  const mockRaces: Array<Race> = [
    {
      season: '2025',
      round: '1',
      url: 'http://example.com/bahrain-gp',
      raceName: 'Bahrain Grand Prix',
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
      date: '2025-03-02',
      time: '15:00:00Z',
    },
    {
      season: '2025',
      round: '2',
      url: 'http://example.com/saudi-gp',
      raceName: 'Saudi Arabian Grand Prix',
      Circuit: {
        circuitId: 'jeddah',
        circuitName: 'Jeddah Corniche Circuit',
        url: 'http://example.com/jeddah',
        Location: {
          locality: 'Jeddah',
          country: 'Saudi Arabia',
          lat: '21.6319',
          long: '39.1044',
        },
      },
      date: '2025-03-09',
      time: '20:00:00Z',
    },
    {
      season: '2025',
      round: '3',
      url: 'http://example.com/australia-gp',
      raceName: 'Australian Grand Prix',
      Circuit: {
        circuitId: 'albert_park',
        circuitName: 'Albert Park Circuit',
        url: 'http://example.com/albert-park',
        Location: {
          locality: 'Melbourne',
          country: 'Australia',
          lat: '-37.8497',
          long: '144.9687',
        },
      },
      date: '2025-03-23',
      time: '15:00:00Z',
    },
  ];

  const mockResults = [
    {
      round: '1',
      Results: [
        {
          number: '44',
          position: '1',
          positionText: '1',
          points: '25',
          Driver: {
            driverId: 'hamilton',
            permanentNumber: '44',
            code: 'HAM',
            url: 'http://example.com/hamilton',
            givenName: 'Lewis',
            familyName: 'Hamilton',
            dateOfBirth: '1985-01-07',
            nationality: 'British',
          },
          Constructor: {
            constructorId: 'mercedes',
            url: 'http://example.com/mercedes',
            name: 'Mercedes',
            nationality: 'German',
          },
          grid: '2',
          laps: '57',
          status: 'Finished',
          Time: {
            millis: '5412000',
            time: '1:30:12.000',
          },
        },
      ],
    },
    {
      round: '2',
      Results: [
        {
          number: '44',
          position: '3',
          positionText: '3',
          points: '15',
          Driver: {
            driverId: 'hamilton',
            permanentNumber: '44',
            code: 'HAM',
            url: 'http://example.com/hamilton',
            givenName: 'Lewis',
            familyName: 'Hamilton',
            dateOfBirth: '1985-01-07',
            nationality: 'British',
          },
          Constructor: {
            constructorId: 'mercedes',
            url: 'http://example.com/mercedes',
            name: 'Mercedes',
            nationality: 'German',
          },
          grid: '1',
          laps: '50',
          status: 'Finished',
          Time: {
            millis: '5415000',
            time: '+2.337',
          },
        },
      ],
    },
  ];

  const mockSprintResults = [
    {
      round: '1',
      Results: [
        {
          number: '44',
          position: '2',
          positionText: '2',
          points: '7',
          Driver: {
            driverId: 'hamilton',
            permanentNumber: '44',
            code: 'HAM',
            url: 'http://example.com/hamilton',
            givenName: 'Lewis',
            familyName: 'Hamilton',
            dateOfBirth: '1985-01-07',
            nationality: 'British',
          },
          Constructor: {
            constructorId: 'mercedes',
            url: 'http://example.com/mercedes',
            name: 'Mercedes',
            nationality: 'German',
          },
          grid: '3',
          laps: '24',
          status: 'Finished',
          Time: {
            millis: '2280000',
            time: '38:00.000',
          },
        },
      ],
    },
    {
      round: '2',
      Results: [
        {
          number: '44',
          position: '1',
          positionText: '1',
          points: '8',
          Driver: {
            driverId: 'hamilton',
            permanentNumber: '44',
            code: 'HAM',
            url: 'http://example.com/hamilton',
            givenName: 'Lewis',
            familyName: 'Hamilton',
            dateOfBirth: '1985-01-07',
            nationality: 'British',
          },
          Constructor: {
            constructorId: 'mercedes',
            url: 'http://example.com/mercedes',
            name: 'Mercedes',
            nationality: 'German',
          },
          grid: '2',
          laps: '24',
          status: 'Finished',
          Time: {
            millis: '2280000',
            time: '38:00.000',
          },
        },
      ],
    },
  ];

  const mockDrivers = [
    {
      driverId: 'hamilton',
      permanentNumber: '44',
      code: 'HAM',
      url: 'http://example.com/hamilton',
      givenName: 'Lewis',
      familyName: 'Hamilton',
      dateOfBirth: '1985-01-07',
      nationality: 'British',
    },
    {
      driverId: 'verstappen',
      permanentNumber: '1',
      code: 'VER',
      url: 'http://example.com/verstappen',
      givenName: 'Max',
      familyName: 'Verstappen',
      dateOfBirth: '1997-09-30',
      nationality: 'Dutch',
    },
  ];

  it('renders driver view mode correctly', () => {
    render(
      <RaceResultsTable
        races={mockRaces}
        results={mockResults}
        sprintResults={mockSprintResults}
        drivers={[mockDrivers[0]]}
        viewMode="driver"
      />,
    );

    // Check headers
    expect(screen.getByText('Race')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Position')).toBeInTheDocument();
    expect(screen.getByText('Points')).toBeInTheDocument();
    expect(screen.getByText('Grid')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    // Check race data
    expect(screen.getByText('Bahrain Grand Prix')).toBeInTheDocument();
    expect(screen.getByText('Saudi Arabian Grand Prix')).toBeInTheDocument();
    expect(screen.getByText('Australian Grand Prix')).toBeInTheDocument();

    // Check result data
    const p1Elements = screen.getAllByText('P1');
    expect(p1Elements.length).toBeGreaterThan(0);
    expect(screen.getByText('25')).toBeInTheDocument();
    const gridElements = screen.getAllByText('2');
    expect(gridElements.length).toBeGreaterThan(0);
    const finishedElements = screen.getAllByText('Finished');
    expect(finishedElements.length).toBeGreaterThan(0);

    // Check sprint result data
    const sprintRaceElements = screen.getAllByText('Sprint Race');
    expect(sprintRaceElements.length).toBeGreaterThan(0);
    expect(screen.getByText('P2')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();

    // Check upcoming race
    const dashElements = screen.getAllByText('-');
    expect(dashElements.length).toBeGreaterThan(0);
  });

  it('renders constructor view mode correctly', () => {
    render(
      <RaceResultsTable
        races={mockRaces}
        results={mockResults}
        sprintResults={mockSprintResults}
        drivers={mockDrivers}
        viewMode="constructor"
      />,
    );

    // Check headers
    expect(screen.getByText('Race')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Lewis Hamilton')).toBeInTheDocument();
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();

    // Check race data
    expect(screen.getByText('Bahrain Grand Prix')).toBeInTheDocument();
    expect(screen.getByText('Saudi Arabian Grand Prix')).toBeInTheDocument();
    expect(screen.getByText('Australian Grand Prix')).toBeInTheDocument();

    // Check result data
    const p1Elements = screen.getAllByText('P1');
    expect(p1Elements.length).toBeGreaterThan(0);
    expect(screen.getByText('25 pts')).toBeInTheDocument();
    expect(screen.getByText('P3')).toBeInTheDocument();
    expect(screen.getByText('15 pts')).toBeInTheDocument();

    // Check sprint result data
    expect(screen.getByText('Sprint: P2 (7 pts)')).toBeInTheDocument();
    expect(screen.getByText('Sprint: P1 (8 pts)')).toBeInTheDocument();

    // Check upcoming race
    const dashElements = screen.getAllByText('-');
    expect(dashElements.length).toBeGreaterThan(0);
  });
});
