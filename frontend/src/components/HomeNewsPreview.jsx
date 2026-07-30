import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsAPI } from '@/lib/api';
import { Calendar, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';

const HomeNewsPreview = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data } = await newsAPI.getAll();
      setNews(data.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || news.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Berita Terbaru
            </h2>
            <p className="text-gray-600">Informasi terkini seputar Trans Koetaradja</p>
          </div>
          <Link
            to="/berita"
            className="mt-4 sm:mt-0 inline-flex items-center text-sky-600 hover:text-sky-700 font-semibold group"
          >
            Lihat Semua Berita
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* News Grid - Featured + Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured (first news - big card) */}
          <Link to={`/berita/${news[0].id}`} className="block group">
            <div className="relative h-full min-h-[320px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
              {news[0].image_url && (
                <img
                  src={news[0].image_url}
                  alt={news[0].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="bg-sky-600 text-white mb-3">{news[0].category}</Badge>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 line-clamp-2">
                  {news[0].title}
                </h3>
                <p className="text-gray-200 text-sm line-clamp-2 mb-3">{news[0].excerpt}</p>
                <div className="flex items-center text-gray-300 text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  {news[0].date}
                </div>
              </div>
            </div>
          </Link>

          {/* Side news (2-4) */}
          <div className="flex flex-col gap-4">
            {news.slice(1, 4).map((item) => (
              <Link key={item.id} to={`/berita/${item.id}`} className="block group">
                <div className="flex gap-4 p-3 rounded-xl border-2 border-gray-100 hover:border-sky-400 hover:shadow-md transition-all duration-200">
                  {item.image_url && (
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Badge variant="secondary" className="text-xs mb-1 bg-sky-50 text-sky-700">
                      {item.category}
                    </Badge>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-sky-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-xs mt-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.date}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeNewsPreview;
