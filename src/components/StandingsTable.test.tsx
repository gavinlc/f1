import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StandingsTable } from './StandingsTable';
import type { ConstructorStanding, DriverStanding } from '../types/f1';

// Mock the CountryFlag component
vi.mock('./CountryFlag', () => ({
  CountryFlag: ({
    nationality,
    className,
  }: {
    nationality: string;
    className?: string;
  }) => (
    <div data-testid={`flag-${nationality}`} className={className}>
      Flag: {nationality}
    </div>
  ),
}));

// Mock the router
vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    params,
    children,
    className,
  }: {
    to: string;
    params?: Record<string, string>;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={to} className={className} role="link">
      {children}
    </a>
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
      wins: '17',
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

  test('renders driver standings correctly', () => {
    render(
      <StandingsTable
        standings={mockDriverStandings}
        type="driver"
        title="Driver Standings"
      />,
    );

    // Check headers
    expect(screen.getByText('Position')).toBeDefined();
    expect(screen.getByText('Name')).toBeDefined();
    expect(screen.getByText('Points')).toBeDefined();
    expect(screen.getByText('Wins')).toBeDefined();

    // Check first driver row
    const firstRow = screen.getByRole('row', { name: /Max Verstappen/i });
    expect(firstRow).toBeDefined();
    expect(firstRow).toHaveTextContent('1');
    expect(firstRow).toHaveTextContent('575');
    expect(firstRow).toHaveTextContent('19');
    expect(screen.getByTestId('flag-Dutch')).toBeDefined();

    // Check second driver row
    const secondRow = screen.getByRole('row', { name: /Lewis Hamilton/i });
    expect(secondRow).toBeDefined();
    expect(secondRow).toHaveTextContent('2');
    expect(secondRow).toHaveTextContent('285');
    expect(secondRow).toHaveTextContent('2');
    expect(screen.getByTestId('flag-British')).toBeDefined();
  });

  test('renders constructor standings correctly', () => {
    render(
      <StandingsTable
        standings={mockConstructorStandings}
        type="constructor"
        title="Constructor Standings"
      />,
    );

    // Check headers
    expect(screen.getByText('Position')).toBeDefined();
    expect(screen.getByText('Name')).toBeDefined();
    expect(screen.getByText('Points')).toBeDefined();
    expect(screen.getByText('Wins')).toBeDefined();

    // Check first constructor row
    const firstRow = screen.getByRole('row', { name: /Red Bull Racing/i });
    expect(firstRow).toBeDefined();
    expect(firstRow).toHaveTextContent('1');
    expect(firstRow).toHaveTextContent('860');
    expect(firstRow).toHaveTextContent('17');
    expect(screen.getByTestId('flag-Austrian')).toBeDefined();

    // Check second constructor row
    const secondRow = screen.getByRole('row', { name: /Mercedes/i });
    expect(secondRow).toBeDefined();
    expect(secondRow).toHaveTextContent('2');
    expect(secondRow).toHaveTextContent('409');
    expect(secondRow).toHaveTextContent('1');
    expect(screen.getByTestId('flag-German')).toBeDefined();
  });

  test('handles empty standings', () => {
    render(
      <StandingsTable standings={[]} type="driver" title="Driver Standings" />,
    );
    expect(screen.getByText('No standings available')).toBeDefined();
  });

  test('renders driver links correctly', () => {
    render(
      <StandingsTable
        standings={mockDriverStandings}
        type="driver"
        title="Driver Standings"
      />,
    );

    const verstappenLink = screen.getByRole('link', {
      name: /Max Verstappen/i,
    });
    expect(verstappenLink).toBeDefined();
    expect(verstappenLink).toHaveAttribute('href', '/drivers/$driverId');

    const hamiltonLink = screen.getByRole('link', { name: /Lewis Hamilton/i });
    expect(hamiltonLink).toBeDefined();
    expect(hamiltonLink).toHaveAttribute('href', '/drivers/$driverId');
  });

  test('renders constructor links correctly', () => {
    render(
      <StandingsTable
        standings={mockConstructorStandings}
        type="constructor"
        title="Constructor Standings"
      />,
    );

    const redBullLink = screen.getByRole('link', { name: /Red Bull Racing/i });
    expect(redBullLink).toBeDefined();
    expect(redBullLink).toHaveAttribute('href', '/constructors/$constructorId');

    const mercedesLink = screen.getByRole('link', { name: /Mercedes/i });
    expect(mercedesLink).toBeDefined();
    expect(mercedesLink).toHaveAttribute(
      'href',
      '/constructors/$constructorId',
    );
  });
});
