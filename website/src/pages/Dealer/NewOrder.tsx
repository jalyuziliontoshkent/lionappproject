import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import {
  Plus,
  ShoppingCart,
  Trash2,
  Calculator,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface CartItem {
  id: number;
  material_id: string;
  material_name: string;
  width: number;
  height: number;
  quantity: number;
  sqm: number;
  price: number;
}

const NewOrder: React.FC = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [cart, setCart]           = useState<CartItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

  const [width, setWidth]       = useState('1.50');
  const [height, setHeight]     = useState('2.00');
  const [quantity, setQuantity] = useState('1');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data: any = await api.get('/materials');
        setMaterials(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const calcArea  = (w: string, h: string) => Math.max(parseFloat(w) * parseFloat(h), 1.0);
  const calcPrice = (m: any, w: string, h: string, q: string) => {
    if (!m) return 0;
    return calcArea(w, h) * m.price_per_sqm * parseInt(q || '1');
  };

  const addToCart = () => {
    if (!selectedMaterial) return;
    const item: CartItem = {
      id: Date.now(),
      material_id: selectedMaterial.id,
      material_name: selectedMaterial.name,
      width: parseFloat(width),
      height: parseFloat(height),
      quantity: parseInt(quantity),
      sqm: calcArea(width, height),
      price: calcPrice(selectedMaterial, width, height, quantity),
    };
    setCart(prev => [...prev, item]);
    setSelectedMaterial(null);
    setWidth('1.50'); setHeight('2.00'); setQuantity('1');
  };

  const removeItem = (id: number) => setCart(prev => prev.filter(i => i.id !== id));

  const totalAmount = cart.reduce((sum, i) => sum + i.price, 0);
  const totalArea   = cart.reduce((sum, i) => sum + (i.sqm * i.quantity), 0);

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      await api.post('/orders', { items: cart });
      setSubmitted(true);
      setCart([]);
    } catch (err) {
      alert('Buyurtma yuborishda xatolik: ' + (err as any).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="anim-scale-in" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', gap: 24, textAlign: 'center',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 40,
          background: 'var(--success-bg)', color: 'var(--success)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px var(--success-bg)',
        }}>
          <CheckCircle2 size={40} />
        </div>
        <div>
          <h1 className="page-title">Muvaffaqiyatli!</h1>
          <p className="page-subtitle">Buyurtmangiz qabul qilindi va ko'rib chiqilmoqda.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
          <RotateCcw size={16} /> Yangi buyurtma
        </button>
      </div>
    );
  }

  return (
    <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>

      {/* ── Left Column: Material Selection ───────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Yangi Buyurtma</h1>
            <p className="page-subtitle">Mato tanlang va o'lchamlarni kiriting.</p>
          </div>
        </div>

        <div className="materials-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20
        }}>
          {loading ? (
            [0,1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 260, borderRadius: 20 }} />)
          ) : (
            materials.map((m, idx) => (
              <div
                key={m.id}
                className={`material-select-card glass-1 anim-fade-up anim-delay-${Math.min(idx+1, 4)} ${selectedMaterial?.id === m.id ? 'active' : ''}`}
                onClick={() => setSelectedMaterial(m)}
              >
                <div className="material-img-wrap">
                  {m.image_url ? <img src={m.image_url} alt={m.name} /> : <div className="placeholder"><ImageIcon size={32}/></div>}
                  <div className="material-price-badge">${m.price_per_sqm}/m²</div>
                </div>
                <div className="material-info">
                  <h3 className="name">{m.name}</h3>
                  <p className="cat">{m.category || 'Mato'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Right Column: Calculator & Cart ────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Calculator */}
        <div className="card glass-1 sticky" style={{ top: 24 }}>
          <div className="card-header">
            <span className="card-title">Kalkulyator</span>
            <Calculator size={18} style={{ color: 'var(--accent-2)' }} />
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!selectedMaterial ? (
              <div className="alert-info">
                <Sparkles size={16} /> Mato tanlang
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="input-group">
                    <label className="input-label">Eni (m)</label>
                    <input className="input mono" type="number" step="0.01" value={width} onChange={e => setWidth(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Bo'yi (m)</label>
                    <input className="input mono" type="number" step="0.01" value={height} onChange={e => setHeight(e.target.value)} />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Soni</label>
                  <input className="input mono" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
                </div>

                <div className="price-preview">
                  <div className="price-row">
                    <span>Maydon (min 1m²):</span>
                    <span className="mono">{calcArea(width, height).toFixed(2)} m²</span>
                  </div>
                  <div className="price-row total">
                    <span>Narxi:</span>
                    <span className="mono">${calcPrice(selectedMaterial, width, height, quantity).toFixed(2)}</span>
                  </div>
                </div>

                <button className="btn btn-primary" onClick={addToCart}>
                  <Plus size={16} /> Savatga qo'shish
                </button>
              </>
            )}
          </div>

          {/* Cart */}
          {cart.length > 0 && (
            <div style={{ borderTop: '1px solid var(--glass-border-2)', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <ShoppingCart size={18} />
                <span style={{ fontWeight: 700, fontSize: 14 }}>Savat ({cart.length})</span>
              </div>
              <div className="cart-items" style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cart.map(item => (
                  <div key={item.id} className="cart-item glass-2">
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 700 }}>{item.material_name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.width}x{item.height}m x {item.quantity}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="mono" style={{ fontSize: 13, fontWeight: 700 }}>${item.price.toFixed(2)}</p>
                      <button className="btn-text-danger" onClick={() => removeItem(item.id)}><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px dotted var(--glass-border-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Jami:</span>
                  <span className="mono" style={{ fontSize: 18, fontWeight: 800, color: 'var(--success)' }}>${totalAmount.toFixed(2)}</span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', height: 44 }} onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <span className="btn-spinner" /> : <><CheckCircle2 size={18} /> Buyurtma berish</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .material-select-card { 
          border-radius: 20px; overflow: hidden; cursor: pointer; transition: all 0.3s;
          border: 1px solid var(--glass-border-2);
        }
        .material-select-card:hover { transform: translateY(-4px); border-color: var(--accent-1); }
        .material-select-card.active { border: 2px solid var(--accent-1); box-shadow: 0 0 20px rgba(96, 165, 250, 0.2); }
        .material-img-wrap { height: 160px; position: relative; background: var(--glass-2); }
        .material-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .material-price-badge { 
          position: absolute; bottom: 10px; right: 10px; padding: 4px 10px; 
          background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); border-radius: 10px;
          color: white; font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700;
        }
        .material-info { padding: 12px 16px; }
        .material-info .name { font-size: 14px; font-weight: 700; margin: 0; }
        .material-info .cat { font-size: 11px; color: var(--text-muted); margin: 2px 0 0; }
        
        .price-preview { background: var(--glass-2); padding: 16px; border-radius: 16px; border: 1px solid var(--glass-border-2); }
        .price-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
        .price-row.total { margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--glass-border-2); color: var(--text-primary); font-weight: 700; font-size: 14px; }
        
        .cart-item { display: flex; align-items: center; padding: 10px 14px; border-radius: 14px; border: 1px solid var(--glass-border-2); }
        .btn-text-danger { background: none; border: none; color: var(--danger); cursor: pointer; padding: 4px; opacity: 0.7; }
        .btn-text-danger:hover { opacity: 1; }
        
        .sticky { position: sticky; top: 24px; }
        .alert-info { background: var(--accent-subtle); color: var(--accent-2); padding: 12px; border-radius: 12px; font-size: 12px; display: flex; alignItems: center; gap: 8px; font-weight: 600; }
      `}</style>
    </div>
  );
};

export default NewOrder;
