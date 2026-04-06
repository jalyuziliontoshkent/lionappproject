import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import {
  Package,
  User,
  CheckCircle2,
  Clock,
  Truck,
  Search,
  RefreshCw,
  UserPlus,
  XCircle,
  X,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; icon: React.ElementType; cls: string }> = {
  kutilmoqda:    { color: 'var(--warning)', bg: 'var(--warning-bg)', label: 'Kutilmoqda',    icon: Clock,        cls: 'badge-pending'    },
  tasdiqlangan:  { color: 'var(--info)',    bg: 'var(--info-bg)',    label: 'Tasdiqlangan', icon: CheckCircle2, cls: 'badge-processing' },
  tayyorlanmoqda:{ color: 'var(--info)',    bg: 'var(--info-bg)',    label: 'Tayyorlanmoqda',icon: Package,      cls: 'badge-processing' },
  tayyor:        { color: 'var(--success)', bg: 'var(--success-bg)',label: 'Tayyor',         icon: CheckCircle2, cls: 'badge-completed'  },
  yetkazilmoqda: { color: 'var(--purple)',  bg: 'var(--purple-bg)', label: "Yo'lda",         icon: Truck,        cls: 'badge-delivered'  },
  yetkazildi:    { color: 'var(--success)', bg: 'var(--success-bg)',label: 'Etkazib berildi', icon: CheckCircle2, cls: 'badge-completed'  },
  rad_etilgan:   { color: 'var(--danger)',  bg: 'var(--danger-bg)', label: 'Rad etilgan',    icon: XCircle,      cls: 'badge-cancelled'  },
};

const ALL_STATUSES = ['all', 'kutilmoqda', 'tasdiqlangan', 'tayyorlanmoqda', 'tayyor', 'yetkazilmoqda', 'rad_etilgan'];

