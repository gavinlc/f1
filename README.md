# F1 2025 Browser

A modern web application for exploring Formula 1 data, built with React and the TanStack ecosystem. This application provides a comprehensive interface for browsing F1 circuits, drivers, constructors, and race results for the 2025 season.

## Features

- 🏎️ Real-time F1 data from the Ergast API
- 📱 Responsive design with modern UI components
- 🚀 Fast page transitions with TanStack Router
- 🔄 Efficient data fetching with TanStack Query
- 🎨 Beautiful UI with Shadcn components and Tailwind CSS
- 🌙 Dark mode support
- 📊 Type-safe development with TypeScript

## Technical Stack

### Core Technologies

- **React 19**: Latest version for optimal performance and features
- **TypeScript**: For type safety and better developer experience
- **Vite**: Modern build tool for fast development and optimised production builds

### State Management & Data Fetching

- **TanStack Query**: For efficient server state management and data fetching
- **TanStack Store**: For client-side state management with derived state support
- **TanStack Router**: For type-safe routing with file-based routing support

### UI & Styling

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Shadcn UI**: High-quality, accessible components built on Radix UI
- **Lucide Icons**: Modern icon set for consistent visual design

### Development Tools

- **ESLint**: For code linting with TanStack's recommended configuration
- **Prettier**: For consistent code formatting
- **Vitest**: For unit testing
- **TypeScript**: For static type checking

## Architecture

### Application Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── services/      # API and data services
├── types/         # TypeScript type definitions
├── styles/        # Global styles and theme
└── lib/          # Utility functions and helpers
```

### Key Architectural Decisions

1. **Component-Based Architecture**

   - Modular components for better maintainability
   - Separation of concerns between UI, data fetching, and business logic
   - Reusable components using Shadcn UI library

2. **Data Management**

   - Centralised API service layer for F1 data
   - TanStack Query for efficient data caching and synchronisation
   - Type-safe API responses with TypeScript interfaces

3. **Routing**

   - Code-based routing for explicit route definitions
   - Type-safe route definitions with TanStack Router
   - Nested layouts for consistent UI structure
   - Centralised route management in `src/router.tsx`

4. **Styling**
   - Tailwind CSS for utility-first styling
   - CSS variables for theme customisation
   - Responsive design patterns

## Getting Started

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Start the development server:

   ```bash
   yarn start
   ```

3. Build for production:
   ```bash
   yarn build
   ```

## Development

### Available Scripts

- `yarn start`: Start development server
- `yarn build`: Build for production
- `yarn test`: Run tests
- `yarn lint`: Run ESLint
- `yarn format`: Format code with Prettier
- `yarn check`: Run both linting and formatting

### Adding New Components

To add new Shadcn components:

```bash
npx shadcn@latest add [component-name]
```

## Technical Decisions & Trade-offs

### Chosen Technologies

1. **TanStack Ecosystem**

   - Pros: Type safety, excellent developer experience, modern features
   - Cons: Newer ecosystem, smaller community compared to alternatives

2. **Code-Based Routing**

   - Pros: Explicit route definitions, better control over route configuration, easier to maintain complex routing logic
   - Cons: More manual setup compared to file-based routing, requires centralised route management

3. **Shadcn UI**
   - Pros: High-quality components, customisable, accessible
   - Cons: Requires more setup compared to traditional UI libraries

### Future Improvements

1. **Performance Optimisations**

   - Implement React Suspense for better loading states
   - Add service worker for offline support
   - Optimise bundle size with code splitting

2. **Feature Additions**

   - Real-time race updates
   - Historical data & comparisons
   - Driver statistics and analytics
   - User preferences and favourites

3. **Technical Debt**
   - Some components might benefit from further decomposition (particularly the Results page)
   - Add comprehensive test coverage
   - Implement E2E testing with Cypress or Playwright
   - Add performance monitoring
   - Improve accessibility compliance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
