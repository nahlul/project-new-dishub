import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section - tanpa logo bus */}
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white\">Trans Koetaradja</h3>
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
                <a 
                  href="https://wa.me/628116712349"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 text-sm hover:text-sky-400 transition-colors"
                >
                  +62 811 6712349
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <a 
                  href="mailto:info@transkutaraja.acehprov.go.id?subject=Pertanyaan tentang Trans Koetaradja&body=Halo Tim Trans Koetaradja,%0D%0A%0D%0A"
                  className="text-gray-300 text-sm hover:text-sky-400 transition-colors"
                >
                  info@transkutaraja.acehprov.go.id
                </a>
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
                href="https://www.facebook.com/transkoetaradja"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/trans.koetaradja"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/dishub_aceh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors duration-200"
                title="X (Twitter)"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
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