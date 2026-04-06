import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import {
  HardHat,
  Search,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  X,
  Check,
  Phone,
  Mail,
  Shield,
  Briefcase,
} from 'lucide-react';

const AdminWorkers: React.FC = () => {
  const [workers, setWorkers] = useState<any[]>([]);
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
    specialty: '',
  });

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const data: any = await api.get('/workers');
      setWorkers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkers(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setSaving(true);
    try {
      if (formData.id) {
        // Edit worker logic (if backend supports PUT /workers, otherwise this is a placeholder)
        await api.put(`/workers/${formData.id}`, formData);
      } else {
        // Create new worker
        await api.post('/workers', formData);
      }
      
      setShowModal(false);
      setFormData({ id: '', name: '', email: '', password: '', phone: '', specialty: '' });
      fetchWorkers();
    } catch (err) {
      alert('Xatolik: ' + (err as any).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Ushbu ishchi o\'chirilsinmi?')) return;
    try {
      await api.delete(`/workers/${id}`);
      fetchWorkers();
    } catch (err) {
      alert('O\'chirishda xatolik: ' + (err as any).message);
    }
  };

  const openEdit = (w: any) => {
    setFormData({
      id: w.id,
      name: w.name || '',
      email: w.email || '',
      password: '', 
      phone: w.phone || '',
      specialty: w.specialty || '',
    });
    setShowModal(true);
  };

  const filtered = workers.filter(w =>
    w.name?.toLowerCase().includes(search.toLowerCase()) ||
    w.email?.toLowerCase().includes(search.toLowerCase()) ||
    w.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Header ───────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Ishchilar tarkibi</h1>
          <p className="page-subtitle">
            Ishlab chiqarish va o'rnatish mutaxassislari boshqaruvi.&nbsp;
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              color: 'var(--accent-2)', fontWeight: 700 }}>
              {filtered.length} ta mutaxassis
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={fetchWorkers} disabled={loading}>
            <RefreshCw size={15} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} />
          </button>
          <button className="btn btn-primary" onClick={() => {
            setFormData({ id: '', name: '', email: '', password: '', phone: '', specialty: '' });
            setShowModal(true);
          }}>
            <Plus size={16} />
            Yangi ishchi
          </button>
        </div>
      </div>

      {/* ── Search ───────────────────────────────────── */}
      <div className="input-with-icon" style={{ maxWidth: 360 }}>
        <Search size={16} className="input-icon" />
        <input
          className="input"
          style={{ height: 40, paddingLeft: 40, fontSize: 13 }}
          placeholder="Mutaxassis qidirish..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Grid/Cards ────────────────────────────────── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {[0,1,2,3].map(i => (
            <div key={i} className="skeleton" style={{ height: 180, borderRadius: 20 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <HardHat size={48} className="empty-state-icon" />
            <p style={{ fontWeight: 600 }}>Ishchilar topilmadi</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map((worker, idx) => (
            <div 
              key={worker.id} 
              className={`card glass-1 anim-fade-up anim-delay-${Math.min(idx + 1, 4)}`}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ 
                height: 4, background: 'linear-gradient(90deg, var(--accent-1), var(--accent-2))',
                width: '100%'
              }} />
              <div className="card-body" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: 'var(--glass-2)', border: '1px solid var(--glass-border-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent-2)'
                  }}>
                    <HardHat size={22} />
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-ghost btn-icon sm" onClick={() => openEdit(worker)}>
                      <Edit2 size={13} />
                    </button>
                    <button 
                      className="btn btn-danger-ghost btn-icon sm" 
                      onClick={() => handleDelete(worker.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{worker.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-disabled)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Briefcase size={11} /> {worker.specialty || 'Mutaxassislik yo\'q'}
                  </p>
                </div>

                <div style={{ 
                  display: 'flex', flexDirection: 'column', gap: 6, 
                  paddingTop: 12, borderTop: '1px solid var(--glass-border-2)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
                    <Phone size={11} style={{ opacity: 0.7 }} />
                    {worker.phone || 'Noma\'lum'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                    <Mail size={11} style={{ opacity: 0.7 }} />
                    {worker.email}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ────────────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <form 
            className="modal-content glass-1 anim-scale-in" 
            onClick={e => e.stopPropagation()}
            onSubmit={handleSave}
            style={{ maxWidth: 460 }}
          >
            <div className="modal-header">
              <h3>{formData.id ? 'Ishchini tahrirlash' : 'Yangi ishchi qo\'shish'}</h3>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">Toliq ism *</label>
                <input required className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Email *</label>
                <input required type="email" className="input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <p style={{ fontSize: 11, color: 'var(--text-disabled)', marginTop: 4 }}>
                   Bu email orqali ishchi tizimga kiradi.
                </p>
              </div>
              <div className="input-group">
                <label className="input-label">Parol {!formData.id && '*'}</label>
                <input required={!formData.id} type="password" className="input" placeholder={formData.id ? 'Tark etilsa o\'zgarmaydi' : ''} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label className="input-label">Telefon</label>
                  <input className="input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Mutaxassislik</label>
                  <input className="input" placeholder="Masalan: Jalyuzi o'rnatish" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
                </div>
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

export default AdminWorkers;
