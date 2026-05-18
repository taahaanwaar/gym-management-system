import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Calendar, 
  Dumbbell, 
  UserCircle, 
  Settings, 
  LayoutDashboard, 
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Members', href: '/members', icon: Users },
    { name: 'Fee Collection', href: '/fees', icon: CreditCard },
    { name: 'Attendance', href: '/attendance', icon: ClipboardList },
    { name: 'Trainers', href: '/trainers', icon: UserCircle },
    { name: 'Classes', href: '/classes', icon: Calendar },
    { name: 'Workout AI', href: '/workout-gen', icon: Dumbbell },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "min-h-screen flex",
      darkMode ? "bg-black text-gray-100 dark" : "bg-gray-50 text-gray-900"
    )}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static",
        !isSidebarOpen && "-translate-x-full",
        darkMode ? "bg-zinc-900 border-r border-zinc-800" : "bg-white border-r border-gray-200"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-black font-bold text-xl">
              P
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">PakGym</h1>
              <p className="text-xs text-gray-400">Pro Management</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive(item.href)
                    ? (darkMode ? "bg-white text-black" : "bg-black text-white")
                    : (darkMode ? "text-gray-400 hover:bg-zinc-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-black")
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{profile?.displayName}</p>
                <p className="text-xs text-gray-500 truncate">{profile?.role}</p>
              </div>
              <button 
                onClick={logout}
                className="p-1 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className={cn(
          "h-16 flex items-center justify-between px-6 border-b",
          darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>DHA Phase 6, Lahore Branch</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="h-8 w-[1px] bg-zinc-800" />
            <div className="text-sm font-medium">
              {new Date().toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
