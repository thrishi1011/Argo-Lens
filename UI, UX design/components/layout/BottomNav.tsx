import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Bell, Gauge, User } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/alerts', icon: Bell, label: 'Alerts' },
  { path: '/sensors', icon: Gauge, label: 'Sensors' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-all ${isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`rounded-lg p-1.5 transition-colors ${isActive ? 'bg-primary/10' : ''
                    }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
