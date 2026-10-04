import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { changeMyPassword, getMyProfile, updateMyProfile, uploadMyPhoto } from '../api/profile';
import { API_BASE_URL } from '../api/client';
import type { EmployeeProfile } from '../types';

export function ProfilePage() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    const data = await getMyProfile();
    setProfile(data);
    setPhoneNumber(data.phoneNumber);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSavePhone = async () => {
    setError(null);
    setMessage(null);
    try {
      const updated = await updateMyProfile({ phoneNumber });
      setProfile(updated);
      setMessage('Nomor handphone berhasil diperbarui');
    } catch {
      setError('Gagal memperbarui nomor handphone');
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setMessage(null);
    try {
      const updated = await uploadMyPhoto(file);
      setProfile(updated);
      setMessage('Foto berhasil diperbarui');
    } catch {
      setError('Gagal mengunggah foto');
    }
  };

  const handleChangePassword = async () => {
    setError(null);
    setMessage(null);
    try {
      await changeMyPassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setMessage('Password berhasil diperbarui');
    } catch {
      setError('Gagal mengganti password, periksa password saat ini');
    }
  };

  if (!profile) {
    return (
      <Layout>
        <p className="text-slate-500">Memuat profil...</p>
      </Layout>
    );
  }

  const photoSrc = profile.photoUrl ? `${API_BASE_URL}${profile.photoUrl}` : null;

  return (
    <Layout>
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 text-center shadow-sm">
          <div className="h-28 w-28 overflow-hidden rounded-full bg-slate-200">
            {photoSrc ? (
              <img src={photoSrc} alt={profile.fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-slate-400">
                {profile.fullName.charAt(0)}
              </div>
            )}
          </div>
          <label className="cursor-pointer text-sm font-medium text-indigo-700 hover:underline">
            Ubah Foto
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Profil Karyawan</h2>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">Nama</dt>
                <dd className="text-sm text-slate-800">{profile.fullName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">Email Perusahaan</dt>
                <dd className="text-sm text-slate-800">{profile.companyEmail}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">Posisi</dt>
                <dd className="text-sm text-slate-800">{profile.position}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">Nomor Handphone</label>
              <div className="flex gap-2">
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <button
                  onClick={handleSavePhone}
                  className="whitespace-nowrap rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
                >
                  Simpan
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Ganti Password</h2>
            <div className="flex flex-col gap-3 sm:max-w-sm">
              <input
                type="password"
                placeholder="Password saat ini"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={handleChangePassword}
                className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
              >
                Ganti Password
              </button>
            </div>
          </section>

          {message && <p className="text-sm text-emerald-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </Layout>
  );
}
