import React, { useEffect, useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  ArrowUpRight,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Mon', entries: 120, revenue: 45000 },
  { name: 'Tue', entries: 150, revenue: 52000 },
  { name: 'Wed', entries: 140, revenue: 48000 },
  { name: 'Thu', entries: 180, revenue: 61000 },
  { name: 'Fri', entries: 170, revenue: 55000 },
  { name: 'Sat', entries: 210, revenue: 75000 },
  { name: 'Sun', entries: 90, revenue: 32000 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeNow: 12,
    overdueFees: 0,
    monthlyRevenue: 0
  });

  const [recentMembers, setRecentMembers] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, these would be aggregate queries or Cloud Functions
    const fetchStats = async () => {
      // Mocking some stats for visual demo, but ready for real data
      setStats({
        totalMembers: 482,
        activeNow: 24,
        overdueFees: 15,
        monthlyRevenue: 1250000
      });

      const membersRef = collection(db, 'members');
      const q = query(membersRef, orderBy('admissionDate', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      const members = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentMembers(members);
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Overview</h2>
          <p className="text-gray-500 mt-1">Real-time performance metrics for your gym branch.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-black font-bold rounded-xl text-sm hover:bg-gray-200 transition-all flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Members', value: stats.totalMembers, icon: Users, trend: '+12% from last month', color: 'blue' },
          { label: 'Revenue (PKR)', value: formatCurrency(stats.monthlyRevenue), icon: TrendingUp, trend: '+8.2% from last month', color: 'green' },
          { label: 'Pending Dues', value: stats.overdueFees, icon: AlertCircle, trend: '5 new this week', color: 'orange' },
          { label: 'Active Today', value: stats.activeNow, icon: Calendar, trend: 'Peak time at 6:00 PM', color: 'purple' },
        ].map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label} 
            className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-zinc-800 rounded-2xl">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-xs text-green-500 font-medium">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {stat.trend.split(' ')[0]}
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            <p className="text-[10px] text-zinc-600 mt-2 font-medium tracking-wide uppercase">{stat.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Revenue Trend</h3>
              <p className="text-xs text-zinc-500">Weekly earnings across all plans</p>
            </div>
            <select className="bg-zinc-800 border-none rounded-lg text-xs font-bold px-3 py-1 text-white">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `Rs.${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#ffffff" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Recent Admissions</h3>
            <Link to="/members" className="text-zinc-500 hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="space-y-6">
            {recentMembers.length > 0 ? recentMembers.map((member: any) => (
              <div key={member.id} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center font-bold">
                  {member.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{member.fullName}</p>
                  <p className="text-xs text-zinc-500">{member.status} • {member.branchId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-green-500">Active</p>
                  <p className="text-[10px] text-zinc-600">May 15</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-500">No recent admissions found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
