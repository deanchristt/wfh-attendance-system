import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { createEmployee, listEmployees, updateEmployee } from '../api/employees';
import type { EmployeeProfile, Role } from '../types';

interface FormState {
  id: string | null;
  fullName: string;
  companyEmail: string;
  password: string;
  position: string;
  phoneNumber: string;
  role: Role;
}

const emptyForm: FormState = {
  id: null,
  fullName: '',
  companyEmail: '',
  password: '',
  position: '',
  phoneNumber: '',
  role: 'EMPLOYEE',
};

export function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setEmployees(await listEmployees());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setError(null);
    setFormOpen(true);
  };

  const openEdit = (employee: EmployeeProfile) => {
    setForm({
      id: employee.id,
      fullName: employee.fullName,
      companyEmail: employee.companyEmail,
      password: '',
      position: employee.position,
      phoneNumber: employee.phoneNumber,
      role: employee.role,
    });
    setError(null);
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      if (form.id) {
        await updateEmployee(form.id, {
          fullName: form.fullName,
          companyEmail: form.companyEmail,
          position: form.position,
          phoneNumber: form.phoneNumber,
          role: form.role,
        });
      } else {
        await createEmployee({
          fullName: form.fullName,
          companyEmail: form.companyEmail,
          password: form.password,
          position: form.position,
          phoneNumber: form.phoneNumber,
          role: form.role,
        });
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? 'Gagal menyimpan data karyawan');
    }
  };

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Data Karyawan</h2>
        <button
          onClick={openCreate}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          + Tambah Karyawan
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase text-slate-400">
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email Perusahaan</th>
              <th className="px-4 py-3">Posisi</th>
              <th className="px-4 py-3">No. HP</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  Memuat...
                </td>
              </tr>
            )}
            {!loading &&
              employees.map((employee) => (
                <tr key={employee.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">{employee.fullName}</td>
                  <td className="px-4 py-3">{employee.companyEmail}</td>
                  <td className="px-4 py-3">{employee.position}</td>
                  <td className="px-4 py-3">{employee.phoneNumber}</td>
                  <td className="px-4 py-3">{employee.role}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(employee)}
                      className="text-sm font-medium text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              {form.id ? 'Edit Karyawan' : 'Tambah Karyawan'}
            </h3>
            <div className="flex flex-col gap-3">
              <input
                placeholder="Nama Lengkap"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                placeholder="Email Perusahaan"
                type="email"
                value={form.companyEmail}
                onChange={(e) => setForm({ ...form, companyEmail: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              {!form.id && (
                <input
                  placeholder="Password Awal"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              )}
              <input
                placeholder="Posisi"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                placeholder="Nomor Handphone"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => setFormOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
