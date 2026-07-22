import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import AdminPageHeader from '@/components/AdminPageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Save } from 'lucide-react';
import { authAPI, formatApiErrorDetail } from '@/lib/api';
import { toast } from 'sonner';

const AdminChangePassword = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newUsername: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Password baru dan konfirmasi tidak cocok');
      return;
    }

    if (formData.newPassword.length < 4) {
      toast.error('Password baru minimal 4 karakter');
      return;
    }

    setSaving(true);

    try {
      await authAPI.changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.newUsername || undefined
      );
      toast.success('Password berhasil diubah! Silakan login kembali.');
      setTimeout(async () => {
        await logout();
        navigate('/admin');
      }, 1500);
    } catch (error) {
      const msg = formatApiErrorDetail(error.response?.data?.detail);
      toast.error(msg || 'Gagal mengubah password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Ganti Password"
          subtitle="Ubah username dan password admin Anda"
        />

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Keamanan Akun
            </CardTitle>
            <CardDescription>
              Pastikan password baru Anda aman dan mudah diingat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="newUsername">Username Baru (Opsional)</Label>
                <Input
                  id="newUsername"
                  type="text"
                  value={formData.newUsername}
                  onChange={(e) => setFormData({ ...formData, newUsername: e.target.value })}
                  placeholder="Kosongkan jika tidak ingin mengubah username"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Jika diisi, username Anda akan diubah
                </p>
              </div>

              <div className="border-t pt-4">
                <Label htmlFor="currentPassword">Password Saat Ini *</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="Masukkan password lama"
                  required
                />
              </div>

              <div>
                <Label htmlFor="newPassword">Password Baru *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Masukkan password baru (min. 4 karakter)"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Ketik ulang password baru"
                  required
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Setelah mengubah password, Anda akan otomatis logout dan harus login kembali.
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

export default AdminChangePassword;