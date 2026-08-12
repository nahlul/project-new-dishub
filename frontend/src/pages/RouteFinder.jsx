import React, { useState } from 'react';
import { Route as RouteIcon, MapPin, Navigation, Compass } from 'lucide-react';
import RouteExplorer from '@/components/RouteExplorer';
import HalteDirectory from '@/components/HalteDirectory';
import NearestHalte from '@/components/NearestHalte';
import TripPlanner from '@/components/TripPlanner';

const TABS = [
  { key: 'rute', label: 'Rute', icon: RouteIcon },
  { key: 'halte', label: 'Halte', icon: MapPin },
  { key: 'terdekat', label: 'Halte Terdekat', icon: Navigation },
  { key: 'rencana', label: 'Rencanakan Perjalanan', icon: Compass },
];

const RouteFinder = () => {
  const [tab, setTab] = useState('rute');

  return (
    <section className="pt-24 pb-12 bg-gradient-to-b from-sky-50 to-white min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Rute & Jadwal Trans Koetaradja
          </h2>
          <div className="w-20 h-1 bg-sky-600 mx-auto mb-4" />
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Lihat rute lengkap, jadwal per halte, cari halte terdekat, dan
            rencanakan perjalanan Anda dengan bus Trans Koetaradja.
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                  tab === key
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden text-xs">{label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Panels */}
        {tab === 'rute' && <RouteExplorer />}
        {tab === 'halte' && <HalteDirectory />}
        {tab === 'terdekat' && <NearestHalte />}
        {tab === 'rencana' && <TripPlanner />}
      </div>
    </section>
  );
};

export default RouteFinder;
