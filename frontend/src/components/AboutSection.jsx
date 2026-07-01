import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Tentang Trans Koetaradja
            </h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto mb-6" />
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Sistem transportasi publik yang melayani masyarakat Banda Aceh dan Aceh Besar dengan komitmen kualitas dan kenyamanan terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://dishub.acehprov.go.id/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-24-at-20.39.53.jpeg"
                  alt="Bus Trans Koetaradja"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-emerald-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-bold">2025</div>
                <div className="text-sm">Beroperasi Kembali</div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">
                Melayani dengan Sepenuh Hati
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                Trans Koetaradja adalah layanan transportasi publik yang dikelola oleh Dinas Perhubungan Provinsi Aceh. Kami hadir untuk memberikan solusi mobilitas yang nyaman, aman, dan terjangkau bagi seluruh masyarakat.
              </p>

              <p className="text-gray-600 leading-relaxed">
                Sejak beroperasi kembali di tahun 2025, Trans Koetaradja telah menambah 3 rute baru untuk menjangkau lebih banyak wilayah dan memudahkan akses masyarakat ke berbagai destinasi penting di Banda Aceh dan Aceh Besar.
              </p>

              {/* Key Points */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Gratis untuk Semua</h4>
                    <p className="text-gray-600 text-sm">Didukung penuh oleh APBA Pemerintah Aceh untuk meringankan beban transportasi masyarakat</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">14 Rute Strategis</h4>
                    <p className="text-gray-600 text-sm">Meliputi koridor utama, feeder, trans kampus, dan 3 rute baru di tahun 2025</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Fasilitas Modern</h4>
                    <p className="text-gray-600 text-sm">Bus ber-AC, WiFi gratis, dan tracking real-time melalui aplikasi mobile</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Operasional Reguler</h4>
                    <p className="text-gray-600 text-sm">Beroperasi setiap hari termasuk di bulan Ramadan untuk mendukung aktivitas masyarakat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
