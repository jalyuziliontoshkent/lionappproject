import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Blinds,
  PlusCircle,
  ClipboardList,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState<{ orders?: number; tasks?: number }>({});

  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      try {
        if (user.role === 'admin') {
          const stats: any = await api.get('/statistics');
          setCounts({ orders: stats.pending_orders });
        } else if (user.role === 'worker') {
          const tasks: any = await api.get('/worker/tasks');
          setCounts({ tasks: tasks.filter((t: any) => t.worker_status !== 'completed').length });
        }
      } catch (err) { console.error(err); }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const adminGroups: NavGroup[] = [
    {
      label: 'Asosiy',
      items: [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/orders',    icon: ClipboardList,   label: 'Buyurtmalar', badge: counts.orders },
        { to: '/admin/inventory', icon: Package,         label: 'Ombor' },
      ],
    },
    {
      label: 'Boshqaruv',
      items: [
        { to: '/admin/dealers', icon: Users,        label: 'Dilerlar' },
        { to: '/admin/workers', icon: HardHat,      label: 'Ishchilar' },
        { to: '/admin/chat',    icon: MessageSquare, label: 'Xabarlar' },
      ],
    },
  ];

  const dealerGroups: NavGroup[] = [
    {
      label: 'Asosiy',
      items: [
        { to: '/dealer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/dealer/new-order', icon: PlusCircle,      label: 'Yangi buyurtma' },
        { to: '/dealer/orders',    icon: ClipboardList,   label: 'Buyurtmalarim' },
        { to: '/dealer/chat',      icon: MessageSquare,   label: 'Chat' },
      ],
    },
  ];

  const workerGroups: NavGroup[] = [
    {
      label: 'Ishlar',
      items: [
        { to: '/worker/tasks',     icon: Package,         label: 'Topshiriqlar', badge: counts.tasks },
        { to: '/worker/completed', icon: BarChart3,       label: 'Bajarilganlar' },
      ],
    },
  ];

  const groups =
    user?.role === 'admin'  ? adminGroups  :
    user?.role === 'worker' ? workerGroups : dealerGroups;

  const roleLabel =
    user?.role === 'admin'  ? 'Administrator' :
    user?.role === 'worker' ? 'Ishchi'        : 'Diler';

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'US';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Blinds size={20} color="white" />
          </div>
          {!collapsed && (
            <div>
              <div className="sidebar-logo-text">LION JALYUZI</div>
              <div className="sidebar-logo-sub">B2B Portal</div>
            </div>
          )}
        </div>
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Sidebar collapse"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {groups.map((group) => (
          <React.Fragment key={group.label}>
            {!collapsed && (
              <div className="sidebar-nav-label">{group.label}</div>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-link${isActive ? ' active' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="sidebar-link-icon">
                  <item.icon size={18} />
                </span>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="sidebar-link-badge">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </React.Fragment>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          {!collapsed && (
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'Foydalanuvchi'}</div>
              <div className="sidebar-user-role">{roleLabel}</div>
            </div>
          )}
        </div>
        <button
          className="sidebar-logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          {!collapsed && <span>Chiqish</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
