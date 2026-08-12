import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Beranda', path: '/' },
    { label: 'Tentang', path: '/tentang' },
    { label: 'Rute', path: '/rute' },
    { label: 'Fasilitas', path: '/fasilitas' },
    { label: 'Galeri', path: '/galeri' },
    { label: 'Berita', path: '/berita' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Hubungi', path: 'https://wa.me/628116712349', external: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white/95 backdrop-blur-md py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo - Motif Batik Biru yang Baru */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <img
                src="https://customer-assets.emergentagent.com/job_kutaradja-app-center/artifacts/6z3d8lef_Cuplikan_layar_2026-07-01_152844-removebg-preview.png"
                alt="Trans Koetaradja Logo"
                className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 leading-tight">Trans</span>
              <span className="text-xl font-bold text-sky-700 leading-tight">Koetaradja</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              item.external ? (
                <a
                  key={item.label}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 font-medium transition-all duration-200 rounded-lg text-gray-700 hover:text-sky-600 hover:bg-sky-50"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`px-4 py-2 font-medium transition-all duration-200 rounded-lg relative group ${
                    isActive(item.path)
                      ? 'text-sky-600 bg-sky-50'
                      : 'text-gray-700 hover:text-sky-600 hover:bg-sky-50'
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            ))}
          </nav>

          {/* CTA Button Desktop */}
          <div className="hidden lg:block">
            <Link to="/download">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-xl">
                  Download App
                </Button>
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-sky-600 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="mt-4 pb-4 border-t border-gray-200 pt-4 space-y-2">
                {menuItems.map((item) => (
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 font-medium transition-colors duration-200 rounded-lg text-gray-700 hover:text-sky-600 hover:bg-sky-50"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 font-medium transition-colors duration-200 rounded-lg ${
                        isActive(item.path)
                          ? 'text-sky-600 bg-sky-50'
                          : 'text-gray-700 hover:text-sky-600 hover:bg-sky-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                ))}
                <div className="px-4 pt-2">
                  <Link to="/download" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-3 rounded-lg font-semibold">
                      Download App
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
