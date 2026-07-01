import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Bus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl"
        >
          {/* Animated Bus Icon */}
          <motion.div
            animate={{
              x: [0, 20, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <Bus className="w-32 h-32 text-sky-600" strokeWidth={1.5} />
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-sky-600/20 rounded-full blur-md"
              />
            </div>
          </motion.div>

          {/* 404 Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-8xl sm:text-9xl font-bold text-sky-600 mb-4"
          >
            404
          </motion.h1>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Link to="/">
                <Home className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-sky-600 text-sky-600 hover:bg-sky-50 px-8 py-6 text-lg"
            >
              <Link to="/berita">
                <Search className="w-5 h-5 mr-2" />
                Lihat Berita
              </Link>
            </Button>
          </motion.div>

          {/* Popular Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-600 mb-4">Atau coba link ini:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { label: 'Berita', path: '/berita' },
                { label: 'Rute', path: '/rute' },
                { label: 'Galeri', path: '/galeri' },
                { label: 'FAQ', path: '/faq' },
                { label: 'Hubungi', path: '/hubungi' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sky-600 hover:text-sky-700 font-medium hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
