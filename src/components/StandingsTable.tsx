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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="p-4 border rounded-lg">
          <p className="text-muted-foreground">No standings data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Pos</TableHead>
              <TableHead>{type === 'driver' ? 'Driver' : 'Team'}</TableHead>
              <TableHead className="w-16">Points</TableHead>
              <TableHead className="w-16">Wins</TableHead>
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
                    <div className="flex items-center gap-2">
                      <CountryFlag
                        nationality={
                          (standing as DriverStanding).Driver.nationality
                        }
                        className="w-6 h-4"
                      />
                      {(standing as DriverStanding).Driver.givenName}{' '}
                      {(standing as DriverStanding).Driver.familyName}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CountryFlag
                        nationality={
                          (standing as ConstructorStanding).Constructor
                            .nationality
                        }
                        className="w-6 h-4"
                      />
                      {(standing as ConstructorStanding).Constructor.name}
                    </div>
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
