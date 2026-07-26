import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsAPI } from '@/lib/api';
import { Calendar, ArrowLeft, Loader2, Share2, Check, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchNewsDetail();
    fetchAllNews();
  }, [id]);

  const fetchNewsDetail = async () => {
    setLoading(true);
    try {
      const { data } = await newsAPI.getById(id);
      setNews(data);
    } catch (err) {
      setError('Berita tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllNews = async () => {
    try {
      const { data } = await newsAPI.getAll();
      setAllNews(data);
    } catch (err) {
      console.error('Failed to fetch all news:', err);
    }
  };

  // Share functions
  const shareToWhatsApp = () => {
    const url = window.location.href;
    const text = `${news.title}\n\nBaca selengkapnya di: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link berhasil disalin!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      toast.success('Link berhasil disalin!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Get related news (same category, excluding current)
  const relatedNews = allNews
    .filter(item => item.id !== id && item.category === news?.category)
    .slice(0, 3);

  // If no same-category news, show latest news instead
  const recommendedNews = relatedNews.length > 0
    ? relatedNews
    : allNews.filter(item => item.id !== id).slice(0, 3);

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

          {/* Share Buttons */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Bagikan:
              </span>
              <button
                onClick={shareToWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                onClick={copyLink}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                  copied
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Tersalin!' : 'Salin Link'}
              </button>
            </div>
          </div>

          {/* Baca Juga - Related News */}
          {recommendedNews.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Baca Juga</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedNews.map((item) => (
                  <Link key={item.id} to={`/berita/${item.id}`} className="block group">
                    <div className="bg-white border-2 border-gray-100 hover:border-sky-400 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg">
                      {item.image_url && (
                        <div className="h-32 overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}
                      <div className="p-3">
                        <p className="text-xs text-sky-600 font-medium mb-1">{item.category}</p>
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-sky-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
};

export default NewsDetailPage;
