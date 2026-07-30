import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Bus, ArrowRight, Calendar, Navigation, Route } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api';

const RouteFinder = () => {
  const [activeTab, setActiveTab] = useState('jadwal');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [allRouteDetails, setAllRouteDetails] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState('senin_kamis');

  // Trip planner state
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromResults, setFromResults] = useState([]);
  const [toResults, setToResults] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [tripResults, setTripResults] = useState([]);

  useEffect(() => {
    fetchRoutes();
    fetchAllRouteDetails();
    // Set active day based on current day
    const day = new Date().getDay();
    if (day === 5) setActiveDay('jumat');
    else if (day === 6) setActiveDay('sabtu');
    else if (day === 0) setActiveDay('minggu');
    else setActiveDay('senin_kamis');
  }, []);

  const fetchRoutes = async () => {
    try {
      const { data } = await api.get('/routes/', { withCredentials: false });
      setRoutes(data);
    } catch (err) {
      console.error('Failed to fetch routes:', err);
    }
  };

  // Fetch all route details for trip planning
  const fetchAllRouteDetails = async () => {
    try {
      const { data: routeList } = await api.get('/routes/', { withCredentials: false });
      const details = [];
      for (const r of routeList) {
        try {
          const { data } = await api.get(`/routes/${r.id}`, { withCredentials: false });
          details.push(data);
        } catch (e) {}
      }
      setAllRouteDetails(details);
    } catch (err) {
      console.error('Failed to fetch route details:', err);
    }
  };

  // Search for trip planner
  const handleFromSearch = async (value) => {
    setFromQuery(value);
    setSelectedFrom(null);
    setTripResults([]);
    if (value.length < 1) { setFromResults([]); return; }
    try {
      const { data } = await api.get(`/routes/search?q=${encodeURIComponent(value)}`, { withCredentials: false });
      setFromResults(data);
    } catch (err) {}
  };

  const handleToSearch = async (value) => {
    setToQuery(value);
    setSelectedTo(null);
    setTripResults([]);
    if (value.length < 1) { setToResults([]); return; }
    try {
      const { data } = await api.get(`/routes/search?q=${encodeURIComponent(value)}`, { withCredentials: false });
      setToResults(data);
    } catch (err) {}
  };

  const selectFrom = (item) => {
    setSelectedFrom(item);
    setFromQuery(item.halte_nama);
    setFromResults([]);
    if (selectedTo) findTrip(item, selectedTo);
  };

  const selectTo = (item) => {
    setSelectedTo(item);
    setToQuery(item.halte_nama);
    setToResults([]);
    if (selectedFrom) findTrip(selectedFrom, item);
  };

  // Find routes connecting from and to
  const findTrip = (from, to) => {
    const matching = [];
    for (const route of allRouteDetails) {
      const halteNames = (route.halte || []).map(h => h.nama.toLowerCase());
      const fromIdx = halteNames.findIndex(n => n.includes(from.halte_nama.toLowerCase()));
      const toIdx = halteNames.findIndex(n => n.includes(to.halte_nama.toLowerCase()));
      if (fromIdx !== -1 && toIdx !== -1) {
        const fromHalte = route.halte[fromIdx];
        const nextBus = getNextBus(fromHalte.jadwal || {});
        matching.push({
          route_nama: route.nama,
          route_warna: route.warna,
          route_id: route.id,
          from_halte: fromHalte.nama,
          to_halte: route.halte[toIdx].nama,
          jadwal: fromHalte.jadwal,
          nextBus,
          jumlah_halte: Math.abs(toIdx - fromIdx),
        });
      }
    }
    setTripResults(matching);
  };

  const handleSearch = async (value) => {
    setQuery(value);
    setSelectedRoute(null);
    if (value.length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/routes/search?q=${encodeURIComponent(value)}`, { withCredentials: false });
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
      const { data } = await api.get(`/routes/${routeId}`, { withCredentials: false });
      setSelectedRoute(data);
    } catch (err) {
      console.error('Failed to get route:', err);
    }
  };

  // Get next bus time
  const getNextBus = (jadwal) => {
    const times = jadwal[activeDay] || [];
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    for (const time of times) {
      const [h, m] = time.split(':').map(Number);
      const busMinutes = h * 60 + m;
      if (busMinutes > currentMinutes) {
        const diff = busMinutes - currentMinutes;
        return { time, diff };
      }
    }
    return null;
  };

  const dayLabels = {
    senin_kamis: 'Senin - Kamis',
    jumat: "Jum'at",
    sabtu: 'Sabtu',
    minggu: 'Minggu',
    sabtu_minggu: 'Sabtu - Minggu',
  };

  return (
    <section className="pt-24 pb-12 bg-gradient-to-b from-sky-50 to-white min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Cari Rute & Jadwal
          </h2>
          <div className="w-20 h-1 bg-sky-600 mx-auto mb-4" />
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Cari halte terdekat dan lihat jadwal bus Trans Koetaradja
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="max-w-md mx-auto mb-8 flex bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          <button
            onClick={() => { setActiveTab('jadwal'); setSelectedRoute(null); }}
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'jadwal' ? 'bg-sky-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-4 h-4" /> Cari Jadwal
          </button>
          <button
            onClick={() => { setActiveTab('trip'); setSelectedRoute(null); setQuery(''); setResults([]); }}
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'trip' ? 'bg-sky-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Navigation className="w-4 h-4" /> Rencanakan Perjalanan
          </button>
        </div>

        {/* === TAB 1: Cari Jadwal === */}
        {activeTab === 'jadwal' && (<>
        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            {!query && (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            )}
            <Input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Ketik nama halte... (misal: Darussalam, Bandara, Ekonomi)"
              className={`${query ? 'pl-4' : 'pl-12'} py-5 text-base rounded-2xl border-2 border-gray-200 focus:border-sky-500 shadow-sm`}
            />
          </div>

          {/* Search Results Dropdown */}
          {query.length >= 1 && results.length === 0 && !loading && (
            <div className="mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-lg p-6 text-center">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Rute tidak ditemukan</p>
              <p className="text-gray-400 text-xs mt-1">Coba ketik nama halte yang lain</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-lg max-h-80 overflow-y-auto">
              {results.map((item, idx) => {
                const nextBus = getNextBus(item.jadwal);
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
                          {item.halte_arah && (
                            <>
                              <ArrowRight className="w-3 h-3" />
                              <span className="text-xs">{item.halte_arah.substring(0, 40)}...</span>
                            </>
                          )}
                        </div>
                      </div>
                      {nextBus && (
                        <div className="text-right">
                          <p className="text-sm font-bold text-sky-600">{nextBus.time}</p>
                          <p className="text-xs text-gray-500">{nextBus.diff} menit lagi</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {loading && (
            <div className="mt-2 text-center text-gray-500 text-sm">Mencari...</div>
          )}
        </div>

        {/* Day Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.entries(dayLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveDay(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeDay === key
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Selected Route Detail */}
        {selectedRoute && (
          <div className="max-w-4xl mx-auto">
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
                <div className="mt-3 flex gap-2">
                  <Badge variant="secondary">{selectedRoute.terminal_awal}</Badge>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5" />
                  <Badge variant="secondary">{selectedRoute.terminal_akhir}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Halte List with Schedules */}
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600" />
                Daftar Halte & Jadwal ({dayLabels[activeDay]})
              </h4>
              {(selectedRoute.halte || []).map((halte, idx) => {
                const times = halte.jadwal?.[activeDay] || halte.jadwal?.sabtu_minggu || [];
                const nextBus = getNextBus(halte.jadwal || {});
                return (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: selectedRoute.warna }} />
                          <span className="font-semibold text-gray-900">{halte.nama}</span>
                        </div>
                        {halte.arah && (
                          <p className="text-xs text-gray-500 ml-5 mt-1">{halte.arah}</p>
                        )}
                      </div>
                      {nextBus && (
                        <div className="bg-sky-50 px-3 py-1 rounded-lg text-right">
                          <p className="text-sm font-bold text-sky-700">{nextBus.time}</p>
                          <p className="text-xs text-sky-600">{nextBus.diff} mnt lagi</p>
                        </div>
                      )}
                    </div>
                    {times.length > 0 && (
                      <div className="ml-5 flex flex-wrap gap-1.5 mt-2">
                        {times.map((time, i) => {
                          const [h, m] = time.split(':').map(Number);
                          const now = new Date();
                          const currentMin = now.getHours() * 60 + now.getMinutes();
                          const busMin = h * 60 + m;
                          const isPast = busMin < currentMin;
                          const isNext = nextBus && nextBus.time === time;
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
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Route List (when no search/selection) */}
        {!selectedRoute && !query && (
          <div className="max-w-4xl mx-auto mt-12">
            <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">Semua Rute Trans Koetaradja</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => handleSelectRoute(route.id)}
                  className="bg-white border-2 border-gray-100 hover:border-sky-400 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: route.warna }} />
                    <h5 className="font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                      {route.nama}
                    </h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{route.deskripsi}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {route.jam_operasi}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {route.hari}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RouteFinder;
