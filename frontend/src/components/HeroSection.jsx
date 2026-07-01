import React from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from './ui/button';

const HeroSection = () => {
  const scrollToDownload = () => {
    const element = document.querySelector('#download');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-50" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left space-y-6">
            <div className="inline-block">
              <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                🎉 100% Gratis - Didukung Pemerintah Aceh
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Trans Koetaradja
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-700 font-medium">
              Transportasi Publik Modern Kota Banda Aceh
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Hadir sebagai solusi modern yang menjawab kebutuhan transportasi publik masyarakat Kota Banda Aceh dan sekitarnya. Melayani 14 rute dengan fasilitas lengkap dan nyaman.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={scrollToDownload}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Aplikasi
              </Button>
              <Button
                onClick={() => {
                  const element = document.querySelector('#routes');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                variant="outline"
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-6 rounded-xl font-bold text-lg transition-all duration-300"
              >
                Lihat Rute
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats Quick View */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center p-4 bg-white rounded-xl shadow-md">
                <div className="text-3xl font-bold text-emerald-600">14</div>
                <div className="text-sm text-gray-600 font-medium">Rute Aktif</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-md">
                <div className="text-3xl font-bold text-emerald-600">50+</div>
                <div className="text-sm text-gray-600 font-medium">Armada Bus</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-md">
                <div className="text-3xl font-bold text-emerald-600">100%</div>
                <div className="text-sm text-gray-600 font-medium">Gratis</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://transkutaraja.acehprov.go.id/etaUI/transK.png"
                alt="Bus Trans Koetaradja"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-200 rounded-full opacity-50 blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-green-200 rounded-full opacity-50 blur-2xl" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-emerald-600 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-emerald-600 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
