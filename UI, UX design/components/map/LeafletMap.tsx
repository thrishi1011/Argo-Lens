import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useProfile } from '@/contexts/ProfileContext';

// Fix Leaflet default marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface FieldData {
  id: string;
  name: string;
  area: number;
  cropType: string;
  health: {
    healthScore: number;
    ndvi: number;
    evi: number;
    savi: number;
  };
  // GeoJSON coordinates for polygon
  geoCoords?: number[][];
}

interface LeafletMapProps {
  fields: FieldData[];
  selectedField: string | null;
  onFieldSelect: (fieldId: string | null) => void;
  showNDVI: boolean;
  showSensors: boolean;
  showLabels: boolean;
}

// Sample real-world coordinates for demo (farmland in central US - Iowa area)
const getFieldGeoCoords = (fieldId: string): [number, number][] => {
  const baseCoords: Record<string, [number, number][]> = {
    '1': [
      [41.6520, -93.7100],
      [41.6520, -93.7000],
      [41.6450, -93.7000],
      [41.6450, -93.7100],
      [41.6520, -93.7100],
    ],
    '2': [
      [41.6440, -93.6980],
      [41.6440, -93.6880],
      [41.6380, -93.6880],
      [41.6380, -93.6980],
      [41.6440, -93.6980],
    ],
    '3': [
      [41.6370, -93.7090],
      [41.6370, -93.7010],
      [41.6320, -93.7010],
      [41.6320, -93.7090],
      [41.6370, -93.7090],
    ],
    '4': [
      [41.6530, -93.6870],
      [41.6530, -93.6780],
      [41.6480, -93.6780],
      [41.6480, -93.6870],
      [41.6530, -93.6870],
    ],
    '5': [
      [41.6400, -93.6760],
      [41.6400, -93.6670],
      [41.6340, -93.6670],
      [41.6340, -93.6760],
      [41.6400, -93.6760],
    ],
    '6': [
      [41.6310, -93.6850],
      [41.6310, -93.6760],
      [41.6260, -93.6760],
      [41.6260, -93.6850],
      [41.6310, -93.6850],
    ],
  };
  return baseCoords[fieldId] || baseCoords['1'];
};

const getHealthColor = (healthScore: number): string => {
  if (healthScore >= 80) return '#22c55e';
  if (healthScore >= 60) return '#4ade80';
  if (healthScore >= 40) return '#eab308';
  return '#ef4444';
};

const LeafletMap = ({
  fields,
  selectedField,
  onFieldSelect,
  showNDVI,
  showSensors,
  showLabels,
}: LeafletMapProps) => {
  const { profile } = useProfile();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const labelsRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize the map centered on our farm coordinates
    const map = L.map(mapContainerRef.current, {
      center: profile.coordinates,
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    });

    // Add satellite tile layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    }).addTo(map);

    // Add a light overlay for labels
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map center when profile coordinates change
  useEffect(() => {
    if (mapRef.current && profile.coordinates) {
      mapRef.current.setView(profile.coordinates, 14);
    }
  }, [profile.coordinates]);

  // Update field polygons
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing polygons
    polygonsRef.current.forEach((polygon) => polygon.remove());
    polygonsRef.current.clear();

    // Add field polygons
    fields.forEach((field) => {
      const coords = getFieldGeoCoords(field.id);
      const color = showNDVI ? getHealthColor(field.health.healthScore) : '#3b82f6';

      const polygon = L.polygon(coords, {
        color: selectedField === field.id ? '#ffffff' : color,
        weight: selectedField === field.id ? 3 : 2,
        fillColor: color,
        fillOpacity: showNDVI ? 0.5 : 0.2,
        className: 'field-polygon',
      }).addTo(map);

      polygon.on('click', () => {
        onFieldSelect(selectedField === field.id ? null : field.id);
      });

      polygon.bindTooltip(`${field.name}<br/>NDVI: ${field.health.ndvi.toFixed(2)}<br/>Health: ${field.health.healthScore}%`, {
        permanent: false,
        direction: 'center',
        className: 'field-tooltip',
      });

      polygonsRef.current.set(field.id, polygon);
    });
  }, [fields, selectedField, showNDVI, onFieldSelect]);

  // Update sensor markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    if (!showSensors) return;

    // Add sensor markers
    fields.forEach((field) => {
      const coords = getFieldGeoCoords(field.id);
      // Place sensor at center of field
      const centerLat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
      const centerLng = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;

      const sensorIcon = L.divIcon({
        html: `
          <div class="sensor-marker">
            <div class="sensor-pulse"></div>
            <div class="sensor-dot"></div>
          </div>
        `,
        className: 'sensor-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([centerLat, centerLng], { icon: sensorIcon }).addTo(map);
      marker.bindTooltip(`IoT Sensor - ${field.name}`, { direction: 'top' });
      markersRef.current.set(field.id, marker);
    });
  }, [fields, showSensors]);

  // Update labels
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing labels
    labelsRef.current.forEach((label) => label.remove());
    labelsRef.current.clear();

    if (!showLabels) return;

    // Add field labels
    fields.forEach((field) => {
      const coords = getFieldGeoCoords(field.id);
      const centerLat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
      const centerLng = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;

      const labelIcon = L.divIcon({
        html: `<div class="field-label">${field.name}</div>`,
        className: 'field-label-icon',
        iconSize: [100, 20],
        iconAnchor: [50, 10],
      });

      const label = L.marker([centerLat, centerLng], { icon: labelIcon, interactive: false }).addTo(map);
      labelsRef.current.set(field.id, label);
    });
  }, [fields, showLabels]);

  // Fly to selected field
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedField) return;

    const coords = getFieldGeoCoords(selectedField);
    const centerLat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
    const centerLng = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;

    map.flyTo([centerLat, centerLng], 16, { duration: 0.5 });
  }, [selectedField]);

  return (
    <>
      <style>{`
        .sensor-marker {
          position: relative;
          width: 24px;
          height: 24px;
        }
        .sensor-pulse {
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.4);
          animation: pulse 2s ease-out infinite;
        }
        .sensor-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .field-label {
          background: rgba(0, 0, 0, 0.75);
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
          text-align: center;
        }
        .field-label-icon {
          background: transparent !important;
          border: none !important;
        }
        .sensor-icon {
          background: transparent !important;
          border: none !important;
        }
        .field-tooltip {
          background: rgba(0, 0, 0, 0.85) !important;
          color: white !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          font-size: 12px !important;
        }
        .field-tooltip::before {
          border-top-color: rgba(0, 0, 0, 0.85) !important;
        }
        .leaflet-container {
          background: #1a1a2e;
        }
      `}</style>
      <div ref={mapContainerRef} className="w-full h-full" />
    </>
  );
};

export default LeafletMap;