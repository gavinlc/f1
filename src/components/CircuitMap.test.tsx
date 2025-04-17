import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CircuitMap } from './CircuitMap';

// Mock react-leaflet components
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
}));

// Mock Leaflet
vi.mock('leaflet', () => ({
  default: {
    icon: vi.fn().mockReturnValue({
      iconUrl: 'mock-icon-url',
      iconRetinaUrl: 'mock-icon-retina-url',
      shadowUrl: 'mock-shadow-url',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      shadowAnchor: [12, 41],
      tooltipAnchor: [16, -28],
    }),
    Marker: {
      prototype: {
        options: {
          icon: null,
        },
      },
    },
  },
}));

describe('CircuitMap', () => {
  test('renders map with correct props', () => {
    render(
      <CircuitMap
        latitude={26.0325}
        longitude={50.5106}
        circuitName="Bahrain International Circuit"
      />,
    );

    // Check map container is rendered
    expect(screen.getByTestId('map-container')).toBeDefined();

    // Check tile layer is rendered
    expect(screen.getByTestId('tile-layer')).toBeDefined();

    // Check marker is rendered
    expect(screen.getByTestId('marker')).toBeDefined();

    // Check popup with circuit name is rendered
    expect(screen.getByTestId('popup')).toBeDefined();
    expect(screen.getByText('Bahrain International Circuit')).toBeDefined();
  });

  test('sets map container height on mount', () => {
    // Mock document.querySelector
    const mockMapContainer = document.createElement('div');
    mockMapContainer.className = 'leaflet-container';
    vi.spyOn(document, 'querySelector').mockReturnValue(mockMapContainer);

    render(
      <CircuitMap
        latitude={26.0325}
        longitude={50.5106}
        circuitName="Bahrain International Circuit"
      />,
    );

    // Check if the height was set
    expect(mockMapContainer.style.height).toBe('400px');
  });

  test('handles missing map container gracefully', () => {
    // Mock document.querySelector to return null
    vi.spyOn(document, 'querySelector').mockReturnValue(null);

    // Should not throw an error
    expect(() =>
      render(
        <CircuitMap
          latitude={26.0325}
          longitude={50.5106}
          circuitName="Bahrain International Circuit"
        />,
      ),
    ).not.toThrow();
  });
});
