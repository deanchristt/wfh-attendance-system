import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/profile', label: 'Profil' },
  { to: '/attendance', label: 'Absen' },
  { to: '/summary', label: 'Summary Absen' },
];

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-indigo-700 text-white shadow">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-lg font-semibold leading-tight">Absensi WFH</p>
            <p className="text-xs text-indigo-200">{user?.fullName}</p>
          </div>
          <button
            className="rounded p-2 text-white md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-white text-indigo-700' : 'text-indigo-100 hover:bg-indigo-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="ml-2 rounded px-3 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-600"
            >
              Logout
            </button>
          </nav>
        </div>
        {menuOpen && (
          <nav className="flex flex-col gap-1 px-4 pb-3 md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-white text-indigo-700' : 'text-indigo-100 hover:bg-indigo-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="rounded px-3 py-2 text-left text-sm font-medium text-indigo-100 hover:bg-indigo-600"
            >
              Logout
            </button>
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