const AdminOrders: React.FC = () => {
  const [orders, setOrders]       = useState<any[]>([]);
  const [workers, setWorkers]     = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [selectedItemIdx, setSelectedItemIdx] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data: any = await api.get('/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const data: any = await api.get('/workers');
      setWorkers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { 
    fetchOrders(); 
    fetchWorkers();
  }, []);

  const handleUpdateStatus = async (oid: string, newStatus: string) => {
    try {
      await api.put(`/orders/${oid}/status`, { status: newStatus });
      fetchOrders();
      setShowStatusModal(false);
    } catch (err) {
      alert('Statusni yangilashda xatolik: ' + (err as any).message);
    }
  };

  const handleAssignWorker = async (workerId: string) => {
    if (!selectedOrder || selectedItemIdx === null) return;
    try {
      await api.put(`/orders/${selectedOrder.id}/items/${selectedItemIdx}/assign`, { worker_id: workerId });
      fetchOrders();
      setShowWorkerModal(false);
    } catch (err) {
      alert('Ishchi biriktirishda xatolik: ' + (err as any).message);
    }
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search
      || o.dealer_name?.toLowerCase().includes(search.toLowerCase())
      || o.order_code?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.kutilmoqda;
    const Icon = cfg.icon;
    return (
      <span className={`badge ${cfg.cls}`}>
        <Icon size={11} /> {cfg.label}
      </span>
    );
  };

  return (
    <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Header ───────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Buyurtmalar</h1>
          <p className="page-subtitle">
            Tizimdagi barcha dilerlar buyurtmalari.&nbsp;
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              color: 'var(--accent-2)', fontWeight: 700 }}>
              {filtered.length} ta
            </span>
          </p>
        </div>
        <button className="btn btn-ghost" onClick={fetchOrders} disabled={loading}>
          <RefreshCw size={15} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} />
          Yangilash
        </button>
      </div>

      {/* ── Filters ──────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="input-with-icon" style={{ flex: '1', minWidth: 220, maxWidth: 340 }}>
          <Search size={16} className="input-icon" />
          <input
            className="input"
            style={{ height: 40, paddingLeft: 40, fontSize: 13 }}
            placeholder="Diler nomi yoki kod..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ALL_STATUSES.map(s => {
            const cfg = STATUS_CONFIG[s];
            const isActive = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                style={{
                  height: 36, padding: '0 14px', borderRadius: 'var(--r-full)',
                  border: isActive ? `1px solid ${cfg?.color ?? 'var(--glass-border)'}` : '1px solid var(--glass-border-2)',
                  background: isActive ? (cfg?.bg ?? 'var(--glass-active)') : 'var(--glass-2)',
                  color: isActive ? (cfg?.color ?? 'var(--text-primary)') : 'var(--text-secondary)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {s === 'all' ? 'Barchasi' : cfg?.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────── */}
      <div className="table-wrapper">
        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ height: 60, borderRadius: 12 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Package size={44} className="empty-state-icon" />
            <p style={{ fontWeight: 600 }}>Buyurtmalar topilmadi</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID / Kod</th>
                <th>Diler</th>
                <th>Sana</th>
                <th>Jami narx</th>
                <th>Status</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, idx) => (
                <tr key={order.id} className={`anim-fade-up anim-delay-${Math.min(idx + 1, 4)}`}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>
                        #{order.order_code}
                      </span>
                      <span className="mono" style={{ fontSize: 10, color: 'var(--text-disabled)' }}>
                        ID: {String(order.id).slice(-4)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: 'var(--accent-subtle)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <User size={14} style={{ color: 'var(--accent-2)' }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>
                        {order.dealer_name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {new Date(order.created_at).toLocaleDateString('uz-UZ')}
                    </div>
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
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button 
                        className="btn btn-ghost btn-sm" 
                        onClick={() => { setSelectedOrder(order); setShowStatusModal(true); }}
                        style={{ height: 32, padding: '0 10px', fontSize: 11 }}
                      >
                        Status
                      </button>
                      <button 
                        className="btn btn-accent btn-sm" 
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        style={{ height: 32, padding: '0 10px', fontSize: 11 }}
                      >
                        {selectedOrder?.id === order.id ? 'Yopish' : 'Tafsilotlar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Expanded Order Details (Item Assignment) */}
      {selectedOrder && !showStatusModal && (
        <div className="card glass-1 anim-fade-up">
          <div className="card-header">
            <span className="card-title">Buyurtma tarkibi: #{selectedOrder.order_code}</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {selectedOrder.items?.map((item: any, i: number) => (
                <div key={i} className="task-card" style={{ padding: 16, borderRadius: 16, background: 'var(--glass-2)', border: '1px solid var(--glass-border-2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{item.material_name}</span>
                    <span className="mono" style={{ fontSize: 12 }}>{item.width}x{item.height}m</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                    Ishchi: <strong>{item.assigned_worker_name || 'Biriktirilmagan'}</strong>
                  </div>
                  <button 
                    className="btn btn-primary btn-sm" 
                    style={{ width: '100%', height: 36 }}
                    onClick={() => { setSelectedItemIdx(i); setShowWorkerModal(true); }}
                  >
                    <UserPlus size={14} /> Ishchini biriktirish
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal-content glass-1 anim-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h3>Statusni yangilash</h3>
              <button className="btn-close" onClick={() => setShowStatusModal(false)}><X size={18}/></button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.keys(STATUS_CONFIG).map(s => (
                <button 
                  key={s} 
                  className="btn btn-ghost" 
                  style={{ justifyContent: 'flex-start', height: 44 }}
                  onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                >
                  <StatusBadge status={s} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Worker Assignment Modal */}
      {showWorkerModal && (
        <div className="modal-overlay" onClick={() => setShowWorkerModal(false)}>
          <div className="modal-content glass-1 anim-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h3>Ishchi tanlang</h3>
              <button className="btn-close" onClick={() => setShowWorkerModal(false)}><X size={18}/></button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {workers.map(w => (
                <button 
                  key={w.id} 
                  className="btn btn-ghost" 
                  style={{ justifyContent: 'space-between', height: 44 }}
                  onClick={() => handleAssignWorker(w.id)}
                >
                  <span>{w.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{w.specialty}</span>
                </button>
              ))}
              {workers.length === 0 && <p className="empty-state">Ishchilar topilmadi</p>}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content { width: 90%; border-radius: 24px; overflow: hidden; }
        .modal-header { padding: 16px 24px; border-bottom: 1px solid var(--glass-border-2); display: flex; align-items: center; justify-content: space-between; }
        .btn-close { background: none; border: none; cursor: pointer; color: var(--text-muted); }
      `}</style>

    </div>
  );
};

export default AdminOrders;
