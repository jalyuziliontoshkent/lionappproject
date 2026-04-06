import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import {
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  Search,
  RefreshCw,
  ShoppingCart,
  ChevronRight,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType; cls: string }> = {
  pending:    { label: 'Kutilmoqda',    color: 'var(--warning)', bg: 'var(--warning-bg)', icon: Clock,        cls: 'badge-pending'    },
  processing: { label: 'Tayyorlanmoqda',color: 'var(--info)',    bg: 'var(--info-bg)',    icon: Package,      cls: 'badge-processing' },
  completed:  { label: 'Tayyor',        color: 'var(--success)', bg: 'var(--success-bg)', icon: CheckCircle2, cls: 'badge-completed'  },
  delivered:  { label: "Yo'lda",        color: 'var(--purple)',  bg: 'var(--purple-bg)',  icon: Truck,        cls: 'badge-delivered'  },
  cancelled:  { label: 'Bekor qilindi', color: 'var(--danger)',  bg: 'var(--danger-bg)',  icon: XCircle,      cls: 'badge-cancelled'  },
};

const DealerOrders: React.FC = () => {
  const [orders, setOrders]       = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.get('/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.material_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
      <span className={`badge ${cfg.cls}`}>
        <Icon size={11} /> {cfg.label}
      </span>
    );
  };

  // Summary counts
  const counts = Object.keys(STATUS_CONFIG).reduce((acc, key) => {
    acc[key] = orders.filter(o => o.status === key).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Header ───────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Mening buyurtmalarim</h1>
          <p className="page-subtitle">
            Barcha buyurtmalar statusi va tarixi.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={fetchOrders} disabled={loading}>
            <RefreshCw size={15} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} />
          </button>
          <a href="/dealer/new-order" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <ShoppingCart size={15} />
            Yangi buyurtma
          </a>
        </div>
      </div>

      {/* ── Status Summary Cards ──────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {(['all', ...Object.keys(STATUS_CONFIG)] as string[]).slice(0, 5).map(key => {
          const cfg = STATUS_CONFIG[key];
          const count = key === 'all' ? orders.length : counts[key] ?? 0;
          const isActive = statusFilter === key;
          return (
            <button
              key={key}
              onClick={() => setStatus(key)}
              style={{
                padding: '14px 16px', borderRadius: 'var(--r-xl)',
                border: isActive
                  ? `1px solid ${cfg?.color ?? 'var(--glass-border)'}`
                  : '1px solid var(--glass-border-2)',
                background: isActive
                  ? (cfg?.bg ?? 'var(--glass-active)')
                  : 'var(--glass-2)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <p style={{
                fontSize: 22, fontWeight: 800,
                fontFamily: 'JetBrains Mono, monospace',
                color: isActive ? (cfg?.color ?? 'var(--text-primary)') : 'var(--text-primary)',
              }}>{count}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontWeight: 500 }}>
                {key === 'all' ? 'Barchasi' : cfg?.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* ── Search ───────────────────────────────────── */}
      <div className="input-with-icon" style={{ maxWidth: 340 }}>
        <Search size={16} className="input-icon" />
        <input
          className="input"
          style={{ height: 40, paddingLeft: 40, fontSize: 13 }}
          placeholder="Mato nomi bo'yicha qidirish..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Table ────────────────────────────────────── */}
      <div className="table-wrapper">
        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[0,1,2,3].map(i => (
              <div key={i} className="skeleton" style={{ height: 60, borderRadius: 12 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Package size={44} className="empty-state-icon" />
            <p style={{ fontWeight: 600 }}>Buyurtmalar topilmadi</p>
            <p>Yangi buyurtma berish uchun pastdagi tugmani bosing</p>
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
                <th>Mato / Material</th>
                <th>Sana</th>
                <th>O'lcham</th>
                <th>Jami narx</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, idx) => (
                <tr key={order.id} className={`anim-fade-up anim-delay-${Math.min(idx+1, 4)}`}>
                  <td>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      #{String(order.id).slice(-5).toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'var(--glass-2)', border: '1px solid var(--glass-border-2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Package size={16} style={{ color: 'var(--text-muted)' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{order.material_name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {order.quantity ?? 1} ta
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 12, color: 'var(--text-secondary)' }}>
                      <Calendar size={13} />
                      {new Date(order.created_at).toLocaleDateString('uz-UZ')}
                    </div>
                  </td>
                  <td>
                    <span className="mono" style={{ fontWeight: 600, fontSize: 13 }}>
                      {order.total_area} m²
                    </span>
                  </td>
                  <td>
                    <span className="mono" style={{ fontWeight: 700, fontSize: 14, color: 'var(--success)' }}>
                      ${order.total_price?.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-icon sm">
                      <ChevronRight size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DealerOrders;
