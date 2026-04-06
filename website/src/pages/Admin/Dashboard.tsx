import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend: string;
  trendUp?: boolean;
  color: string;
}

const SkeletonCard = () => (
  <div className="stat-card" style={{ gap: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12 }} />
      <div className="skeleton" style={{ width: 60, height: 24, borderRadius: 20 }} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="skeleton" style={{ width: '60%', height: 12, borderRadius: 6 }} />
      <div className="skeleton" style={{ width: '80%', height: 32, borderRadius: 8 }} />
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchStats = async () => {
    setLoading(true); setError('');
    try {
      const data = await api.get('/admin/statistics');
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Ma\'lumotlarni yuklashda xato');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const statCards: StatCard[] = [
    {
      label: 'Umumiy Daromad',
      value: `$${(stats?.total_revenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp, trend: '+12.5%', trendUp: true, color: 'indigo',
    },
    {
      label: 'Aktiv Dilerlar',
      value: stats?.total_dealers ?? 0,
      icon: Users, trend: '+2 bu oy', trendUp: true, color: 'green',
    },
    {
      label: 'Mahsulot Turlari',
      value: stats?.total_materials ?? 0,
      icon: Package, trend: 'Stabil', color: 'purple',
    },
    {
      label: "Jami Buyurtmalar",
      value: stats?.total_orders ?? 0,
      icon: ShoppingCart, trend: '+5 bugun', trendUp: true, color: 'blue',
    },
  ];

  const orderStatusItems = [
    { label: 'Kutilmoqda', count: stats?.pending_orders ?? 0, icon: Clock, color: 'var(--warning)', bg: 'var(--warning-bg)' },
    { label: 'Bajarilmoqda', count: stats?.processing_orders ?? 0, icon: Package, color: 'var(--info)', bg: 'var(--info-bg)' },
    { label: 'Tayyor', count: stats?.completed_orders ?? 0, icon: CheckCircle2, color: 'var(--success)', bg: 'var(--success-bg)' },
    { label: "Yo'lda", count: stats?.delivered_orders ?? 0, icon: Truck, color: 'var(--purple)', bg: 'var(--purple-bg)' },
  ];

  return (
    <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* ── Header ───────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">
            Tizim holati, daromad va buyurtmalar statistikasi.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="glass-2" style={{
            padding: '8px 16px', borderRadius: 'var(--r-full)',
            fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
            color: 'var(--text-muted)',
          }}>
            {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <button
            className="btn btn-ghost btn-icon"
            onClick={fetchStats}
            disabled={loading}
            title="Yangilash"
          >
            <RefreshCw size={16} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {/* ── Error ────────────────────────────────────── */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', borderRadius: 'var(--r-lg)',
          background: 'var(--danger-bg)', border: '1px solid rgba(248,113,113,0.2)',
          color: 'var(--danger)', fontSize: 13,
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* ── Stat Cards ───────────────────────────────── */}
      <div className="stats-grid">
        {loading
          ? [0,1,2,3].map(i => <SkeletonCard key={i} />)
          : statCards.map((card, idx) => (
            <div
              key={idx}
              className={`stat-card anim-fade-up anim-delay-${idx + 1}`}
            >
              <div className="stat-card-top">
                <div className={`stat-icon-wrap ${card.color}`}>
                  <card.icon size={20} />
                </div>
                {card.trend && (
                  <span className={`stat-badge ${card.trendUp === false ? 'down' : card.trendUp ? 'up' : 'flat'}`}>
                    {card.trendUp !== undefined && (
                      card.trendUp
                        ? <ArrowUpRight size={11} />
                        : <ArrowDownRight size={11} />
                    )}
                    {card.trend}
                  </span>
                )}
              </div>
              <div>
                <p className="stat-label">{card.label}</p>
                <p className="stat-value">{card.value}</p>
              </div>
            </div>
          ))
        }
      </div>

      {/* ── Main Content Grid ────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Oxirgi buyurtmalar</span>
            <a
              href="/admin/orders"
              style={{ fontSize: 12, color: 'var(--accent-2)', textDecoration: 'none', fontWeight: 600 }}
            >
              Barchasini ko'rish →
            </a>
          </div>
          <div style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} className="skeleton" style={{ height: 56, borderRadius: 12 }} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <ShoppingCart size={40} className="empty-state-icon" />
                <p>API'dan buyurtmalar yuklanmoqda...</p>
                <p style={{ fontSize: 12, color: 'var(--text-disabled)' }}>
                  Backend ulanganida bu yerda real ma'lumotlar ko'rinadi
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Order Status Breakdown */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Buyurtma holatlari</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {orderStatusItems.map(({ label, count, icon: Icon, color, bg }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 'var(--r-lg)',
                  background: 'var(--glass-2)', border: '1px solid var(--glass-border-2)',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--r-md)',
                    background: bg, color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={16} />
                  </div>
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700, fontSize: 14, color,
                  }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Tezkor amallar</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Yangi mahsulot qo\'shish', href: '/admin/inventory' },
                { label: 'Diler qo\'shish', href: '/admin/dealers' },
                { label: 'Barcha buyurtmalar', href: '/admin/orders' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 'var(--r-lg)',
                    background: 'var(--glass-2)', border: '1px solid var(--glass-border-2)',
                    color: 'var(--text-secondary)', textDecoration: 'none',
                    fontSize: 13, fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--glass-active)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--glass-2)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  }}
                >
                  {label}
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
