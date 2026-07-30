import React, { useState, useEffect } from 'react';
import { MapPin, Bus, Clock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api';

const TripPlanner = ({ activeDay, dayLabels }) => {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromResults, setFromResults] = useState([]);
  const [toResults, setToResults] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [tripResults, setTripResults] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);

  useEffect(() => {
    fetchAllRoutes();
  }, []);

  const fetchAllRoutes = async () => {
    try {
      const { data: list } = await api.get('/routes/', { withCredentials: false });
      const details = [];
      for (const r of list) {
        try {
          const { data } = await api.get(`/routes/${r.id}`, { withCredentials: false });
          details.push(data);
        } catch (e) {}
      }
      setAllRoutes(details);
    } catch (err) {}
  };

  const searchHalte = async (value, setResults) => {
    if (value.length < 1) { setResults([]); return; }
    try {
      const { data } = await api.get(`/routes/search?q=${encodeURIComponent(value)}`, { withCredentials: false });
      setResults(data);
    } catch (err) {}
  };

  const getNextBus = (jadwal) => {
    const times = jadwal?.[activeDay] || jadwal?.sabtu_minggu || [];
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    for (const t of times) {
      const [h, m] = t.split(':').map(Number);
      if (h * 60 + m > cur) return { time: t, diff: h * 60 + m - cur };
    }
    return null;
  };

  const findTrip = (from, to) => {
    const results = [];
    for (const route of allRoutes) {
      const names = (route.halte || []).map(h => h.nama.toLowerCase());
      const fi = names.findIndex(n => n.includes(from.halte_nama.toLowerCase()));
      const ti = names.findIndex(n => n.includes(to.halte_nama.toLowerCase()));
      if (fi !== -1 && ti !== -1) {
        const h = route.halte[fi];
        const start = Math.min(fi, ti);
        const end = Math.max(fi, ti);
        const stopsInBetween = route.halte.slice(start, end + 1).map(s => s.nama);
        results.push({
          route_nama: route.nama,
          route_warna: route.warna,
          from_halte: h.nama,
          to_halte: route.halte[ti].nama,
          jadwal: h.jadwal,
          nextBus: getNextBus(h.jadwal),
          jumlah_halte: Math.abs(ti - fi),
          halte_dilewati: stopsInBetween,
        });
      }
    }
    setTripResults(results);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          Posisi halte kamu sekarang
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
          <Input value={fromQuery} onChange={(e) => { setFromQuery(e.target.value); searchHalte(e.target.value, setFromResults); setSelectedFrom(null); setTripResults([]); }} placeholder="Ketik nama halte asal..." className="pl-10 py-4 rounded-xl border-2 focus:border-green-500" />
        </div>
        {fromResults.length > 0 && (
          <div className="mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {fromResults.map((item, i) => (
              <div key={i} onClick={() => { setSelectedFrom(item); setFromQuery(item.halte_nama); setFromResults([]); if (selectedTo) findTrip(item, selectedTo); }} className="p-3 hover:bg-green-50 cursor-pointer border-b last:border-0">
                <span className="font-medium text-sm">{item.halte_nama}</span>
                <span className="text-xs text-gray-500 ml-2">({item.route_nama})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          Tujuan yang ingin dituju
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
          <Input value={toQuery} onChange={(e) => { setToQuery(e.target.value); searchHalte(e.target.value, setToResults); setSelectedTo(null); setTripResults([]); }} placeholder="Ketik nama halte tujuan..." className="pl-10 py-4 rounded-xl border-2 focus:border-red-500" />
        </div>
        {toResults.length > 0 && (
          <div className="mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {toResults.map((item, i) => (
              <div key={i} onClick={() => { setSelectedTo(item); setToQuery(item.halte_nama); setToResults([]); if (selectedFrom) findTrip(selectedFrom, item); }} className="p-3 hover:bg-red-50 cursor-pointer border-b last:border-0">
                <span className="font-medium text-sm">{item.halte_nama}</span>
                <span className="text-xs text-gray-500 ml-2">({item.route_nama})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedFrom && selectedTo && tripResults.length === 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
          <Bus className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <p className="text-orange-700 font-medium">Tidak ada rute langsung</p>
          <p className="text-orange-600 text-sm mt-1">Halte asal dan tujuan tidak berada di rute yang sama</p>
        </div>
      )}

      {tripResults.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 flex items-center gap-2">
            <Bus className="w-5 h-5 text-sky-600" />
            Rute tersedia ({dayLabels[activeDay] || activeDay})
          </h4>
          {tripResults.map((trip, idx) => {
            const times = trip.jadwal?.[activeDay] || trip.jadwal?.sabtu_minggu || [];
            return (
              <Card key={idx} className="border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: trip.route_warna }}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-sky-600" />
                        <span className="font-bold text-gray-900">Rute {trip.route_nama}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{trip.from_halte} → {trip.to_halte}</p>
                      <p className="text-xs text-gray-500 mt-1">{trip.jumlah_halte} halte perjalanan</p>
                    </div>
                    {trip.nextBus && (
                      <div className="bg-sky-50 px-4 py-2 rounded-lg text-center">
                        <p className="text-lg font-bold text-sky-700">{trip.nextBus.time}</p>
                        <p className="text-xs text-sky-600">{trip.nextBus.diff} mnt lagi</p>
                      </div>
                    )}
                  </div>
                  {/* Halte yang dilewati */}
                  {trip.halte_dilewati && trip.halte_dilewati.length > 0 && (
                    <div className="mb-3 bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-600 mb-2">Rute perjalanan:</p>
                      <div className="flex flex-col gap-1">
                        {trip.halte_dilewati.map((stop, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-green-500' : i === trip.halte_dilewati.length - 1 ? 'bg-red-500' : 'bg-sky-400'}`} />
                            {i < trip.halte_dilewati.length - 1 && (
                              <div className="absolute ml-[4px] mt-4 w-0.5 h-3 bg-gray-300" />
                            )}
                            <span className={`text-xs ${i === 0 || i === trip.halte_dilewati.length - 1 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{stop}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {times.map((time, i) => {
                      const [h, m] = time.split(':').map(Number);
                      const now = new Date();
                      const cur = now.getHours() * 60 + now.getMinutes();
                      const bus = h * 60 + m;
                      const isPast = bus < cur;
                      const isNext = trip.nextBus && trip.nextBus.time === time;
                      return <span key={i} className={`px-2 py-0.5 rounded text-xs font-mono ${isNext ? 'bg-sky-600 text-white font-bold' : isPast ? 'bg-gray-100 text-gray-400 line-through' : 'bg-gray-50 text-gray-700'}`}>{time}</span>;
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
