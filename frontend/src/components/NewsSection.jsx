import React from 'react';
import { news } from '../mockData';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const NewsSection = () => {
  return (
    <section  className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Berita & Pengumuman
          </h2>
          <div className="w-24 h-1 bg-sky-600 mx-auto mb-6" />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Update terbaru seputar layanan Trans Koetaradja
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-105 border-2 hover:border-sky-500">
              <div className="relative overflow-hidden h-48">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-sky-600 text-white">
                    {item.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>
                <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-sky-600 transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-gray-600 line-clamp-3 leading-relaxed">
                  {item.excerpt}
                </CardDescription>
              </CardContent>
              
              <CardFooter>
                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 p-0 h-auto font-semibold inline-flex items-center transition-colors"
                >
                  Baca Selengkapnya
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Button - Link ke Instagram */}
        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/trans.koetaradja"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              variant="outline"
              className="border-2 border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white px-8 py-6 rounded-xl font-semibold text-lg transition-all duration-300"
            >
              Ketuk untuk Mendapatkan Berita Terbaru
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
          <p className="text-gray-500 text-sm mt-4">Follow @trans.koetaradja di Instagram</p>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
