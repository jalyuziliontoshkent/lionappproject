import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import {
  Calendar,
  CheckCircle2,
  Clock,
  RefreshCw,
  User,
  ClipboardList,
} from 'lucide-react';

interface Task {
  order_id: string;
  order_code: string;
  dealer_name: string;
  item_index: number;
  material_name: string;
  width: number;
  height: number;
  sqm: number;
  notes: string;
  worker_status: string;
  created_at: string;
}

const WorkerTasks: React.FC = () => {
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data: any = await api.get('/worker/tasks');
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleComplete = async (taskId: string, orderId: string, idx: number) => {
    setCompleting(taskId);
    try {
      await api.put(`/worker/tasks/${orderId}/${idx}/complete`);
      await fetchTasks();
    } catch (err) {
      alert('Xatolik yuz berdi: ' + (err as any).message);
    } finally {
      setCompleting(null);
    }
  };

  return (
    <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Header ───────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Mening ishlarim</h1>
          <p className="page-subtitle">Sizga topshirilgan buyurtmalar va vazifalar.</p>
        </div>
        <button className="btn btn-ghost" onClick={fetchTasks} disabled={loading}>
          <RefreshCw size={15} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} />
        </button>
      </div>

      {/* ── Summary ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card glass-1">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon-wrap blue">
              <Clock size={24} />
            </div>
            <div>
              <p className="stat-label">Jarayonda</p>
              <p className="stat-value">{tasks.filter(t => t.worker_status !== 'completed').length}</p>
            </div>
          </div>
        </div>
        <div className="card glass-1">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon-wrap green">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="stat-label">Bugun bajarildi</p>
              <p className="stat-value">{tasks.filter(t => t.worker_status === 'completed').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Task List ────────────────────────────────── */}
      <div className="tasks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 16 }}>
        {loading ? (
          [0,1,2].map(i => (
            <div key={i} className="skeleton" style={{ height: 220, borderRadius: 20 }} />
          ))
        ) : tasks.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state">
              <ClipboardList size={48} className="empty-state-icon" />
              <p>Hozircha vazifalar yo'q</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Admin tomonidan vazifa biriktirilishini kuting</p>
            </div>
          </div>
        ) : (
          tasks.map((task, idx) => {
            const taskId = `${task.order_id}-${task.item_index}`;
            const isDone = task.worker_status === 'completed';

            return (
              <div key={taskId} className={`card anim-fade-up anim-delay-${Math.min(idx+1, 4)} ${isDone ? 'opacity-70' : ''}`}>
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="mono" style={{ fontSize: 12, padding: '2px 8px', borderRadius: 6, background: 'var(--glass-2)' }}>
                      #{task.order_code}
                    </span>
                    <span className="card-title">{task.material_name}</span>
                  </div>
                  {isDone ? (
                    <span className="badge badge-completed">
                      <CheckCircle2 size={12} /> Bajarildi
                    </span>
                  ) : (
                    <span className="badge badge-processing">
                      <Clock size={12} /> Jarayonda
                    </span>
                  )}
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div className="task-info-box">
                      <span className="label">O'lcham</span>
                      <span className="value mono">{task.width} x {task.height} m</span>
                    </div>
                    <div className="task-info-box">
                      <span className="label">Maydon</span>
                      <span className="value mono">{task.sqm.toFixed(2)} m²</span>
                    </div>
                  </div>

                  <div style={{ padding: '10px 12px', borderRadius: 12, background: 'var(--glass-2)', border: '1px solid var(--glass-border-2)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Diler / Mijoz:</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                      <User size={14} style={{ color: 'var(--accent-2)' }} />
                      {task.dealer_name}
                    </div>
                  </div>

                  {task.notes && (
                    <p style={{ fontSize: 12, color: 'var(--warning)', fontStyle: 'italic' }}>
                      <strong>Izoh:</strong> {task.notes}
                    </p>
                  ) || <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Izoh yo'q</p>}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, borderTop: '1px solid var(--glass-border-2)', paddingTop: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                      <Calendar size={13} />
                      {new Date(task.created_at).toLocaleDateString('uz-UZ')}
                    </div>
                    {!isDone && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleComplete(taskId, task.order_id, task.item_index)}
                        disabled={completing === taskId}
                      >
                        {completing === taskId ? (
                          <span className="btn-spinner" />
                        ) : (
                          <><CheckCircle2 size={14} /> Bajarildi deb belgilash</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .task-info-box {
          padding: 8px 12px;
          border-radius: 12px;
          background: var(--glass-2);
          border: 1px solid var(--glass-border-2);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .task-info-box .label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .task-info-box .value {
          font-size: 14px;
          font-weight: 700;
        }
        .opacity-70 { opacity: 0.7; }
      `}</style>
    </div>
  );
};

export default WorkerTasks;
