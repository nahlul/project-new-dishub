import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import AdminPageHeader from '@/components/AdminPageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Trash2, Pencil } from 'lucide-react';
import { galleryAPI, formatApiErrorDetail } from '@/lib/api';
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

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadData, setUploadData] = useState({
    title: '',
    category: 'Galeri',
  });
  const [editData, setEditData] = useState({
    title: '',
    category: '',
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data } = await galleryAPI.getAll();
      setGallery(data);
    } catch (error) {
      toast.error('Gagal memuat galeri');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} terlalu besar (max 5MB)`);
        return false;
      }
      return file.type.startsWith('image/');
    });
    setSelectedFiles(validFiles);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error('Pilih minimal 1 foto');
      return;
    }

    setUploading(true);
    let successCount = 0;

    try {
      for (const file of selectedFiles) {
        await galleryAPI.upload(file, uploadData.title, uploadData.category);
        successCount++;
      }
      toast.success(`${successCount} foto berhasil diupload`);
      fetchGallery();
      setShowUploadDialog(false);
      setSelectedFiles([]);
      setUploadData({ title: '', category: 'Galeri' });
    } catch (error) {
      const msg = formatApiErrorDetail(error.response?.data?.detail);
      toast.error(msg || `Berhasil upload ${successCount} dari ${selectedFiles.length} foto`);
    } finally {
      setUploading(false);
    }
  };

  const handleEditOpen = (item) => {
    setEditItem(item);
    setEditData({
      title: item.title || '',
      category: item.category || 'Galeri',
    });
    setShowEditDialog(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editItem) return;

    setSaving(true);
    try {
      await galleryAPI.update(editItem.id, editData);
      toast.success('Foto galeri berhasil diperbarui');
      fetchGallery();
      setShowEditDialog(false);
      setEditItem(null);
    } catch (error) {
      const msg = formatApiErrorDetail(error.response?.data?.detail);
      toast.error(msg || 'Gagal memperbarui foto galeri');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await galleryAPI.delete(deleteConfirm.id);
      toast.success('Foto berhasil dihapus');
      fetchGallery();
    } catch (error) {
      toast.error('Gagal menghapus foto');
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Kelola Galeri"
          subtitle="Upload, edit, atau hapus foto galeri"
          action={
            <Button
              onClick={() => setShowUploadDialog(true)}
              className="bg-sky-600 hover:bg-sky-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Foto
            </Button>
          }
        />

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200" />
              </Card>
            ))}
          </div>
        ) : gallery.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>Belum ada foto. Klik "Upload Foto" untuk menambahkan.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {gallery.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <img
                      src={item.image_url}
                      alt={item.title || 'Gallery'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditOpen(item)}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteConfirm(item)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title || 'Tanpa Judul'}
                    </p>
                    <p className="text-xs text-sky-600 mt-0.5">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
                    </p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Foto Galeri</DialogTitle>
            <DialogDescription>
              Upload satu atau beberapa foto sekaligus (max 5MB per foto)
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4 mt-4">
            <div>
              <Label>Pilih Foto *</Label>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-sky-500 transition-colors mt-2">
                {selectedFiles.length > 0 ? (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-sky-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedFiles.length} foto dipilih
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">Klik untuk pilih foto</span>
                    <span className="text-xs text-gray-500 block mt-1">Bisa pilih beberapa sekaligus</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <Label htmlFor="upload-title">Judul *</Label>
              <Input
                id="upload-title"
                value={uploadData.title}
                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                placeholder="Contoh: Armada Bus 2025"
                required
              />
            </div>

            <div>
              <Label htmlFor="upload-category">Kategori</Label>
              <Input
                id="upload-category"
                value={uploadData.category}
                onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                placeholder="Contoh: Bus, Halte, Operasional"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUploadDialog(false)}
                className="flex-1"
                disabled={uploading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-sky-600 hover:bg-sky-700"
                disabled={uploading || selectedFiles.length === 0}
              >
                {uploading ? 'Mengupload...' : 'Upload'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Foto Galeri</DialogTitle>
            <DialogDescription>
              Perbarui judul dan kategori foto
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSave} className="space-y-4 mt-4">
            {editItem && (
              <div className="w-full max-h-48 overflow-hidden rounded-lg">
                <img
                  src={editItem.image_url}
                  alt={editItem.title || 'Preview'}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <div>
              <Label htmlFor="edit-title">Judul</Label>
              <Input
                id="edit-title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Masukkan judul foto"
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Kategori</Label>
              <Input
                id="edit-category"
                value={editData.category}
                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                placeholder="Contoh: Bus, Halte, Operasional"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="flex-1"
                disabled={saving}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-sky-600 hover:bg-sky-700"
                disabled={saving}
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Foto ini akan dihapus permanen dari galeri. Tindakan ini tidak dapat dibatalkan.
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

export default AdminGallery;
