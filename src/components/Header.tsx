import { Link } from '@tanstack/react-router';
import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  return (
    <header>
      <nav className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">
                F1 2025 Browser
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/circuits"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Circuits
              </Link>
              <Link
                to="/drivers"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Drivers
              </Link>
              <Link
                to="/constructors"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Constructors
              </Link>
              <Link
                to="/results"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Results
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
