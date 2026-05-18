import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  Database,
  Search,
  Plus,
  Mail,
  Smartphone,
  ChevronRight,
  LogOut,
  Save,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Settings() {
  const { profile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'User Profile', icon: User },
    { id: 'branches', name: 'Gym Branches', icon: MapPin },
    { id: 'staff', name: 'Staff Management', icon: ShieldCheck },
    { id: 'notifications', name: 'Alerts & Settings', icon: Bell },
    { id: 'database', name: 'System & Backup', icon: Database },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-zinc-500 mt-1">Configure your gym configurations and manage your account.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <aside className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-white text-black shadow-lg" 
                  : "text-zinc-500 hover:text-white hover:bg-zinc-800"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-zinc-800">
             <button 
               onClick={logout}
               className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all"
             >
               <LogOut className="w-5 h-5" />
               Sign Out
             </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
          >
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                  <div className="w-24 h-24 bg-zinc-800 rounded-3xl flex items-center justify-center border border-zinc-700 shadow-xl">
                    <User className="w-12 h-12 text-zinc-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{profile?.displayName}</h3>
                    <p className="text-zinc-500">{profile?.email}</p>
                    <div className="inline-flex mt-2 px-3 py-1 bg-white text-black rounded-lg text-[10px] font-black uppercase tracking-wider">
                      {profile?.role} Role
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Full Display Name</label>
                      <input 
                        defaultValue={profile?.displayName}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white/20"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Contact Email</label>
                      <input 
                        disabled
                        defaultValue={profile?.email}
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 outline-none opacity-50 cursor-not-allowed"
                      />
                   </div>
                </div>
                
                <div className="pt-4">
                   <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all">
                     <Save className="w-4 h-4" /> Save Changes
                   </button>
                </div>
              </div>
            )}

            {activeTab === 'branches' && (
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Branch Management</h3>
                    <button className="p-2 bg-white text-black rounded-lg shadow hover:bg-zinc-200 transition-all">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { name: 'DHA Phase 6, Lahore', phone: '+92 42 1234567', type: 'Primary' },
                      { name: 'Gulberg 3, Islamabad', phone: '+92 51 0000000', type: 'Hub' },
                    ].map(branch => (
                      <div key={branch.name} className="flex items-center justify-between p-6 bg-zinc-800 rounded-2xl border border-zinc-700 hover:border-zinc-500 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-white transition-all">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-100">{branch.name}</h4>
                            <p className="text-xs text-zinc-500 font-medium">{branch.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-900 px-2 py-1 rounded">
                            {branch.type}
                          </span>
                          <ChevronRight className="w-5 h-5 text-zinc-700" />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-8">
                 <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-start gap-4">
                    <AlertCircleIcon className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                    <div>
                       <h4 className="font-bold text-orange-500">Scheduled Data Backups</h4>
                       <p className="text-xs text-orange-500/70 mt-1 leading-relaxed">
                         System performs automatic daily backups of members, transactions, and settings. 
                         Point-in-time recovery is active for the last 7 days.
                       </p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                            <FileSpreadsheet className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold">Manual JSON Export</h4>
                            <p className="text-xs text-zinc-500">Export all branch data to a portable secure file.</p>
                          </div>
                       </div>
                       <button className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold hover:bg-zinc-700 transition-all">
                          Generate Export
                       </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/20 rounded-lg text-green-500">
                            <Database className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold">Cold Storage (Archives)</h4>
                            <p className="text-xs text-zinc-500">Access history older than 2 fiscal years.</p>
                          </div>
                       </div>
                       <button className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold hover:bg-zinc-700 transition-all">
                          View Archives
                       </button>
                    </div>
                 </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function AlertCircleIcon(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
