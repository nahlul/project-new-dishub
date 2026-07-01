import React from 'react';
import { CheckCircle2, Award, Users, Shield } from 'lucide-react';

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
            <div className="w-24 h-1 bg-sky-600 mx-auto mb-6" />
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Sistem transportasi publik yang melayani masyarakat Banda Aceh dan Aceh Besar dengan komitmen kualitas dan kenyamanan terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image bus dari penanews */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://penanews.co.id/wp-content/uploads/2025/01/images-13-700x350.jpeg"
                  alt="Bus Trans Koetaradja"
                  className="w-full h-full object-cover"
                  style={{ minHeight: '400px' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-sky-600 text-white p-6 rounded-2xl shadow-xl">
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

              {/* Key Points dengan Icon yang berbeda */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start space-x-3 p-4 bg-sky-50 rounded-xl">
                  <Shield className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Gratis 100%</h4>
                    <p className="text-gray-600 text-sm">Didukung APBA Pemerintah Aceh</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-sky-50 rounded-xl">
                  <Award className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">14 Rute</h4>
                    <p className="text-gray-600 text-sm">Termasuk 3 rute baru 2025</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-sky-50 rounded-xl">
                  <Users className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Fasilitas Modern</h4>
                    <p className="text-gray-600 text-sm">AC, WiFi, & tracking real-time</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-sky-50 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Setiap Hari</h4>
                    <p className="text-gray-600 text-sm">Termasuk bulan Ramadan</p>
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
