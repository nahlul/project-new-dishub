import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsAPI } from '@/lib/api';
import { Calendar, ArrowRight, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data } = await newsAPI.getAll();
      setNews(data);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ['Semua', ...new Set(news.map(item => item.category).filter(Boolean))];

  // Filter news
  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-20 bg-white overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Berita & Pengumuman
          </h2>
          <div className="w-24 h-1 bg-sky-600 mx-auto mb-6" />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Update terbaru seputar layanan Trans Koetaradja
          </p>
        </div>

        {/* Search & Filter */}
        {!loading && news.length > 0 && (
          <div className="max-w-6xl mx-auto mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-5 rounded-xl border-2 border-gray-200 focus:border-sky-500 text-base"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {searchQuery || activeCategory !== 'Semua' ? (
              <div>
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Tidak ada berita yang cocok dengan pencarian Anda</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('Semua'); }}
                  className="mt-3 text-sky-600 font-medium hover:underline"
                >
                  Reset filter
                </button>
              </div>
            ) : (
              <p>Belum ada berita tersedia</p>
            )}
          </div>
        ) : (
          <>
            {/* Results count */}
            {(searchQuery || activeCategory !== 'Semua') && (
              <p className="text-sm text-gray-500 text-center mb-6">
                Menampilkan {filteredNews.length} berita
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {filteredNews.map((item) => (
              <Link key={item.id} to={`/berita/${item.id}`} className="block">
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] border-2 hover:border-sky-500 flex flex-col h-full">
                {item.image_url && (
                  <div className="relative overflow-hidden h-48 flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-sky-600 text-white text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                )}
                
                <CardHeader className="flex-grow pb-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{item.date}</span>
                  </div>
                  <CardTitle className="text-base lg:text-xl font-bold line-clamp-2 group-hover:text-sky-600 transition-colors leading-tight">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-grow py-2">
                  <CardDescription className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </CardDescription>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <span className="text-sky-600 font-semibold inline-flex items-center text-sm">
                    Baca Selengkapnya
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </span>
                </CardFooter>
              </Card>
              </Link>
              ))}
            </div>
          </>
        )}

        {/* Follow Instagram CTA */}
        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/trans.koetaradja"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              variant="outline"
              className="border-2 border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white px-6 lg:px-8 py-4 lg:py-6 rounded-xl font-semibold text-base lg:text-lg transition-all duration-300"
            >
              Ketuk untuk Mendapatkan Berita Terbaru
              <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
          </a>
          <p className="text-gray-500 text-xs lg:text-sm mt-4">Follow @trans.koetaradja di Instagram</p>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
