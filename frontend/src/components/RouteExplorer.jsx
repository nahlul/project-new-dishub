import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Bus, ArrowRight, Calendar, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { routesAPI } from '@/lib/api';
import {
  timesForDay, nextBus, currentDayKey, DAY_LABELS, DAY_KEYS, minutesNow,
} from '@/lib/routeUtils';
import HalteMap from './HalteMap';

// Feature 1: browse all routes, open a route to see its ordered haltes,
// schedules and a map of the corridor.
const RouteExplorer = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState(currentDayKey());

  useEffect(() => {
    (async () => {
      try {
        const { data } = await routesAPI.getAll();
        setRoutes(data);
      } catch (err) {
        console.error('Failed to fetch routes:', err);
      }
    })();
  }, []);

  const handleSearch = async (value) => {
    setQuery(value);
    setSelectedRoute(null);
    if (value.length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await routesAPI.search(value);
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoute = async (routeId) => {
    setQuery('');
    setResults([]);
    try {
      const { data } = await routesAPI.getById(routeId);
      setSelectedRoute(data);
    } catch (err) {
      console.error('Failed to get route:', err);
    }
  };

  const routeMarkers = (selectedRoute?.halte || [])
    .filter((h) => h.lat != null)
    .map((h) => ({ lat: h.lat, lng: h.lng, label: h.nama, color: selectedRoute.warna }));

  return (
    <div>
      {/* Search Box */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          {!query && <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
          <Input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Ketik nama halte... (mis. Darussalam, Bandara, Ekonomi)"
            className={`${query ? 'pl-4' : 'pl-12'} py-5 text-base rounded-2xl border-2 border-gray-200 focus:border-sky-500 shadow-sm`}
          />
        </div>

        {query.length >= 1 && results.length === 0 && !loading && (
          <div className="mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-lg p-6 text-center">
            <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Halte tidak ditemukan</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-lg max-h-80 overflow-y-auto">
            {results.map((item, idx) => {
              const nb = nextBus(item.jadwal || {}, activeDay);
              return (
                <div
                  key={idx}
                  className="p-4 hover:bg-sky-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                  onClick={() => handleSelectRoute(item.route_id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-sky-600" />
                        <span className="font-semibold text-gray-900">{item.halte_nama}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Bus className="w-3 h-3" />
                        <span>Rute {item.route_nama}</span>
                      </div>
                    </div>
                    {nb && (
                      <div className="text-right">
                        <p className="text-sm font-bold text-sky-600">{nb.time}</p>
                        <p className="text-xs text-gray-500">{nb.diff} menit lagi</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {loading && <div className="mt-2 text-center text-gray-500 text-sm">Mencari...</div>}
      </div>

      {/* Day Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {DAY_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setActiveDay(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeDay === key ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {DAY_LABELS[key]}
          </button>
        ))}
      </div>

      {/* Selected Route Detail */}
      {selectedRoute && (
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedRoute(null)}
            className="text-sm text-sky-600 hover:text-sky-700 mb-3 inline-flex items-center gap-1"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Kembali ke semua rute
          </button>

          <Card className="mb-6 border-2" style={{ borderColor: selectedRoute.warna }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedRoute.warna }} />
                <h3 className="text-2xl font-bold text-gray-900">Rute {selectedRoute.nama}</h3>
              </div>
              <p className="text-gray-600 mb-2">{selectedRoute.deskripsi}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedRoute.jam_operasi}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {selectedRoute.hari}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <Badge variant="secondary">{selectedRoute.terminal_awal}</Badge>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <Badge variant="secondary">{selectedRoute.terminal_akhir}</Badge>
              </div>
            </CardContent>
          </Card>

          {routeMarkers.length > 0 && (
            <div className="mb-6">
              <HalteMap markers={routeMarkers} height={300} />
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-600" />
              Daftar Halte & Jadwal ({DAY_LABELS[activeDay]})
            </h4>
            {(selectedRoute.halte || []).map((halte, idx) => {
              const times = timesForDay(halte.jadwal || {}, activeDay);
              const nb = nextBus(halte.jadwal || {}, activeDay);
              const ref = minutesNow();
              return (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: selectedRoute.warna }}>
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-gray-900">{halte.nama}</span>
                      </div>
                      {halte.arah && <p className="text-xs text-gray-500 ml-8 mt-1">{halte.arah}</p>}
                    </div>
                    {nb && (
                      <div className="bg-sky-50 px-3 py-1 rounded-lg text-right">
                        <p className="text-sm font-bold text-sky-700">{nb.time}</p>
                        <p className="text-xs text-sky-600">{nb.diff} mnt lagi</p>
                      </div>
                    )}
                  </div>
                  {times.length > 0 ? (
                    <div className="ml-8 flex flex-wrap gap-1.5 mt-2">
                      {times.map((time, i) => {
                        const [h, m] = time.split(':').map(Number);
                        const busMin = h * 60 + m;
                        const isPast = busMin < ref;
                        const isNext = nb && nb.time === time;
                        return (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded text-xs font-mono ${
                              isNext ? 'bg-sky-600 text-white font-bold' :
                              isPast ? 'bg-gray-100 text-gray-400 line-through' :
                              'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {time}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="ml-8 text-xs text-gray-400 italic mt-1">Jadwal tidak tersedia untuk hari ini.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Route List */}
      {!selectedRoute && !query && (
        <div className="max-w-4xl mx-auto">
          {routes.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat rute...
            </div>
          ) : (
            <>
              <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Semua Rute Trans Koetaradja ({routes.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    onClick={() => handleSelectRoute(route.id)}
                    className="bg-white border-2 border-gray-100 hover:border-sky-400 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: route.warna }} />
                      <h5 className="font-bold text-gray-900 group-hover:text-sky-600 transition-colors">{route.nama}</h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{route.deskripsi}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {route.jam_operasi}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {route.hari}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RouteExplorer;
