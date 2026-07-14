import React, { useState, useEffect } from 'react';
import { CheckCircle2, Award, Users, Shield, Calendar, TrendingUp } from 'lucide-react';
import { settingsAPI } from '@/lib/api';

const AboutSection = () => {
  const [aboutContent, setAboutContent] = useState('');

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const { data } = await settingsAPI.getAbout();
      setAboutContent(data.content || '');
    } catch (error) {
      console.error('Failed to fetch about:', error);
    }
  };

  return (
    <section className="py-20 bg-white">
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

          {/* Dynamic Content from Admin "Edit Sejarah" */}
          {aboutContent && (
            <div className="mb-16 max-w-4xl mx-auto bg-gradient-to-br from-sky-50 to-blue-50 p-8 rounded-2xl border border-sky-100">
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {aboutContent.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left - Image dari penanews */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://penanews.co.id/wp-content/uploads/2025/01/images-13-700x350.jpeg"
                  alt="Bus Trans Koetaradja"
                  className="w-full h-auto object-cover"
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

          {/* Sejarah Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Sejarah Kebangkitan Trans Koetaradja
              </h3>
              <div className="w-20 h-1 bg-sky-600 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Perjalanan panjang dari tahun 2016 hingga menjadi transportasi publik andalan masyarakat Aceh
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-sky-200"></div>

              {/* Timeline items */}
              <div className="space-y-12">
                {/* 2016 */}
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="lg:text-right">
                    <div className="inline-block bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center lg:justify-end space-x-3 mb-3">
                        <Calendar className="w-6 h-6 text-sky-600" />
                        <h4 className="text-2xl font-bold text-sky-600">2016</h4>
                      </div>
                      <h5 className="font-bold text-lg text-gray-900 mb-2">Awal Mula Operasional</h5>
                      <p className="text-gray-600">
                        Trans Koetaradja resmi diluncurkan pada <strong>4 Mei 2016</strong> oleh Gubernur Aceh dr. H. Zaini Abdullah. Dimulai dengan 1 koridor utama (Masjid Raya Baiturrahman - Darussalam) dan 25 unit bus hibah dari Kementerian Perhubungan. Layanan 100% gratis ditanggung APBA.
                      </p>
                    </div>
                  </div>
                  <div className="hidden lg:block"></div>
                </div>

                {/* 2017 */}
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="hidden lg:block"></div>
                  <div>
                    <div className="inline-block bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-3">
                        <TrendingUp className="w-6 h-6 text-sky-600" />
                        <h4 className="text-2xl font-bold text-sky-600">2017</h4>
                      </div>
                      <h5 className="font-bold text-lg text-gray-900 mb-2">Ekspansi Rute Pertama</h5>
                      <p className="text-gray-600">
                        Koridor bertambah menjadi <strong>3 rute</strong> dengan armada 30 bus. Jumlah penumpang melonjak mencapai <strong>lebih dari 1,25 juta orang</strong> dalam setahun. Masyarakat mulai menjadikan Trans Koetaradja sebagai pilihan utama transportasi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2018 */}
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="lg:text-right">
                    <div className="inline-block bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center lg:justify-end space-x-3 mb-3">
                        <Award className="w-6 h-6 text-sky-600" />
                        <h4 className="text-2xl font-bold text-sky-600">2018</h4>
                      </div>
                      <h5 className="font-bold text-lg text-gray-900 mb-2">Pembentukan Pengelola Resmi</h5>
                      <p className="text-gray-600">
                        Pemerintah Aceh membentuk <strong>UPTD Angkutan Massal Perkotaan Trans Kutaraja</strong>. Koridor bertambah menjadi <strong>5 rute</strong> dengan 40 bus. Jumlah penumpang meningkat drastis menjadi <strong>lebih dari 4 juta orang</strong>. Pembangunan 6 halte dari dana CSR perbankan.
                      </p>
                    </div>
                  </div>
                  <div className="hidden lg:block"></div>
                </div>

                {/* 2019 */}
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="hidden lg:block"></div>
                  <div>
                    <div className="inline-block bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-3">
                        <CheckCircle2 className="w-6 h-6 text-sky-600" />
                        <h4 className="text-2xl font-bold text-sky-600">2019</h4>
                      </div>
                      <h5 className="font-bold text-lg text-gray-900 mb-2">Konektivitas Bandara</h5>
                      <p className="text-gray-600">
                        Trans Koetaradja beroperasi masuk ke dalam <strong>Bandara Sultan Iskandar Muda (SIM)</strong> berkat kerjasama dengan PT. Angkasa Pura II. Menjadi moda penghubung antar-moda (bandara-pelabuhan-terminal) dengan <strong>4,25 juta penumpang</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2025 */}
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="lg:text-right">
                    <div className="inline-block bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-300 p-6 rounded-2xl shadow-xl">
                      <div className="flex items-center lg:justify-end space-x-3 mb-3">
                        <Calendar className="w-6 h-6 text-sky-600" />
                        <h4 className="text-2xl font-bold text-sky-600">2025</h4>
                      </div>
                      <h5 className="font-bold text-lg text-gray-900 mb-2">Beroperasi Kembali dengan 14 Rute</h5>
                      <p className="text-gray-600">
                        Setelah penghentian sementara awal tahun, Trans Koetaradja kembali beroperasi dengan <strong>14 rute</strong> (termasuk 3 rute baru) dan <strong>59 unit bus</strong>. Kini menjadi tulang punggung mobilitas masyarakat Banda Aceh dan Aceh Besar.
                      </p>
                    </div>
                  </div>
                  <div className="hidden lg:block"></div>
                </div>
              </div>
            </div>

            {/* Achievement Box */}
            <div className="mt-12 bg-gradient-to-r from-sky-600 to-blue-600 text-white p-8 rounded-2xl shadow-xl">
              <h4 className="text-2xl font-bold mb-4 text-center">Pencapaian Trans Koetaradja</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">9+ Tahun</div>
                  <div className="text-sky-100">Mengabdi untuk Masyarakat</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">10 Juta+</div>
                  <div className="text-sky-100">Total Penumpang Dilayani</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-sky-100">Gratis & Berkelanjutan</div>
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