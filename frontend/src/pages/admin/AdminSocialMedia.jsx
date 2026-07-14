import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminPageHeader from '@/components/AdminPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { settingsAPI, formatApiErrorDetail } from '@/lib/api';
import { toast } from 'sonner';

const AdminSocialMedia = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    whatsapp: '',
    instagram: '',
    facebook: '',
    twitter: '',
  });

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const fetchSocialMedia = async () => {
    try {
      const { data } = await settingsAPI.getSocialMedia();
      setFormData(data);
    } catch (error) {
      toast.error('Gagal memuat data social media');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await settingsAPI.updateSocialMedia(formData);
      toast.success('Link social media berhasil diupdate');
      fetchSocialMedia();
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
            <CardContent className="p-6 space-y-4">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Edit Social Media"
          subtitle="Kelola link social media Trans Koetaradja"
        />

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Link Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="whatsapp" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  WhatsApp *
                </Label>
                <Input
                  id="whatsapp"
                  type="url"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="https://wa.me/6281167123490"
                  required
                />
              </div>

              <div>
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  Instagram *
                </Label>
                <Input
                  id="instagram"
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="https://www.instagram.com/trans.koetaradja"
                  required
                />
              </div>

              <div>
                <Label htmlFor="facebook" className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  Facebook *
                </Label>
                <Input
                  id="facebook"
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="https://www.facebook.com/dishub.aceh"
                  required
                />
              </div>

              <div>
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <FaXTwitter className="w-4 h-4" />
                  X (Twitter) *
                </Label>
                <Input
                  id="twitter"
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  placeholder="https://twitter.com/dishubaceh"
                  required
                />
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

export default AdminSocialMedia;