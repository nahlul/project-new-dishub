import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon paths (broken by webpack/craco bundling).
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Colored circular divIcon for halte markers.
function haltePin(color = '#0284c7') {
  return L.divIcon({
    className: 'halte-pin',
    html: `<span style="display:block;width:14px;height:14px;border-radius:50%;
      background:${color};border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.25)"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

const userPin = L.divIcon({
  className: 'user-pin',
  html: `<span style="display:block;width:16px;height:16px;border-radius:50%;
    background:#2563eb;border:3px solid #fff;box-shadow:0 0 0 2px #2563eb"></span>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Recenter/zoom the map when the target bounds change.
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    const valid = (points || []).filter((p) => p && p.lat != null && p.lng != null);
    if (valid.length === 0) return;
    if (valid.length === 1) {
      map.setView([valid[0].lat, valid[0].lng], 15);
      return;
    }
    const bounds = L.latLngBounds(valid.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
  }, [points, map]);
  return null;
}

/**
 * Reusable Leaflet map.
 * - user: {lat,lng} optional highlighted user position (with accuracy circle)
 * - markers: [{lat,lng,label,color,sub}] halte markers
 * - fit: array of {lat,lng} used to auto-fit the viewport
 */
const HalteMap = ({ user, markers = [], fit, height = 360, accuracy }) => {
  const center = user
    ? [user.lat, user.lng]
    : markers[0]
    ? [markers[0].lat, markers[0].lng]
    : [5.5483, 95.3238]; // Banda Aceh center fallback

  const fitPoints = fit || [
    ...(user ? [user] : []),
    ...markers.filter((m) => m.lat != null),
  ];

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm" style={{ height }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={fitPoints} />

        {user && (
          <>
            {accuracy != null && (
              <Circle center={[user.lat, user.lng]} radius={accuracy} pathOptions={{ color: '#2563eb', fillOpacity: 0.08 }} />
            )}
            <Marker position={[user.lat, user.lng]} icon={userPin}>
              <Popup>Lokasi Anda</Popup>
            </Marker>
          </>
        )}

        {markers.map((m, i) =>
          m.lat != null && m.lng != null ? (
            <Marker key={i} position={[m.lat, m.lng]} icon={haltePin(m.color)}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{m.label}</p>
                  {m.sub && <p className="text-gray-500 text-xs mt-0.5">{m.sub}</p>}
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
};

export default HalteMap;
