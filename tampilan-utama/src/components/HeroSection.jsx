import React from 'react';
import { ArrowRight, Download, Bus, Clock, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 lg:pt-20">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-blue-50" />
        {/* Logo Dishub Watermark - subtle */}
        <div className="absolute top-32 right-10 opacity-5 hidden lg:block">
          <div className="text-gray-400 text-9xl font-bold">DISHUB</div>
        </div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-left space-y-4 lg:space-y-6">
            <div className="inline-block">
              <span className="bg-sky-100 text-sky-700 px-3 py-2 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-semibold block">
                ✨ 100% Gratis - Didukung Pemerintah Aceh
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              Trans Koetaradja
            </h1>
            
            <p className="text-lg lg:text-xl xl:text-2xl text-gray-700 font-medium">
              Transportasi Publik Modern Kota Banda Aceh
            </p>
            
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              Hadir sebagai solusi modern yang menjawab kebutuhan transportasi publik masyarakat Kota Banda Aceh dan sekitarnya. Melayani 14 rute dengan fasilitas lengkap dan nyaman.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-2 lg:pt-4">
              <Link to="/download" className="w-full sm:w-auto">
                <Button
                  className="bg-sky-600 hover:bg-sky-700 text-white px-6 lg:px-8 py-5 lg:py-6 rounded-xl font-bold text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full"
                >
                  <Download className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                  Download Aplikasi
                </Button>
              </Link>
              <Link to="/rute" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="border-2 border-sky-600 text-sky-600 hover:bg-sky-50 px-6 lg:px-8 py-5 lg:py-6 rounded-xl font-bold text-base lg:text-lg transition-all duration-300 w-full"
                >
                  Lihat Rute
                  <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
                </Button>
              </Link>
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-3 gap-3 lg:gap-4 pt-4 lg:pt-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bus className="w-4 h-4 lg:w-5 lg:h-5 text-sky-600" />
                </div>
                <div>
                  <div className="text-xs lg:text-sm font-bold text-gray-900">50+ Bus</div>
                  <div className="text-xs text-gray-500 hidden sm:block">Armada Modern</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-sky-600" />
                </div>
                <div>
                  <div className="text-xs lg:text-sm font-bold text-gray-900">14 Rute</div>
                  <div className="text-xs text-gray-500 hidden sm:block">Jangkauan Luas</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-sky-600" />
                </div>
                <div>
                  <div className="text-xs lg:text-sm font-bold text-gray-900">12 Jam</div>
                  <div className="text-xs text-gray-500 hidden sm:block">Setiap Hari</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Bus Tanpa Logo Besar */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://dishub.acehprov.go.id/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-24-at-20.39.53.jpeg"
                alt="Bus Trans Koetaradja"
                className="w-full h-auto"
              />
              {/* Badge overlay */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                    <Bus className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-500">Gratis untuk</div>
                    <div className="text-xl font-bold text-sky-600">Semua Warga</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-sky-200 rounded-full opacity-50 blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-blue-200 rounded-full opacity-50 blur-2xl" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-sky-600 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-sky-600 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;