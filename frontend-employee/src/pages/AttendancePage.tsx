import { useState } from 'react';
import { Layout } from '../components/Layout';
import { recordAttendance } from '../api/attendance';

export function AttendancePage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'MASUK' | 'PULANG' | null>(null);

  const handleRecord = async (status: 'MASUK' | 'PULANG') => {
    setMessage(null);
    setError(null);
    setLoading(status);
    try {
      const result = await recordAttendance(status);
      setMessage(
        `Berhasil absen ${status === 'MASUK' ? 'masuk' : 'pulang'} pada ${result.date} pukul ${result.time}`,
      );
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Gagal mencatat absensi');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-slate-800">Absen Hari Ini</h2>
        <p className="mb-6 text-sm text-slate-500">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => handleRecord('MASUK')}
            disabled={loading !== null}
            className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading === 'MASUK' ? 'Memproses...' : 'Absen Masuk'}
          </button>
          <button
            onClick={() => handleRecord('PULANG')}
            disabled={loading !== null}
            className="rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {loading === 'PULANG' ? 'Memproses...' : 'Absen Pulang'}
          </button>
        </div>
        {message && <p className="mt-5 text-sm text-emerald-600">{message}</p>}
        {error && <p className="mt-5 text-sm text-red-600">{error}</p>}
      </div>
    </Layout>
  );
}
