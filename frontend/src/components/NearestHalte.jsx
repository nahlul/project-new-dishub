import React, { useState } from 'react';
import { Navigation, MapPin, Bus, Loader2, AlertCircle } from 'lucide-react';
import { routesAPI } from '@/lib/api';
import { formatKm, nextBus, currentDayKey, DAY_LABELS } from '@/lib/routeUtils';
import HalteMap from './HalteMap';

// Feature 3: find the haltes nearest to the user's current position.
const NearestHalte = () => {
  const [status, setStatus] = useState('idle'); // idle | locating | loading | done | error
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [haltes, setHaltes] = useState([]);
  const dayKey = currentDayKey();

  const findNearest = () => {
    setError('');
    if (!('geolocation' in navigator)) {
      setStatus('error');
      setError('Peramban Anda tidak mendukung layanan lokasi.');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy: acc } = pos.coords;
        setUser({ lat: latitude, lng: longitude });
        setAccuracy(acc);
        setStatus('loading');
        try {
          const { data } = await routesAPI.nearest(latitude, longitude, 5);
          setHaltes(data);
          setStatus('done');
        } catch (err) {
          console.error(err);
          setStatus('error');
          setError('Gagal mengambil data halte terdekat. Coba lagi.');
        }
      },
      (err) => {
        setStatus('error');
        if (err.code === err.PERMISSION_DENIED) {
          setError('Izin lokasi ditolak. Aktifkan izin lokasi untuk memakai fitur ini.');
        } else {
          setError('Tidak dapat menentukan lokasi Anda. Coba lagi.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const markers = haltes.map((h) => ({
    lat: h.lat,
    lng: h.lng,
    label: h.nama,
    color: h.routes?.[0]?.route_warna || '#0284c7',
    sub: h.routes?.map((r) => r.route_nama).join(', '),
  }));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Consent / trigger card */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 mb-6 text-center">
        <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Navigation className="w-7 h-7 text-sky-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Cari Halte Terdekat</h3>
        <p className="text-gray-600 text-sm max-w-lg mx-auto mb-4">
          Kami akan meminta izin mengakses lokasi Anda untuk menemukan halte Trans
          Koetaradja yang paling dekat. Lokasi Anda tidak disimpan.
        </p>
        <button
          onClick={findNearest}
          disabled={status === 'locating' || status === 'loading'}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          {(status === 'locating' || status === 'loading') && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          {status === 'locating'
            ? 'Menentukan lokasi...'
            : status === 'loading'
            ? 'Mencari halte...'
            : 'Izinkan & Cari Halte Terdekat'}
        </button>

        {error && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {status === 'done' && haltes.length > 0 && (
        <>
          <div className="mb-6">
            <HalteMap user={user} accuracy={accuracy} markers={markers} height={340} />
          </div>

          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-600" />
            Halte Terdekat ({DAY_LABELS[dayKey]})
          </h4>
          <div className="space-y-3">
            {haltes.map((h, idx) => {
              const nb = nextBus(h.jadwal || {}, dayKey);
              return (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-gray-900">{h.nama}</span>
                      </div>
                      <div className="ml-8 mt-1 flex flex-wrap items-center gap-1.5">
                        {h.routes?.map((r, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${r.route_warna}20`, color: r.route_warna }}
                          >
                            <Bus className="w-3 h-3" /> {r.route_nama}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-sky-600">{formatKm(h.distance_km)}</p>
                      {nb && <p className="text-xs text-gray-500">Bus ±{nb.time}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {status === 'done' && haltes.length === 0 && (
        <p className="text-center text-gray-500">Tidak ada halte ditemukan di dekat Anda.</p>
      )}
    </div>
  );
};

export default NearestHalte;
