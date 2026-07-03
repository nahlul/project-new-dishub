import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsAPI } from '@/lib/api';
import { Calendar, ArrowLeft, Tag, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      const { data } = await newsAPI.getById(id);
      setNews(data);
    } catch (err) {
      setError('Berita tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !news) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center pt-20">
          <p className="text-gray-500 text-lg mb-4">{error || 'Berita tidak ditemukan'}</p>
          <Link to="/berita" className="text-sky-600 hover:text-sky-700 font-medium inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Berita
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Back button */}
          <Link 
            to="/berita" 
            className="text-sky-600 hover:text-sky-700 font-medium inline-flex items-center gap-2 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Berita
          </Link>

          {/* Category & Date */}
          <div className="flex items-center gap-4 mb-4">
            <Badge className="bg-sky-600 text-white">
              {news.category}
            </Badge>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {news.date}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {news.title}
          </h1>

          {/* Image */}
          {news.image_url && (
            <div className="w-full rounded-xl overflow-hidden mb-8">
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {news.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default NewsDetailPage;
