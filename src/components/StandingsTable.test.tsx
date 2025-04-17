import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StandingsTable } from './StandingsTable';
import type { ConstructorStanding, DriverStanding } from '../types/f1';

// Mock the CountryFlag component
vi.mock('./CountryFlag', () => ({
  CountryFlag: ({ nationality }: { nationality: string }) => (
    <div data-testid={`flag-${nationality}`}>Flag: {nationality}</div>
  ),
}));

describe('StandingsTable', () => {
  const mockDriverStandings: Array<DriverStanding> = [
    {
      position: '1',
      positionText: '1',
      points: '575',
      wins: '19',
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
      Constructors: [
        {
          constructorId: 'red_bull',
          url: 'http://example.com/red-bull',
          name: 'Red Bull Racing',
          nationality: 'Austrian',
        },
      ],
    },
    {
      position: '2',
      positionText: '2',
      points: '285',
      wins: '2',
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
      Constructors: [
        {
          constructorId: 'mercedes',
          url: 'http://example.com/mercedes',
          name: 'Mercedes',
          nationality: 'German',
        },
      ],
    },
  ];

  const mockConstructorStandings: Array<ConstructorStanding> = [
    {
      position: '1',
      positionText: '1',
      points: '860',
      wins: '21',
      Constructor: {
        constructorId: 'red_bull',
        url: 'http://example.com/red-bull',
        name: 'Red Bull Racing',
        nationality: 'Austrian',
      },
    },
    {
      position: '2',
      positionText: '2',
      points: '409',
      wins: '1',
      Constructor: {
        constructorId: 'mercedes',
        url: 'http://example.com/mercedes',
        name: 'Mercedes',
        nationality: 'German',
      },
    },
  ];

  describe('Driver Standings', () => {
    test('renders driver standings table correctly', () => {
      render(
        <StandingsTable
          title="Driver Standings"
          standings={mockDriverStandings}
          type="driver"
        />,
      );

      // Check title
      expect(screen.getByTestId('standings-title')).toHaveTextContent(
        'Driver Standings',
      );

      // Check table headers
      expect(screen.getByText('Pos')).toBeDefined();
      expect(screen.getByText('Driver')).toBeDefined();
      expect(screen.getByText('Points')).toBeDefined();
      expect(screen.getByText('Wins')).toBeDefined();

      // Check first driver's details
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('1'); // Position
      expect(rows[1]).toHaveTextContent('Max Verstappen');
      expect(rows[1]).toHaveTextContent('575');
      expect(rows[1]).toHaveTextContent('19');

      // Check second driver's details
      expect(rows[2]).toHaveTextContent('2'); // Position
      expect(rows[2]).toHaveTextContent('Lewis Hamilton');
      expect(rows[2]).toHaveTextContent('285');
      expect(rows[2]).toHaveTextContent('2'); // Wins

      // Check flags are rendered
      expect(screen.getByTestId('flag-Dutch')).toBeDefined();
      expect(screen.getByTestId('flag-British')).toBeDefined();
    });

    test('handles empty driver standings', () => {
      render(
        <StandingsTable
          title="Driver Standings"
          standings={[]}
          type="driver"
        />,
      );

      expect(screen.getByTestId('standings-title')).toHaveTextContent(
        'Driver Standings',
      );
      expect(screen.getByText('No standings data available')).toBeDefined();
    });
  });

  describe('Constructor Standings', () => {
    test('renders constructor standings table correctly', () => {
      render(
        <StandingsTable
          title="Constructor Standings"
          standings={mockConstructorStandings}
          type="constructor"
        />,
      );

      // Check title
      expect(screen.getByTestId('standings-title')).toHaveTextContent(
        'Constructor Standings',
      );

      // Check table headers
      expect(screen.getByText('Pos')).toBeDefined();
      expect(screen.getByText('Team')).toBeDefined();
      expect(screen.getByText('Points')).toBeDefined();
      expect(screen.getByText('Wins')).toBeDefined();

      // Check first constructor's details
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('1'); // Position
      expect(rows[1]).toHaveTextContent('Red Bull Racing');
      expect(rows[1]).toHaveTextContent('860');
      expect(rows[1]).toHaveTextContent('21');

      // Check second constructor's details
      expect(rows[2]).toHaveTextContent('2'); // Position
      expect(rows[2]).toHaveTextContent('Mercedes');
      expect(rows[2]).toHaveTextContent('409');
      expect(rows[2]).toHaveTextContent('1'); // Wins

      // Check flags are rendered
      expect(screen.getByTestId('flag-Austrian')).toBeDefined();
      expect(screen.getByTestId('flag-German')).toBeDefined();
    });

    test('handles empty constructor standings', () => {
      render(
        <StandingsTable
          title="Constructor Standings"
          standings={[]}
          type="constructor"
        />,
      );

      expect(screen.getByTestId('standings-title')).toHaveTextContent(
        'Constructor Standings',
      );
      expect(screen.getByText('No standings data available')).toBeDefined();
    });
  });
});
