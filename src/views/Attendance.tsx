import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar,
  UserCheck,
  UserX,
  History
} from 'lucide-react';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Attendance, Member } from '../types';
import { formatDate, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AttendanceView() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberSearch, setMemberSearch] = useState('');
  const [foundMembers, setFoundMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, 'attendance'), 
        where('date', '==', today),
        orderBy('checkInTime', 'desc')
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Attendance[];
      setAttendance(list);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchMembers = async (val: string) => {
    setMemberSearch(val);
    if (val.length < 3) {
      setFoundMembers([]);
      return;
    }
    const q = query(collection(db, 'members'), where('fullName', '>=', val), where('fullName', '<=', val + '\uf8ff'), limit(5));
    const snapshot = await getDocs(q);
    const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Member[];
    setFoundMembers(members);
  };

  const handleCheckIn = async (member: Member) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      // Check if already checked in today
      const existing = attendance.find(a => a.userId === member.id && a.date === today);
      if (existing) {
        alert("Member already checked in today.");
        return;
      }

      await addDoc(collection(db, 'attendance'), {
        userId: member.id,
        userName: member.fullName,
        userRole: 'Member',
        date: today,
        checkInTime: serverTimestamp(),
        branchId: 'Main Branch'
      });
      
      setMemberSearch('');
      setFoundMembers([]);
      fetchTodayAttendance();
    } catch (error) {
      console.error("Check-in error:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance Logs</h2>
          <p className="text-zinc-500 mt-1">Real-time check-ins and traffic monitoring.</p>
        </div>
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-1">
          <button className="px-4 py-2 bg-zinc-800 rounded-xl text-xs font-bold uppercase transition-all">Today</button>
          <button className="px-4 py-2 text-zinc-500 text-xs font-bold uppercase hover:text-white transition-all">History</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Check-in Interface */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-500" />
              Quick Check-In
            </h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="text"
                placeholder="Scan CNIC or enter Name..."
                value={memberSearch}
                onChange={(e) => searchMembers(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div className="mt-4 space-y-2">
              <AnimatePresence>
                {foundMembers.map(member => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-zinc-800/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all cursor-pointer group"
                    onClick={() => handleCheckIn(member)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-xs font-bold">
                        {member.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{member.fullName}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{member.cnic || 'CNIC: N/A'}</p>
                      </div>
                    </div>
                    <button className="p-2 bg-white text-black rounded-lg scale-0 group-hover:scale-100 transition-all">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {memberSearch.length >= 3 && foundMembers.length === 0 && (
                <p className="text-center py-4 text-xs text-zinc-600 font-medium">No matching members found.</p>
              )}
            </div>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Today's Peak Hours</h4>
            <div className="space-y-4">
              {[
                { time: '06:00 AM - 09:00 AM', count: 42, color: 'blue' },
                { time: '05:00 PM - 09:00 PM', count: 85, color: 'orange' },
                { time: '09:00 PM - 11:00 PM', count: 28, color: 'purple' },
              ].map(peak => (
                <div key={peak.time}>
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                    <span className="text-zinc-400">{peak.time}</span>
                    <span className="text-white">{peak.count} Entries</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${peak.color}-500`} 
                      style={{ width: `${(peak.count / 100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Feed */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden min-h-full">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-zinc-500" />
                Latest Footfall
              </h3>
              <div className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-bold uppercase">Live</div>
            </div>
            
            <div className="divide-y divide-zinc-800">
              {attendance.length === 0 && !loading ? (
                <div className="p-20 text-center text-zinc-600">
                  <UserX className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-medium">No check-ins recorded today yet.</p>
                </div>
              ) : attendance.map((entry: any) => (
                <div key={entry.id} className="p-6 flex items-center gap-4 hover:bg-zinc-800/30 transition-all">
                  <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold">{entry.userName}</h4>
                      <span className="text-[10px] font-bold text-zinc-500 font-mono">
                        #{entry.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-zinc-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> DHA Phase 6
                      </p>
                      <p className="text-xs text-zinc-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {entry.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">
                      {entry.checkInTime?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '...' }
                    </p>
                    <p className="text-[10px] font-bold text-green-500 uppercase mt-1">Check-In</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="p-12 text-center text-zinc-500">Syncing with server...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
