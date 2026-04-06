import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import {
  Users,
  Search,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Phone,
  Mail,
} from 'lucide-react';

const AdminDealers: React.FC = () => {
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]       = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    credit_limit: '5000',
  });

  const fetchDealers = async () => {
    setLoading(true);
    try {
      const data: any = await api.get('/dealers');
      setDealers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDealers(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setSaving(true);
    try {
      const payload = {
        ...formData,
        credit_limit: parseFloat(formData.credit_limit),
      };

      if (formData.id) {
        // Edit existing (password is optional on edit)
        await api.put(`/dealers/${formData.id}`, payload);
      } else {
        // Create new
        await api.post('/dealers', payload);
      }
      
      setShowModal(false);
      setFormData({ id: '', name: '', email: '', password: '', phone: '', address: '', credit_limit: '5000' });
      fetchDealers();
    } catch (err) {
      alert('Xatolik: ' + (err as any).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Ushbu diler tizimdan o\'chirilsinmi?')) return;
    try {
      await api.delete(`/dealers/${id}`);
      fetchDealers();
    } catch (err) {
      alert('O\'chirishda xatolik: ' + (err as any).message);
    }
  };

  const openEdit = (d: any) => {
    setFormData({
      id: d.id,
      name: d.name || '',
      email: d.email || '',
      password: '', // Reset password for security on edit
      phone: d.phone || '',
      address: d.address || '',
      credit_limit: String(d.credit_limit || '5000'),
    });
    setShowModal(true);
  };

  const filtered = dealers.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase()) ||
    d.phone?.includes(search)
  );

  return (
    <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Header ───────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dilerlar boshqaruvi</h1>
          <p className="page-subtitle">
            Sizning hamkorlaringiz va ularning moliyaviy holati.&nbsp;
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              color: 'var(--accent-2)', fontWeight: 700 }}>
              {filtered.length} ta diler
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={fetchDealers} disabled={loading}>
            <RefreshCw size={15} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} />
          </button>
          <button className="btn btn-primary" onClick={() => {
            setFormData({ id: '', name: '', email: '', password: '', phone: '', address: '', credit_limit: '5000' });
            setShowModal(true);
          }}>
            <Plus size={16} />
            Yangi diler
          </button>
        </div>
      </div>

      {/* ── Search ───────────────────────────────────── */}
      <div className="input-with-icon" style={{ maxWidth: 360 }}>
        <Search size={16} className="input-icon" />
        <input
          className="input"
          style={{ height: 40, paddingLeft: 40, fontSize: 13 }}
          placeholder="Diler qidirish..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Table ────────────────────────────────────── */}
      <div className="table-wrapper">
        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[0,1,2,3].map(i => (
              <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Users size={48} className="empty-state-icon" />
            <p style={{ fontWeight: 600 }}>Dilerlar topilmadi</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Diler nomi</th>
                <th>Aloqa</th>
                <th>Kredit / Qarz</th>
                <th>Status</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dealer, idx) => {
                const debtRatio = dealer.debt / (dealer.credit_limit || 1);
                const isOverLimit = debtRatio > 0.9;
                return (
                  <tr key={dealer.id} className={`anim-fade-up anim-delay-${Math.min(idx + 1, 4)}`}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 12,
                          background: 'var(--glass-2)', border: '1px solid var(--glass-border-2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 13,
                        }}>
                          {dealer.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700 }}>{dealer.name}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-disabled)' }}>ID: #{dealer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                           <Phone size={11} /> {dealer.phone || 'Noma\'lum'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                           <Mail size={11} /> {dealer.email}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                           <span className="mono">${dealer.debt?.toLocaleString()}</span>
                           <span className="mono" style={{ color: 'var(--text-disabled)' }}>/ ${dealer.credit_limit?.toLocaleString()}</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--glass-2)', borderRadius: 10, overflow: 'hidden', width: 120 }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${Math.min(debtRatio * 100, 100)}%`, 
                            background: isOverLimit ? 'var(--danger)' : debtRatio > 0.7 ? 'var(--warning)' : 'var(--accent-2)',
                            transition: 'width 0.4s'
                          }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      {isOverLimit ? (
                        <span className="badge badge-cancelled"><AlertCircle size={10} /> Limitda</span>
                      ) : (
                        <span className="badge badge-completed"><Check size={10} /> Aktiv</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-icon sm" onClick={() => openEdit(dealer)}>
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="btn btn-danger-ghost btn-icon sm" 
                          onClick={() => handleDelete(dealer.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal ────────────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <form 
            className="modal-content glass-1 anim-scale-in" 
            onClick={e => e.stopPropagation()}
            onSubmit={handleSave}
            style={{ maxWidth: 500 }}
          >
            <div className="modal-header">
              <h3>{formData.id ? 'Dilerni tahrirlash' : 'Yangi diler qo\'shish'}</h3>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">Diler nomi *</label>
                <input required className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label className="input-label">Email *</label>
                  <input required type="email" className="input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Parol {!formData.id && '*'}</label>
                  <input required={!formData.id} type="password" className="input" placeholder={formData.id ? 'Tark etilsa o\'zgarmaydi' : ''} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label className="input-label">Telefon</label>
                  <input className="input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Kredit Limit ($)</label>
                  <input required type="number" className="input mono" value={formData.credit_limit} onChange={e => setFormData({...formData, credit_limit: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Manzil</label>
                <input className="input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? <><span className="btn-spinner" /> Saqlanmoqda...</> : <><Check size={16} /> Saqlash</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <style>{`
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
        .modal-content { width: 100%; border-radius: 24px; overflow: hidden; box-shadow: var(--shadow-lg); }
        .modal-header { padding: 20px 24px; border-bottom: 1px solid var(--glass-border-2); display: flex; align-items: center; justify-content: space-between; }
        .btn-close { background: none; border: none; cursor: pointer; color: var(--text-muted); }
      `}</style>

    </div>
  );
};

export default AdminDealers;
