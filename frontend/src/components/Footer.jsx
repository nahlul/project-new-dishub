import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <svg className="h-12 w-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M70 30 C75 25, 80 25, 85 30 L85 45 C85 50, 80 55, 75 55 L70 55 Z" fill="#F59E0B" />
                <path d="M40 35 C45 30, 50 30, 55 35 L55 50 C55 55, 50 60, 45 60 L40 60 Z" fill="#F59E0B" />
                <path d="M25 45 L75 45 L75 75 C75 80, 70 85, 65 85 L35 85 C30 85, 25 80, 25 75 Z" fill="#F59E0B" />
                <circle cx="35" cy="70" r="8" fill="#1E40AF" />
                <circle cx="65" cy="70" r="8" fill="#1E40AF" />
                <rect x="30" y="50" width="40" height="15" rx="2" fill="white" opacity="0.3" />
              </svg>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Transportasi publik modern yang melayani mobilitas masyarakat Kota Banda Aceh dan sekitarnya dengan gratis dan nyaman.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-sky-400">Menu Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tentang" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 text-sm">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/rute" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 text-sm">
                  Rute & Koridor
                </Link>
              </li>
              <li>
                <Link to="/fasilitas" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 text-sm">
                  Fasilitas
                </Link>
              </li>
              <li>
                <Link to="/berita" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 text-sm">
                  Berita
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-sky-400">Kontak Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Dinas Perhubungan Aceh<br />
                  Jl. T. Panglima Nyak Makam No.16, Banda Aceh
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+62 651 7551234</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">info@transkutaraja.acehprov.go.id</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-sky-400">Ikuti Kami</h3>
            <p className="text-gray-300 text-sm mb-4">
              Dapatkan update terbaru tentang layanan Trans Koetaradja
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Trans Koetaradja - Dinas Perhubungan Aceh. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Didukung oleh APBA Pemerintah Aceh
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;