import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import {
  Edit2,
  Trash2,
  Package,
  Plus,
  Search,
  Image as ImageIcon,
  X,
  Check,
  RefreshCw,
  Tag,
  AlertCircle,
} from 'lucide-react';

const AdminInventory: React.FC = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [deleteId, setDeleteId]   = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price_per_sqm: '',
    category: '',
    description: '',
    image_url: '',
    stock_quantity: '100',
  });

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const data: any = await api.get('/materials');
      setMaterials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaterials(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price_per_sqm) return;

    setSaving(true);
    try {
      const payload = {
        ...formData,
        price_per_sqm: parseFloat(formData.price_per_sqm),
        stock_quantity: parseFloat(formData.stock_quantity),
      };

      if (formData.id) {
        await api.put(`/materials/${formData.id}`, payload);
      } else {
        await api.post('/materials', payload);
      }
      
      setShowModal(false);
      setFormData({ id: '', name: '', price_per_sqm: '', category: '', description: '', image_url: '', stock_quantity: '100' });
      fetchMaterials();
    } catch (err) {
      alert('Xatolik: ' + (err as any).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Haqiqatdan ham ushbu mahsulotni o\'chirmoqchimisiz?')) return;
    try {
      await api.delete(`/materials/${id}`);
      fetchMaterials();
    } catch (err) {
      alert('O\'chirishda xatolik: ' + (err as any).message);
    }
  };

  const openEdit = (m: any) => {
    setFormData({
      id: m.id,
      name: m.name || '',
      price_per_sqm: String(m.price_per_sqm || ''),
      category: m.category || '',
      description: m.description || '',
      image_url: m.image_url || '',
      stock_quantity: String(m.stock_quantity || '100'),
    });
    setShowModal(true);
  };

  const filtered = materials.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.category?.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(materials.map(m => m.category).filter(Boolean))] as string[];

  return (
    <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Header ───────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Ombor & Inventar</h1>
          <p className="page-subtitle">
            Mavjud matolar va mahsulotlar boshqaruvi.&nbsp;
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              color: 'var(--accent-2)', fontWeight: 700 }}>
              {filtered.length} ta mahsulot
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={fetchMaterials} disabled={loading}>
            <RefreshCw size={15} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} />
          </button>
          <button className="btn btn-primary" onClick={() => {
            setFormData({ id: '', name: '', price_per_sqm: '', category: '', description: '', image_url: '', stock_quantity: '100' });
            setShowModal(true);
          }}>
            <Plus size={16} />
            Yangi mahsulot
          </button>
        </div>
      </div>

      {/* ── Search & Category Tags ───────────────────── */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="input-with-icon" style={{ maxWidth: 320, flex: 1 }}>
          <Search size={16} className="input-icon" />
          <input
            className="input"
            style={{ height: 40, paddingLeft: 40, fontSize: 13 }}
            placeholder="Mahsulot qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setSearch('')}
          >
            <X size={13} /> Tozalash
          </button>
        )}
        {categories.slice(0, 5).map(cat => (
          <button
            key={cat}
            onClick={() => setSearch(cat)}
            className="btn btn-ghost btn-sm"
            style={{ borderRadius: 'var(--r-full)' }}
          >
            <Tag size={11} /> {cat}
          </button>
        ))}
      </div>

      {/* ── Grid ─────────────────────────────────────── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--glass-2)', border: '1px solid var(--glass-border-2)' }}>
              <div className="skeleton" style={{ height: 148, borderRadius: 0 }} />
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="skeleton" style={{ height: 16, borderRadius: 8, width: '70%' }} />
                <div className="skeleton" style={{ height: 12, borderRadius: 6, width: '45%' }} />
                <div className="skeleton" style={{ height: 36, borderRadius: 10 }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Package size={48} className="empty-state-icon" />
            <p style={{ fontWeight: 600 }}>Mahsulotlar topilmadi</p>
            <p>Yangi mahsulot qo'shish yoki qidiruvni o'zgartiring</p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              <Plus size={14} /> Qo'shish
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map((material, idx) => (
            <div
              key={material.id}
              className={`material-card anim-fade-up anim-delay-${Math.min(idx + 1, 4)}`}
              style={{ cursor: 'default' }}
            >
              {/* Image */}
              <div style={{ position: 'relative', overflow: 'hidden', height: 148 }}>
                {material.image_url ? (
                  <img
                    src={material.image_url}
                    alt={material.name}
                    className="material-img"
                    style={{ height: 148 }}
                  />
                ) : (
                  <div className="material-img-placeholder" style={{ height: 148 }}>
                    <ImageIcon size={36} />
                  </div>
                )}
                {material.category && (
                  <div style={{
                    position: 'absolute', top: 12, left: 12,
                    padding: '3px 10px', borderRadius: 'var(--r-full)',
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}>
                    {material.category}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="material-info" style={{ padding: 20 }}>
                <div style={{ marginBottom: 14 }}>
                  <h3 className="material-name" style={{ fontSize: 15, marginBottom: 4 }}>
                    {material.name}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, height: 36, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {material.description || 'Tavsif qo\'shilmagan.'}
                  </p>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '12px 0', borderTop: '1px solid var(--glass-border-2)',
                  marginBottom: 14,
                }}>
                  <div>
                    <p style={{ fontSize: 10, color: 'var(--text-disabled)', textTransform: 'uppercase',
                      fontWeight: 700, letterSpacing: '0.07em', marginBottom: 2 }}>
                      Narxi (m²)
                    </p>
                    <p className="mono" style={{ fontSize: 17, fontWeight: 700, color: 'var(--success)' }}>
                      ${material.price_per_sqm?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: 'var(--text-disabled)', textTransform: 'uppercase',
                      fontWeight: 700, letterSpacing: '0.07em', marginBottom: 2 }}>
                      Zaxira
                    </p>
                    <p className="mono" style={{ fontSize: 17, fontWeight: 700 }}>
                      {material.stock_quantity?.toFixed(0)} {material.unit || 'm'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost" style={{ flex: 1, height: 38, fontSize: 13 }} onClick={() => openEdit(material)}>
                    <Edit2 size={14} /> Tahrirlash
                  </button>
                  <button
                    className="btn btn-danger-ghost btn-icon"
                    style={{ border: '1px solid var(--glass-border-2)' }}
                    onClick={() => handleDelete(material.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── New Product Modal ─────────────────────────── */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 24,
          }}
          onClick={() => setShowModal(false)}
        >
          <form
            className="glass-1 anim-scale-in"
            style={{
              width: '100%', maxWidth: 480, borderRadius: 'var(--r-2xl)',
              overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
            }}
            onClick={e => e.stopPropagation()}
            onSubmit={handleSave}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: '1px solid var(--glass-border-2)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                {formData.id ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
              </h3>
              <button type="button" className="btn btn-ghost btn-icon sm" onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">Mahsulot nomi *</label>
                <input
                  required
                  className="input"
                  placeholder="Masalan: Blackout Parda"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label className="input-label">Narxi ($ / m²) *</label>
                  <input
                    required
                    className="input mono"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price_per_sqm}
                    onChange={e => setFormData({...formData, price_per_sqm: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Kategoriya</label>
                  <input
                    className="input"
                    placeholder="Parda, Jalüzi..."
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Tavsif</label>
                <textarea
                  className="textarea"
                  placeholder="Mahsulot haqida qisqacha ma'lumot..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Rasm URL</label>
                <input
                  className="input"
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={e => setFormData({...formData, image_url: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
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
    </div>
  );
};

export default AdminInventory;
