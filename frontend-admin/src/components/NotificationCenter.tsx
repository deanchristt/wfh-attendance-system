import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { API_BASE_URL } from '../api/client';
import type { ProfileUpdatedNotification } from '../types';

interface Toast extends ProfileUpdatedNotification {
  id: string;
}

function describeChanges(changes: Record<string, { old: unknown; new: unknown }>): string {
  const labels: Record<string, string> = {
    phoneNumber: 'nomor handphone',
    photoUrl: 'foto profil',
    password: 'password',
  };
  return Object.keys(changes)
    .map((key) => labels[key] ?? key)
    .join(', ');
}

export function NotificationCenter() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let socket: Socket;
    try {
      socket = io(`${API_BASE_URL}/notifications`, { transports: ['websocket'] });
    } catch {
      return;
    }

    socket.on('employee-profile-updated', (event: ProfileUpdatedNotification) => {
      const toast: Toast = { ...event, id: `${event.employeeId}-${event.changedAt}` };
      setToasts((prev) => [toast, ...prev].slice(0, 5));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 8000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="w-80 rounded-lg border border-indigo-200 bg-white p-4 shadow-lg"
          role="alert"
        >
          <p className="text-sm font-semibold text-indigo-700">Perubahan Profil Karyawan</p>
          <p className="mt-1 text-sm text-slate-700">
            <strong>{toast.fullName}</strong> ({toast.companyEmail}) memperbarui {describeChanges(toast.changes)}
          </p>
          <p className="mt-1 text-xs text-slate-400">{new Date(toast.changedAt).toLocaleString('id-ID')}</p>
        </div>
      ))}
    </div>
  );
}
