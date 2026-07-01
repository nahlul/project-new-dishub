import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';
import { newsAPI, formatApiErrorDetail } from '@/lib/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Berita',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data } = await newsAPI.getAll();
      setNewsList(data);
    } catch (error) {
      toast.error('Gagal memuat berita');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', excerpt: '', content: '', category: 'Berita' });
    setImageFile(null);
    setImagePreview(null);
    setEditingNews(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (editingNews) {
        await newsAPI.update(editingNews.id, formData);
        if (imageFile) {
          await newsAPI.uploadImage(editingNews.id, imageFile);
        }
        toast.success('Berita berhasil diupdate');
      } else {
        const { data } = await newsAPI.create(formData);
        if (imageFile) {
          await newsAPI.uploadImage(data.id, imageFile);
        }
        toast.success('Berita berhasil ditambahkan');
      }
      fetchNews();
      setShowDialog(false);
      resetForm();
    } catch (error) {
      const msg = formatApiErrorDetail(error.response?.data?.detail);
      toast.error(msg || 'Gagal menyimpan berita');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (news) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      category: news.category,
    });
    setImagePreview(news.image_url);
    setShowDialog(true);
  };

  const handleDelete = async () => {
    try {
      await newsAPI.delete(deleteConfirm.id);
      toast.success('Berita berhasil dihapus');
      fetchNews();
    } catch (error) {
      toast.error('Gagal menghapus berita');
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Berita</h1>
            <p className="text-gray-600 mt-1">Tambah, edit, atau hapus berita</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowDialog(true);
            }}
            className="bg-sky-600 hover:bg-sky-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Berita
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : newsList.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <p>Belum ada berita. Klik "Tambah Berita" untuk memulai.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newsList.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  {news.image_url && (
                    <img
                      src={news.image_url}
                      alt={news.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="p-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-sky-100 text-sky-700 rounded mb-2">
                      {news.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {news.excerpt}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">{news.date}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(news)}
                        className="flex-1"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteConfirm(news)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNews ? 'Edit Berita' : 'Tambah Berita Baru'}
            </DialogTitle>
            <DialogDescription>
              Lengkapi form di bawah untuk {editingNews ? 'mengupdate' : 'menambahkan'} berita
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label>Foto Cover</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-sky-500 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Upload Foto (Max 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="title">Judul Berita *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul berita"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Kategori *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Contoh: Berita, Pengumuman, Informasi"
                required
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Ringkasan *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Ringkasan singkat berita (2-3 kalimat)"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Isi Berita *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Tulis isi berita lengkap di sini"
                rows={8}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="flex-1"
                disabled={uploading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-sky-600 hover:bg-sky-700"
                disabled={uploading}
              >
                {uploading ? 'Menyimpan...' : editingNews ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Berita?</AlertDialogTitle>
            <AlertDialogDescription>
              Berita "{deleteConfirm?.title}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminNews;