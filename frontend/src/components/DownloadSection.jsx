import React from 'react';
import { Smartphone, Download, MapPin, Clock, Bell } from 'lucide-react';
import { Button } from './ui/button';

const DownloadSection = () => {
  const handleDownload = (platform) => {
    window.open('https://play.google.com/store/apps/details?id=ngi.muchi.koetaradja&hl=id&pli=1', '_blank');
  };

  return (
    <section id="download" className="py-20 bg-gradient-to-br from-sky-600 via-sky-700 to-blue-700 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                  Download Aplikasi
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Pantau Bus Real-Time dengan Aplikasi
              </h2>

              <p className="text-xl text-sky-50 leading-relaxed">
                Dapatkan informasi jadwal bus, waktu kedatangan, dan tracking bus secara real-time langsung di smartphone Anda
              </p>

              {/* Features List */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-1">Live Tracking</h3>
                    <p className="text-sky-100">Lacak posisi bus secara real-time di peta</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-1">Jadwal Akurat</h3>
                    <p className="text-sky-100">Lihat jadwal lengkap dan estimasi waktu tiba</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-1">Notifikasi Pengingat</h3>
                    <p className="text-sky-100">Terima update penting tentang layanan</p>
                  </div>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  onClick={() => handleDownload('android')}
                  className="bg-white text-sky-700 hover:bg-gray-100 px-8 py-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592c.1099-.1902.0447-.4334-.1455-.5433-.1903-.1098-.4334-.0446-.5433.1456l-2.0223 3.5019C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4478c-.1099-.1902-.3531-.2554-.5433-.1456-.1902.1099-.2554.3531-.1455.5433l1.9973 3.4592C2.6197 11.1867.4433 14.6589 0 18.761h24c-.4433-4.1021-2.6197-7.5743-6.1185-9.4394zM24 24H0v-2h24v2z"/>
                  </svg>
                  <span>Google Play</span>
                </Button>

                <Button
                  onClick={() => handleDownload('ios')}
                  className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-sky-700 px-8 py-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>App Store</span>
                </Button>
              </div>

              <p className="text-sm text-sky-100 pt-2">
                * Gratis untuk Android dan iOS
              </p>
            </div>

            {/* Right - Phone Mockup tanpa logo besar */}
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                {/* Phone Frame */}
                <div className="relative mx-auto" style={{ width: '280px' }}>
                  <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                    <div className="bg-white rounded-[2.5rem] overflow-hidden">
                      {/* Phone Screen */}
                      <div className="relative h-[560px]">
                        {/* Status bar */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-sky-600 flex items-center justify-between px-6 text-white text-xs">
                          <span>9:41</span>
                          <span>100%</span>
                        </div>
                        {/* App Content */}
                        <div className="pt-8 px-4 bg-gradient-to-b from-sky-600 to-sky-500 h-full">
                          <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-sky-600" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">Trans Koetaradja</p>
                                <p className="text-xs text-gray-500">Tracking Real-time</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-2xl p-4 shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-bold text-gray-900">Koridor 1</span>
                              <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full">Aktif</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <Clock className="w-3 h-3" />
                                <span>5 menit lagi</span>
                              </div>
                              <div className="w-full bg-gray-200 h-2 rounded-full">
                                <div className="bg-sky-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
