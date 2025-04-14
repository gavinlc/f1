import { Link } from '@tanstack/react-router';

export default function Header() {
  return (
    <header>
      <nav className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">
                F1 Browser
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/circuits"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Circuits
              </Link>
              <Link
                to="/drivers"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Drivers
              </Link>
              <Link
                to="/constructors"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Constructors
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
