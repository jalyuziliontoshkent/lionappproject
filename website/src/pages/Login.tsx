import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  ShieldCheck,
  Blinds,
  BarChart3,
  Users,
  Package,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login, user }         = useAuth();
  const navigate                = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Email va parolni to\'liq kiriting');
      return;
    }
    setLoading(true); setError('');
    try {
      const result: any = await login(email.trim().toLowerCase(), password);
      // Role asosida to'g'ri dashboardga o'tish
      const role = result?.role ?? result?.user?.role;
      if (role === 'admin')  navigate('/admin/dashboard', { replace: true });
      else if (role === 'worker') navigate('/worker/tasks', { replace: true });
      else navigate('/dealer/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Autentifikatsiya xatosi yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: BarChart3, label: 'Real-time statistika va analitika' },
    { icon: Users,     label: 'Dilerlar va ishchilar boshqaruvi' },
    { icon: Package,   label: 'Ombor va inventar nazorati' },
  ];

  return (
    <div className="login-page">
      {/* Animated background blobs */}
      <div
        className="login-bg-blob"
        style={{
          width: 600, height: 600,
          background: 'radial-gradient(circle, #6366f1, #4f46e5)',
          top: -150, left: -200,
          animationDelay: '0s',
        }}
      />
      <div
        className="login-bg-blob"
        style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, #818cf8, #a78bfa)',
          bottom: -100, left: '30%',
          animationDelay: '-6s',
          animationDirection: 'reverse',
        }}
      />

      {/* ── Hero Section ─────────────────────────────── */}
      <div className="login-hero">
        <div className="login-hero-card">
          <div className="login-hero-logo">
            <Blinds size={34} color="white" />
          </div>

          <h1 className="login-hero-title">
            Lion Jalyuzi<br />B2B Portal
          </h1>
          <p className="login-hero-desc">
            Buyurtmalar, ombor va ishchilarni professional
            darajada boshqarish uchun zamonaviy tizim.
          </p>

          <div className="login-hero-features">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="login-feature-item">
                <div className="login-feature-icon">
                  <Icon size={16} />
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form Section ─────────────────────────────── */}
      <div className="login-form-side">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-form-header">
            <h2 className="login-form-title">Tizimga kirish</h2>
            <p className="login-form-sub">
              Hisobingizga kirish uchun ma'lumotlaringizni kiriting.
            </p>
          </div>

          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div className="input-group">
              <label className="input-label">Email manzil</label>
              <div className="input-with-icon">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input
                  id="login-email"
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@lion.uz"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <label className="input-label">Parol</label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                  }}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn-xl"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                Tekshirilmoqda...
              </>
            ) : (
              <>
                Kirish
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="login-footer">
            <ShieldCheck size={13} />
            <span>256-bit shifrlangan xavfsiz ulanish</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
