import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, Images, Calendar, ArrowRight, Clock, Activity, Plus } from 'lucide-react';
import { newsAPI, galleryAPI } from '@/lib/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalNews: 0,
    totalGallery: 0,
    recentNews: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [newsRes, galleryRes] = await Promise.all([
        newsAPI.getAll(),
        galleryAPI.getAll(),
      ]);

      setStats({
        totalNews: newsRes.data.length,
        totalGallery: galleryRes.data.length,
        recentNews: newsRes.data.slice(0, 3),
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Berita',
      value: stats.totalNews,
      icon: Newspaper,
      color: 'bg-sky-500',
      link: '/admin/news',
    },
    {
      title: 'Total Foto Galeri',
      value: stats.totalGallery,
      icon: Images,
      color: 'bg-purple-500',
      link: '/admin/gallery',
    },
    {
      title: 'Bulan Ini',
      value: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      icon: Calendar,
      color: 'bg-green-500',
      isText: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-gray-600 mt-1">Selamat datang di panel admin Trans Koetaradja</p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="bg-sky-600 hover:bg-sky-700">
              <Link to="/admin/news">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Berita
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          {stat.title}
                        </p>
                        <p className={`text-3xl font-bold ${stat.isText ? 'text-lg' : 'text-gray-900'}`}>
                          {loading ? (
                            <span className="text-gray-400">...</span>
                          ) : (
                            stat.value
                          )}
                        </p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-xl`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    {stat.link && (
                      <Link
                        to={stat.link}
                        className="mt-4 text-sm text-sky-600 hover:text-sky-700 font-medium inline-flex items-center gap-1"
                      >
                        Lihat Detail
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent News */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Berita Terbaru</span>
              <Link
                to="/admin/news"
                className="text-sm font-normal text-sky-600 hover:text-sky-700"
              >
                Lihat Semua →
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : stats.recentNews.length > 0 ? (
              <div className="space-y-4">
                {stats.recentNews.map((news) => (
                  <div
                    key={news.id}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {news.image_url && (
                      <img
                        src={news.image_url}
                        alt={news.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{news.date}</p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-sky-100 text-sky-700 rounded">
                        {news.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Newspaper className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Belum ada berita</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aktivitas Terakhir */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-600" />
              Informasi Sistem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-sky-50">
                <Clock className="w-5 h-5 text-sky-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Berita Terakhir Ditambah</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {stats.recentNews.length > 0
                      ? stats.recentNews[0].date
                      : 'Belum ada berita'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50">
                <Activity className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Status Server</p>
                  <p className="text-xs text-green-600 font-medium mt-1">Online & Berjalan Normal</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-50">
                <Newspaper className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Konten</p>
                  <p className="text-xs text-gray-600 mt-1">{stats.totalNews} Berita, {stats.totalGallery} Foto</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-50">
                <Calendar className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Versi Aplikasi</p>
                  <p className="text-xs text-gray-600 mt-1">Trans Koetaradja CMS v1.0</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
