import React from 'react';
import { Download, Smartphone, CheckCircle2, QrCode } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

const DownloadPage = () => {
  const handleDownload = (platform) => {
    if (platform === 'ios') {
      window.open('https://apps.apple.com/id/iphone/search?l=id&term=Trans%20Koetaradja', '_blank');
    } else {
      window.open('https://play.google.com/store/apps/details?id=ngi.muchi.koetaradja&hl=id&pli=1', '_blank');
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 bg-sky-100 rounded-full mb-6"
            >
              <Smartphone className="w-10 h-10 text-sky-600" />
            </motion.div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Download Aplikasi Trans Koetaradja</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pantau jadwal bus, tracking real-time, dan nikmati kemudahan perjalanan Anda dengan aplikasi mobile kami
            </p>
          </div>

          {/* Download Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Android */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-sky-500 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592c.1099-.1902.0447-.4334-.1455-.5433-.1903-.1098-.4334-.0446-.5433.1456l-2.0223 3.5019C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4478c-.1099-.1902-.3531-.2554-.5433-.1456-.1902.1099-.2554.3531-.1455.5433l1.9973 3.4592C2.6197 11.1867.4433 14.6589 0 18.761h24c-.4433-4.1021-2.6197-7.5743-6.1185-9.4394zM24 24H0v-2h24v2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Android</h3>
                  <p className="text-gray-600">Download dari Google Play</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Gratis & Mudah Digunakan</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Live Tracking Bus</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Notifikasi Real-time</span>
                </li>
              </ul>
              <Button
                onClick={() => handleDownload('android')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="mr-2" />
                Download untuk Android
              </Button>
            </motion.div>

            {/* iOS */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-sky-500 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">iOS</h3>
                  <p className="text-gray-600">Download dari App Store</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Interface Modern</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Sinkronisasi iCloud</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Push Notifications</span>
                </li>
              </ul>
              <Button
                onClick={() => handleDownload('ios')}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="mr-2" />
                Download untuk iOS
              </Button>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-sky-600 to-blue-600 rounded-2xl p-12 text-white shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Fitur Unggulan Aplikasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Tracking Real-Time</h3>
                <p className="text-sky-100">Pantau posisi bus secara langsung di peta interaktif</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Jadwal Lengkap</h3>
                <p className="text-sky-100">Lihat jadwal dan estimasi waktu kedatangan bus</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Notifikasi Pintar</h3>
                <p className="text-sky-100">Terima pemberitahuan penting tentang layanan</p>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <p className="text-gray-600 text-lg">
              Sudah diunduh oleh <span className="font-bold text-sky-600">50,000+</span> pengguna di Aceh
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DownloadPage;