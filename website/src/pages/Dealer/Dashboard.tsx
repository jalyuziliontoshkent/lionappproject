import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import {
  CreditCard,
  Clock,
  Package,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  Bell,
  ChevronRight,
  ShoppingCart,
  Calendar,
  Truck,
  XCircle,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending:    { label: 'Kutilmoqda',    color: 'var(--warning)', bg: 'var(--warning-bg)', icon: Clock        },
  processing: { label: 'Tayyorlanmoqda', color: 'var(--info)',   bg: 'var(--info-bg)',    icon: Package      },
  completed:  { label: 'Tayyor',         color: 'var(--success)', bg: 'var(--success-bg)',icon: CheckCircle2 },
  delivered:  { label: "Yo'lda",         color: 'var(--purple)', bg: 'var(--purple-bg)',  icon: Truck        },
  cancelled:  { label: 'Bekor',          color: 'var(--danger)',  bg: 'var(--danger-bg)', icon: XCircle      },
};

const NOTIFICATIONS = [
  { id: 1, date: 'Bugun', text: 'Tizim yangilandi: Yangi veb-portal ishga tushdi!' },
  { id: 2, date: '05.04.2025', text: 'Kredit limitingiz oshirildi. Admin bilan bog\'laning.' },
];

const DealerDashboard: React.FC = () => {
  const { user }      = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders]   = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/orders');
        setOrders(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch { /* no-op */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const creditLimit = user?.credit_limit ?? 5000;
  const debt        = user?.debt ?? 0;
  const creditUsed  = debt / creditLimit;

  const statCards = [
    {
      label: 'Kredit Limit',
      value: `$${creditLimit.toLocaleString()}`,
      icon: CreditCard,
      color: 'indigo',
      sub: 'Maksimal kredit',
    },
    {
      label: "Joriy Qarz",
      value: `$${debt.toLocaleString()}`,
      icon: AlertCircle,
      color: debt > creditLimit * 0.8 ? 'red' : 'yellow',
      sub: debt > 0 ? 'To\'lash tavsiya etiladi' : 'Qarz yo\'q',
    },
    {
      label: 'Kutilayotgan',
      value: orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
      icon: Clock,
      color: 'blue',
      sub: 'Jarayondagi buyurtmalar',
    },
    {
      label: 'Bajarilgan',
      value: orders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
      icon: CheckCircle2,
      color: 'green',
      sub: 'Muvaffaqiyatli',
    },
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '3px 10px', borderRadius: 'var(--r-full)',
        background: cfg.bg, color: cfg.color,
        fontSize: 11, fontWeight: 700,
      }}>
        <Icon size={10} /> {cfg.label}
      </span>
    );
  };

  return (
    <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Header ───────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Xush kelibsiz, {user?.name?.split(' ')[0] ?? 'Diler'}! 👋
          </h1>
          <p className="page-subtitle">
            Buyurtmalaringiz va hisob ma'lumotlaringiz.
          </p>
        </div>
        <div style={{
          padding: '8px 16px', borderRadius: 'var(--r-full)',
          background: 'var(--glass-2)', border: '1px solid var(--glass-border-2)',
          fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          ID: #{String(user?.id ?? '000').slice(-5).toUpperCase()}
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────────── */}
      <div className="stats-grid">
        {statCards.map((card, idx) => (
          <div key={idx} className={`stat-card anim-fade-up anim-delay-${idx + 1}`}>
            <div className="stat-card-top">
              <div className={`stat-icon-wrap ${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
            <div>
              <p className="stat-label">{card.label}</p>
              <p className="stat-value">{card.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                {card.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Credit Usage Bar */}
      <div className="card">
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Kredit foydalanish</span>
            <span className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              ${debt.toLocaleString()} / ${creditLimit.toLocaleString()}
            </span>
          </div>
          <div style={{
            height: 8, borderRadius: 'var(--r-full)',
            background: 'var(--glass-2)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(creditUsed * 100, 100)}%`,
              borderRadius: 'var(--r-full)',
              background: creditUsed > 0.8
                ? 'linear-gradient(90deg, var(--warning), var(--danger))'
                : 'linear-gradient(90deg, var(--accent-1), var(--accent-2))',
              transition: 'width 0.6s var(--ease-out)',
            }} />
          </div>
          <p style={{ fontSize: 11, color: creditUsed > 0.8 ? 'var(--danger)' : 'var(--text-muted)' }}>
            {creditUsed > 0.8
              ? '⚠️ Kredit limitingiz tugay yaqinlashdi!'
              : `${((1 - creditUsed) * creditLimit).toLocaleString('en-US', { maximumFractionDigits: 0 })} $ kredit qoldi`}
          </p>
        </div>
      </div>

      {/* ── Main Grid ────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>

        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Oxirgi buyurtmalar</span>
            <a
              href="/dealer/orders"
              style={{ fontSize: 12, color: 'var(--accent-2)', textDecoration: 'none',
                fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              Barchasi <ChevronRight size={14} />
            </a>
          </div>
          {loading ? (
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[0,1,2].map(i => (
                <div key={i} className="skeleton" style={{ height: 56, borderRadius: 12 }} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <Package size={40} className="empty-state-icon" />
              <p>Hozircha buyurtmalar yo'q</p>
              <a
                href="/dealer/new-order"
                className="btn btn-primary btn-sm"
                style={{ textDecoration: 'none', marginTop: 8 }}
              >
                <ShoppingCart size={14} /> Buyurtma berish
              </a>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mato</th>
                  <th>Sana</th>
                  <th>Narx</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      #{String(order.id).slice(-5)}
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 600 }}>{order.material_name}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 12, color: 'var(--text-secondary)' }}>
                        <Calendar size={12} />
                        {new Date(order.created_at).toLocaleDateString('uz-UZ')}
                      </div>
                    </td>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--success)' }}>
                      ${order.total_price?.toFixed(2)}
                    </td>
                    <td><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={16} /> Bildirishnomalar
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-full)',
                background: 'var(--accent-subtle)', color: 'var(--accent-2)',
              }}>
                {NOTIFICATIONS.length}
              </span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className="notif-item">
                  <p className="notif-date">{n.date}</p>
                  <p className="notif-text">{n.text}</p>
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
                { label: 'Yangi buyurtma', href: '/dealer/new-order', icon: ShoppingCart },
                { label: 'Buyurtmalarim', href: '/dealer/orders', icon: Package },
                { label: 'Chat', href: '/dealer/chat', icon: TrendingUp },
              ].map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 'var(--r-lg)',
                    background: 'var(--glass-2)', border: '1px solid var(--glass-border-2)',
                    color: 'var(--text-secondary)', textDecoration: 'none',
                    fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'var(--glass-active)';
                    el.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'var(--glass-2)';
                    el.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{label}</span>
                  <ArrowUpRight size={13} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;
