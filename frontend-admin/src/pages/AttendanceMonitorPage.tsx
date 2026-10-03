import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { listAllAttendance } from '../api/attendance';
import { listEmployees } from '../api/employees';
import type { AttendanceRecord, EmployeeProfile } from '../types';

export function AttendanceMonitorPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [employeeId, setEmployeeId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(true);

  const search = async () => {
    setLoading(true);
    try {
      const data = await listAllAttendance({
        employeeId: employeeId || undefined,
        from: from || undefined,
        to: to || undefined,
      });
      setRecords(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listEmployees().then(setEmployees);
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-slate-800">Monitoring Absensi Karyawan</h2>
        <p className="mb-4 text-sm text-slate-400">Read only &mdash; data absensi yang telah disubmit karyawan</p>

        <div className="mb-5 grid gap-3 sm:grid-cols-4 sm:items-end">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-slate-400">Karyawan</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Semua Karyawan</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.fullName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-slate-400">Dari Tanggal</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-slate-400">Sampai Tanggal</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={search}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Cari
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase text-slate-400">
                <th className="py-2 pr-4">Karyawan</th>
                <th className="py-2 pr-4">Tanggal</th>
                <th className="py-2 pr-4">Waktu</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    Memuat...
                  </td>
                </tr>
              )}
              {!loading && records.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    Tidak ada data absensi
                  </td>
                </tr>
              )}
              {!loading &&
                records.map((record) => (
                  <tr key={record.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4">{record.employeeName}</td>
                    <td className="py-2 pr-4">{record.date}</td>
                    <td className="py-2 pr-4">{record.time}</td>
                    <td className="py-2 pr-4">
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          record.status === 'MASUK' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
