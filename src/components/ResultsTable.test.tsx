import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultsTable } from './ResultsTable';
import type { RaceResult } from '../types/f1';

// Mock the CountryFlag component
vi.mock('./CountryFlag', () => ({
  CountryFlag: ({ nationality }: { nationality: string }) => (
    <div data-testid={`flag-${nationality}`}>Flag: {nationality}</div>
  ),
}));

describe('ResultsTable', () => {
  const mockResults: Array<RaceResult> = [
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
    {
      number: '2',
      position: '2',
      positionText: '2',
      points: '18',
      Driver: {
        driverId: 'lewis_hamilton',
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
        millis: '5415000',
        time: '+2.337',
      },
    },
  ];

  test('renders table with results', () => {
    render(
      <ResultsTable
        results={mockResults}
        title="Grand Prix Results"
        raceDate="2024-03-02"
      />,
    );

    // Check title
    expect(screen.getByText('Grand Prix Results')).toBeDefined();

    // Check table headers
    expect(screen.getByText('Pos')).toBeDefined();
    expect(screen.getByText('Driver')).toBeDefined();
    expect(screen.getByText('Team')).toBeDefined();
    expect(screen.getByText('Time/Gap')).toBeDefined();
    expect(screen.getByText('Points')).toBeDefined();

    // Check first driver's details
    expect(screen.getByText('Max Verstappen')).toBeDefined();
    expect(screen.getByText('Red Bull Racing')).toBeDefined();
    expect(screen.getByText('1:30:12.000')).toBeDefined();
    expect(screen.getByText('25')).toBeDefined();

    // Check second driver's details
    expect(screen.getByText('Lewis Hamilton')).toBeDefined();
    expect(screen.getByText('Mercedes')).toBeDefined();
    expect(screen.getByText('+2.337')).toBeDefined();
    expect(screen.getByText('18')).toBeDefined();

    // Check flags are rendered
    expect(screen.getByTestId('flag-Dutch')).toBeDefined();
    expect(screen.getByTestId('flag-British')).toBeDefined();
    expect(screen.getByTestId('flag-Austrian')).toBeDefined();
    expect(screen.getByTestId('flag-German')).toBeDefined();
  });

  test('renders future race message', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // 7 days in the future

    render(
      <ResultsTable
        results={mockResults}
        title="Grand Prix Results"
        raceDate={futureDate.toISOString().split('T')[0]}
      />,
    );

    expect(
      screen.getByText(
        "This race hasn't taken place yet. Please check back after the race.",
      ),
    ).toBeDefined();
  });

  test('renders no results message when results array is empty', () => {
    render(
      <ResultsTable
        results={[]}
        title="Grand Prix Results"
        raceDate="2024-03-02"
      />,
    );

    expect(
      screen.getByText('No results available for this race.'),
    ).toBeDefined();
  });

  test('handles results with DNF status', () => {
    const dnfResults: Array<RaceResult> = [
      {
        number: '3',
        position: 'DNF',
        positionText: 'DNF',
        points: '0',
        Driver: {
          driverId: 'charles_leclerc',
          permanentNumber: '16',
          code: 'LEC',
          url: 'http://example.com/leclerc',
          givenName: 'Charles',
          familyName: 'Leclerc',
          dateOfBirth: '1997-10-16',
          nationality: 'Monegasque',
        },
        Constructor: {
          constructorId: 'ferrari',
          url: 'http://example.com/ferrari',
          name: 'Ferrari',
          nationality: 'Italian',
        },
        grid: '3',
        laps: '45',
        status: 'DNF',
      },
    ];

    render(
      <ResultsTable
        results={dnfResults}
        title="Grand Prix Results"
        raceDate="2024-03-02"
      />,
    );

    expect(screen.getByText('Charles Leclerc')).toBeDefined();
    expect(screen.getByText('Ferrari')).toBeDefined();

    // Use a more specific query to find the DNF in the position column
    const positionCells = screen.getAllByRole('cell');
    const positionCell = positionCells.find(
      (cell) => cell.textContent === 'DNF',
    );
    expect(positionCell).toBeDefined();

    expect(screen.getByText('0')).toBeDefined();
  });
});
