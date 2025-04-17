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
              <TableHead>Points</TableHead>
              <TableHead>Wins</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((standing) => (
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
                        driverId: (standing as DriverStanding).Driver.driverId,
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
                <TableCell>{standing.points}</TableCell>
                <TableCell>{standing.wins}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
