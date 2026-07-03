import React, { useState, useEffect } from 'react';
import { galleryAPI } from '@/lib/api';
import { X, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Dialog, DialogContent } from './ui/dialog';

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data } = await galleryAPI.getAll();
      setGallery(data);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section  className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Galeri
          </h2>
          <div className="w-24 h-1 bg-sky-600 mx-auto mb-6" />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Lihat armada dan layanan Trans Koetaradja dalam aksi
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>Belum ada foto di galeri</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {gallery.map((item) => (
            <div
              key={item.id}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              onClick={() => setSelectedImage(item)}
            >
              <div className="aspect-square w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image_url}
                  alt={item.title || 'Gallery'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              {/* Caption outside image */}
              <div className="p-4 bg-white">
                {item.title && (
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                )}
                <p className="text-xs text-sky-600 mt-1">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
                </p>
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-sky-100 text-sky-700 rounded">
                  {item.category}
                </span>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* Image Modal */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            {selectedImage && (
              <div>
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title || 'Gallery'}
                  className="w-full h-auto rounded-lg"
                />
                <div className="mt-4">
                  <Badge className="bg-sky-600 text-white mb-2">
                    {selectedImage.category}
                  </Badge>
                  {selectedImage.title && (
                    <h3 className="text-2xl font-bold text-gray-900">{selectedImage.title}</h3>
                  )}
                  <p className="text-sm text-sky-600 mt-1">
                    {selectedImage.created_at ? new Date(selectedImage.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GallerySection;
