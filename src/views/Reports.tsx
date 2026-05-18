import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, FileSpreadsheet, FileText, Filter, TrendingUp, Users, DollarSign, Wallet } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

const revenueData = [
  { month: 'Jan', revenue: 450000, expenses: 320000 },
  { month: 'Feb', revenue: 520000, expenses: 310000 },
  { month: 'Mar', revenue: 480000, expenses: 340000 },
  { month: 'Apr', revenue: 610000, expenses: 350000 },
  { month: 'May', revenue: 750000, expenses: 380000 },
];

const memberPlanData = [
  { name: 'Monthly Basic', value: 150 },
  { name: 'Monthly Premium', value: 200 },
  { name: 'Quarterly Elite', value: 80 },
  { name: 'Annual Pro', value: 50 },
];

const COLORS = ['#ffffff', '#a1a1aa', '#71717a', '#3f3f46'];

export default function Reports() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Business Intelligence</h2>
          <p className="text-zinc-500 mt-1">Comprehensive performance analytics and growth insights.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors">
            <FileSpreadsheet className="w-4 h-4" /> Export CSV
          </button>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors">
            <FileText className="w-4 h-4" /> PDF Report
          </button>
        </div>
      </header>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Gross Revenue', value: formatCurrency(2800000), trend: '+15.4%', icon: DollarSign },
          { label: 'Avg Sale per Head', value: formatCurrency(5800), trend: '+2.1%', icon: Wallet },
          { label: 'Churn Rate', value: '3.2%', trend: '-0.5%', icon: Users },
          { label: 'New Members', value: '45', trend: '+12%', icon: TrendingUp },
        ].map((stat) => (
          <div key={stat.label} className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
             <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-zinc-800 rounded-xl text-zinc-400">
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-green-500">{stat.trend}</span>
             </div>
             <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{stat.label}</p>
             <h4 className="text-xl font-bold mt-1">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Revenue vs Expenses</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full" />
                <span className="text-[10px] font-bold uppercase text-zinc-500">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-zinc-600 rounded-full" />
                <span className="text-[10px] font-bold uppercase text-zinc-500">Expenses</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs.${v/1000}k`} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
                <Bar dataKey="revenue" fill="#ffffff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#52525b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-8">Membership Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={memberPlanData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {memberPlanData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {memberPlanData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <span className="text-sm text-zinc-400 font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value} users</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
