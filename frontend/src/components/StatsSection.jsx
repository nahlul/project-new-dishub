import React from 'react';
import { stats } from '../mockData';

const StatsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-700 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Trans Koetaradja dalam Angka
          </h2>
          <p className="text-emerald-100 text-lg">
            Komitmen kami melayani masyarakat Aceh
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="text-5xl lg:text-6xl font-bold mb-3 text-white">
                {stat.value}
              </div>
              <div className="text-xl font-semibold mb-2 text-emerald-50">
                {stat.label}
              </div>
              <div className="text-sm text-emerald-100">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
