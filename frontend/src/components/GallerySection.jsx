import React, { useState } from 'react';
import { gallery } from '../mockData';
import { X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Dialog, DialogContent } from './ui/dialog';

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Galeri
          </h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto mb-6" />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Lihat armada dan layanan Trans Koetaradja dalam aksi
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Badge className="bg-emerald-600 text-white mb-2">
                    {item.category}
                  </Badge>
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            {selectedImage && (
              <div>
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-auto rounded-lg"
                />
                <div className="mt-4">
                  <Badge className="bg-emerald-600 text-white mb-2">
                    {selectedImage.category}
                  </Badge>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedImage.title}</h3>
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
