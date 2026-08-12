import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Bus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { routesAPI } from '@/lib/api';
import { timesForDay, nextBus, currentDayKey, DAY_LABELS, DAY_KEYS } from '@/lib/routeUtils';

// Feature 2: directory of every halte with the routes and schedules serving it.
const HalteDirectory = () => {
  const [haltes, setHaltes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [day, setDay] = useState(currentDayKey());
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await routesAPI.getAllHaltes();
        setHaltes(data);
      } catch (err) {
        console.error('Failed to fetch haltes:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return haltes;
    const q = query.toLowerCase();
    return haltes.filter((h) => h.nama.toLowerCase().includes(q));
  }, [haltes, query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat data halte...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama halte..."
          className="pl-12 py-5 text-base rounded-2xl border-2 border-gray-200 focus:border-sky-500"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {DAY_KEYS.map((k) => (
          <button
            key={k}
            onClick={() => setDay(k)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              day === k ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {DAY_LABELS[k]}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-3">{filtered.length} halte</p>

      <div className="space-y-3">
        {filtered.map((h, idx) => {
          const isOpen = expanded === idx;
          return (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : idx)}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">{h.nama}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {h.routes.map((r, i) => (
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
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  {h.routes.map((r, i) => {
                    const times = timesForDay(r.jadwal || {}, day);
                    const nb = nextBus(r.jadwal || {}, day);
                    return (
                      <div key={i} className="mt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.route_warna }} />
                          <span className="text-sm font-medium text-gray-800">Rute {r.route_nama}</span>
                          {nb && <span className="text-xs text-sky-600">· bus berikutnya ±{nb.time}</span>}
                        </div>
                        {r.arah && <p className="text-xs text-gray-400 ml-4 mb-1">{r.arah}</p>}
                        {times.length > 0 ? (
                          <div className="ml-4 flex flex-wrap gap-1">
                            {times.map((t, ti) => (
                              <span key={ti} className="text-xs font-mono bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="ml-4 text-xs text-gray-400 italic">Jadwal tidak tersedia untuk hari ini.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HalteDirectory;
