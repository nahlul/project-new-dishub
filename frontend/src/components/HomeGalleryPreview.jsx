import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { galleryAPI } from '@/lib/api';
import { ArrowRight, Images } from 'lucide-react';

const HomeGalleryPreview = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data } = await galleryAPI.getAll();
      setGallery(data.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || gallery.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Galeri Foto
            </h2>
            <p className="text-gray-600">Dokumentasi armada dan layanan Trans Koetaradja</p>
          </div>
          <Link
            to="/galeri"
            className="mt-4 sm:mt-0 inline-flex items-center text-sky-600 hover:text-sky-700 font-semibold group"
          >
            Lihat Semua Foto
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gallery Grid - masonry style */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {gallery.map((item, index) => (
            <Link
              key={item.id}
              to="/galeri"
              className={`block relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
                index === 0 ? 'row-span-2 h-full min-h-[280px] md:min-h-[400px]' : 'h-[180px] md:h-[192px]'
              }`}
            >
              <img
                src={item.image_url}
                alt={item.title || 'Gallery'}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs font-medium truncate">{item.title}</p>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeGalleryPreview;
