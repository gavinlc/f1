import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
// This is needed because Leaflet's default marker icons don't work properly with webpack/vite
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
  tooltipAnchor: [16, -28],
});

L.Marker.prototype.options.icon = defaultIcon;

interface CircuitMapProps {
  latitude: number;
  longitude: number;
  circuitName: string;
}

export function CircuitMap({
  latitude,
  longitude,
  circuitName,
}: CircuitMapProps) {
  // Ensure the map container has a height
  useEffect(() => {
    // This is needed because Leaflet requires a height to be set on the container
    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer) {
      (mapContainer as HTMLElement).style.height = '400px';
    }
  }, []);

  return (
    <div className="rounded-md overflow-hidden border">
      <MapContainer
        center={[latitude, longitude] as [number, number]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude] as [number, number]}>
          <Popup>{circuitName}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
