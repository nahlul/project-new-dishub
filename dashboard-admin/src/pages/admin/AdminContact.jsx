import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminPageHeader from '@/components/AdminPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { settingsAPI, formatApiErrorDetail } from '@/lib/api';
import { toast } from 'sonner';

const AdminContact = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    email: '',
    operational_hours: '',
  });

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const { data } = await settingsAPI.getContact();
      setFormData(data);
    } catch (error) {
      toast.error('Gagal memuat data kontak');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await settingsAPI.updateContact(formData);
      toast.success('Informasi kontak berhasil diupdate');
      fetchContact();
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
          title="Edit Informasi Kontak"
          subtitle="Kelola informasi kontak Trans Koetaradja"
        />

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Informasi Kontak</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="address">Alamat Kantor *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Nomor Telepon *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Contoh: +62 811 6712349"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Contoh: info@transkutaraja.acehprov.go.id"
                  required
                />
              </div>

              <div>
                <Label htmlFor="operational_hours">Jam Operasional *</Label>
                <Input
                  id="operational_hours"
                  value={formData.operational_hours}
                  onChange={(e) => setFormData({ ...formData, operational_hours: e.target.value })}
                  placeholder="Contoh: 06:00 - 18:00 WIB (Setiap Hari)"
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

export default AdminContact;