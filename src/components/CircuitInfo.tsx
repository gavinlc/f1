import type { Circuit } from '../types/f1';

interface CircuitInfoProps {
  circuit: Circuit;
}

export function CircuitInfo({ circuit }: CircuitInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Location</h3>
        <p className="text-muted-foreground">
          {circuit.Location.locality}, {circuit.Location.country}
        </p>
      </div>
    </div>
  );
}
