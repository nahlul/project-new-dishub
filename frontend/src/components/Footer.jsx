import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="https://customer-assets.emergentagent.com/job_kutaradja-app-center/artifacts/oicumat1_unnamed.png"
                alt="Trans Koetaradja"
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Transportasi publik modern yang melayani mobilitas masyarakat Kota Banda Aceh dan sekitarnya dengan gratis dan nyaman.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-emerald-400">Menu Cepat</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 text-sm">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#routes" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 text-sm">
                  Rute & Koridor
                </a>
              </li>
              <li>
                <a href="#facilities" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 text-sm">
                  Fasilitas
                </a>
              </li>
              <li>
                <a href="#news" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 text-sm">
                  Berita
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-emerald-400">Kontak Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Dinas Perhubungan Aceh<br />
                  Jl. T. Panglima Nyak Makam No.16, Banda Aceh
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+62 651 7551234</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">info@transkutaraja.acehprov.go.id</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-emerald-400">Ikuti Kami</h3>
            <p className="text-gray-300 text-sm mb-4">
              Dapatkan update terbaru tentang layanan Trans Koetaradja
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors duration-200"
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
