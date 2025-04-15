import { Link } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

export function Home() {
  const sections = [
    {
      title: '2025 Results',
      description: 'View race results and standings for the 2025 season',
      path: '/results',
    },
    {
      title: '2025 Circuits',
      description: 'Browse Formula 1 circuits used in the 2025 season',
      path: '/circuits',
    },
    {
      title: '2025 Drivers',
      description: 'View current Formula 1 drivers and their information',
      path: '/drivers',
    },
    {
      title: '2025 Constructors',
      description: 'Explore Formula 1 teams and their details',
      path: '/constructors',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to F1 2025 Browser</h1>
      <p className="text-muted-foreground">
        Explore Formula 1 data from the Ergast API. Browse through circuits,
        drivers, constructors, and race results.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link key={section.path} to={section.path}>
            <Card className="h-full hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle
                  data-testid={`${section.title.toLowerCase()}-card-title`}
                >
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
