import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { getAttendanceSummary } from '../api/attendance';
import type { AttendanceSummaryRow } from '../types';

function startOfMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

function today(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function SummaryPage() {
  const [from, setFrom] = useState(startOfMonth());
  const [to, setTo] = useState(today());
  const [rows, setRows] = useState<AttendanceSummaryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (fromDate: string, toDate: string) => {
    setLoading(true);
    try {
      const data = await getAttendanceSummary(fromDate, toDate);
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search(from, to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Summary Absen</h2>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-slate-400">Dari Tanggal</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-slate-400">Sampai Tanggal</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={() => search(from, to)}
            className="rounded-lg bg-indigo-700 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
          >
            Cari
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase text-slate-400">
                <th className="py-2 pr-4">Tanggal</th>
                <th className="py-2 pr-4">Masuk</th>
                <th className="py-2 pr-4">Pulang</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-400">
                    Memuat...
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-400">
                    Tidak ada data absensi pada rentang ini
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((row) => (
                  <tr key={row.date} className="border-b border-slate-100">
                    <td className="py-2 pr-4">{row.date}</td>
                    <td className="py-2 pr-4">{row.masukTime ? `${row.date} ${row.masukTime}` : '-'}</td>
                    <td className="py-2 pr-4">{row.pulangTime ? `${row.date} ${row.pulangTime}` : '-'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
