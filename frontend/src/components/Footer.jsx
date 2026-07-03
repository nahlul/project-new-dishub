import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { settingsAPI } from '@/lib/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [contact, setContact] = useState(null);
  const [social, setSocial] = useState(null);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const [contactRes, socialRes] = await Promise.all([
        settingsAPI.getContact(),
        settingsAPI.getSocialMedia(),
      ]);
      setContact(contactRes.data);
      setSocial(socialRes.data);
    } catch (error) {
      console.error('Failed to fetch footer data:', error);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white">Trans Koetaradja</h3>
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

          {/* Contact Info - Dynamic from API */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-sky-400">Kontak Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  {contact?.address || 'Dinas Perhubungan Aceh'}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <a 
                  href={`https://wa.me/${(contact?.phone || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 text-sm hover:text-sky-400 transition-colors"
                >
                  {contact?.phone || '+62 811 6712349'}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <a 
                  href={`mailto:${contact?.email || ''}`}
                  className="text-gray-300 text-sm hover:text-sky-400 transition-colors"
                >
                  {contact?.email || 'info@transkutaraja.acehprov.go.id'}
                </a>
              </li>
              {contact?.operational_hours && (
                <li className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-sky-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">
                    {contact.operational_hours}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Social Media - Dynamic from API */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-sky-400">Ikuti Kami</h3>
            <p className="text-gray-300 text-sm mb-4">
              Dapatkan update terbaru tentang layanan Trans Koetaradja
            </p>
            <div className="flex space-x-4">
              {(social?.facebook) && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {(social?.instagram) && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {(social?.twitter) && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors duration-200"
                  title="X (Twitter)"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {(social?.whatsapp) && (
                <a
                  href={social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-200"
                  title="WhatsApp"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Trans Koetaradja - Dinas Perhubungan Aceh. All rights reserved.
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
