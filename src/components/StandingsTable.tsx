import { Link } from '@tanstack/react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { CountryFlag } from './CountryFlag';
import type { ConstructorStanding, DriverStanding } from '../types/f1';

interface StandingsTableProps {
  title: string;
  standings: Array<DriverStanding | ConstructorStanding>;
  type: 'driver' | 'constructor';
}

function calculatePointsDifference(
  currentPoints: number,
  nextPoints: number,
  isLastPosition: boolean,
): string {
  if (isLastPosition) {
    return '-';
  }

  const pointsDifference = currentPoints - nextPoints;
  return pointsDifference > 0
    ? `+${pointsDifference}`
    : pointsDifference.toString();
}

export function StandingsTable({
  title,
  standings,
  type,
}: StandingsTableProps) {
  if (standings.length === 0) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p>No standings available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Wins</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Gap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((standing, index) => {
              const currentPoints = parseFloat(standing.points);
              const nextPoints =
                index < standings.length - 1
                  ? parseFloat(standings[index + 1].points)
                  : currentPoints;
              const formattedDifference = calculatePointsDifference(
                currentPoints,
                nextPoints,
                index === standings.length - 1,
              );

              return (
                <TableRow
                  key={
                    type === 'driver'
                      ? (standing as DriverStanding).Driver.driverId
                      : (standing as ConstructorStanding).Constructor
                          .constructorId
                  }
                >
                  <TableCell>{standing.position}</TableCell>
                  <TableCell>
                    {type === 'driver' ? (
                      <Link
                        to="/drivers/$driverId"
                        params={{
                          driverId: (standing as DriverStanding).Driver
                            .driverId,
                        }}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <CountryFlag
                          nationality={
                            (standing as DriverStanding).Driver.nationality
                          }
                          className="w-6 h-4"
                        />
                        {(standing as DriverStanding).Driver.givenName}{' '}
                        {(standing as DriverStanding).Driver.familyName}
                      </Link>
                    ) : (
                      <Link
                        to="/constructors/$constructorId"
                        params={{
                          constructorId: (standing as ConstructorStanding)
                            .Constructor.constructorId,
                        }}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <CountryFlag
                          nationality={
                            (standing as ConstructorStanding).Constructor
                              .nationality
                          }
                          className="w-6 h-4"
                        />
                        {(standing as ConstructorStanding).Constructor.name}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell>{standing.wins}</TableCell>
                  <TableCell>{standing.points}</TableCell>
                  <TableCell>{formattedDifference}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
