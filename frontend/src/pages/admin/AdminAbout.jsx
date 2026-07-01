import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { settingsAPI, formatApiErrorDetail } from '@/lib/api';
import { toast } from 'sonner';

const AdminAbout = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const { data } = await settingsAPI.getAbout();
      setContent(data.content);
    } catch (error) {
      toast.error('Gagal memuat konten sejarah');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await settingsAPI.updateAbout(content);
      toast.success('Sejarah Trans Koetaradja berhasil diupdate');
      fetchAbout();
    } catch (error) {
      const msg = formatApiErrorDetail(error.response?.data?.detail);
      toast.error(msg || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <Card>
            <CardContent className="p-6">
              <div className="h-64 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Sejarah Trans Koetaradja</h1>
          <p className="text-gray-600 mt-1">Kelola konten halaman Tentang/Sejarah</p>
        </div>

        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>Konten Sejarah</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="content">Konten Sejarah *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis sejarah Trans Koetaradja di sini..."
                  rows={16}
                  required
                  className="font-sans"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Tips: Gunakan paragraf yang jelas untuk memudahkan pembaca
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700"
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAbout;