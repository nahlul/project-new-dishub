import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Link, useLocation } from 'react-router-dom';

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
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo dengan text Trans Koetaradja */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-3">
              {/* Icon Bus/Unta placeholder dengan style Trans Koetaradja */}
              <div className="relative">
                <svg className="h-14 w-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Unta stylized */}
                  <path d="M70 30 C75 25, 80 25, 85 30 L85 45 C85 50, 80 55, 75 55 L70 55 Z" fill="#F59E0B" />
                  <path d="M40 35 C45 30, 50 30, 55 35 L55 50 C55 55, 50 60, 45 60 L40 60 Z" fill="#F59E0B" />
                  <path d="M25 45 L75 45 L75 75 C75 80, 70 85, 65 85 L35 85 C30 85, 25 80, 25 75 Z" fill="#F59E0B" />
                  <circle cx="35" cy="70" r="8" fill="#1E40AF" />
                  <circle cx="65" cy="70" r="8" fill="#1E40AF" />
                  <rect x="30" y="50" width="40" height="15" rx="2" fill="white" opacity="0.3" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 leading-tight">Trans</span>
                <span className="text-xl font-bold text-sky-700 leading-tight">Koetaradja</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`px-4 py-2 font-medium transition-colors duration-200 rounded-lg ${
                  isActive(item.path)
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-gray-700 hover:text-sky-600 hover:bg-sky-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button Desktop */}
          <div className="hidden md:block">
            <Link to="/faq">
              <Button
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Download App
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-sky-600 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            {menuItems.map((item) => (
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
            ))}
            <div className="mt-4 px-4">
              <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md"
                >
                  Download App
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
