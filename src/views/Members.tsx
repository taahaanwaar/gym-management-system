import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  Calendar,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Member } from '../types';
import { formatDate, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Member Form State
  const [newMember, setNewMember] = useState({
    fullName: '',
    cnic: '',
    phone: '',
    email: '',
    gender: 'Male',
    branchId: 'Main Branch',
    status: 'Active'
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'members'), orderBy('admissionDate', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Member[];
      setMembers(list);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'members'), {
        ...newMember,
        admissionDate: Timestamp.now(),
        dueDate: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // Default 1 month
      });
      setIsAddModalOpen(false);
      fetchMembers();
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const filteredMembers = members.filter(m => 
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm) ||
    m.cnic?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Members Directory</h2>
          <p className="text-zinc-500 mt-1">Manage profiles and track subscriptions for all members.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98]"
        >
          <UserPlus className="w-5 h-5" />
          Register New Member
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search by name, CNIC, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-white/20 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-2xl font-medium hover:bg-zinc-800 transition-colors">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Members List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Member</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Plan Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Admission</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                      Loading members database...
                    </div>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No members found matching your search.
                  </td>
                </tr>
              ) : filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center font-bold">
                        {member.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{member.fullName}</p>
                        <p className="text-xs text-zinc-500">CNIC: {member.cnic || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <p className="flex items-center gap-2 text-zinc-300">
                      <Phone className="w-3 h-3" /> {member.phone}
                    </p>
                    <p className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
                      <Mail className="w-3 h-3" /> {member.email || 'No Email'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      member.status === 'Active' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    )}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <p className="font-medium text-zinc-300">Monthly Premium</p>
                    <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Due: {formatDate(member.dueDate)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {formatDate(member.admissionDate)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-zinc-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">New Member Registration</h3>
              <form onSubmit={handleAddMember} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name</label>
                    <input 
                      required
                      type="text"
                      value={newMember.fullName}
                      onChange={(e) => setNewMember({...newMember, fullName: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Phone Number</label>
                    <input 
                      required
                      type="tel"
                      placeholder="03xx-xxxxxxx"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">CNIC (Optional)</label>
                    <input 
                      type="text"
                      placeholder="xxxxx-xxxxxxx-x"
                      value={newMember.cnic}
                      onChange={(e) => setNewMember({...newMember, cnic: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Gender</label>
                    <select 
                      value={newMember.gender}
                      onChange={(e) => setNewMember({...newMember, gender: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white/20"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Branch</label>
                    <select 
                      value={newMember.branchId}
                      onChange={(e) => setNewMember({...newMember, branchId: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white/20"
                    >
                      <option>DHA Phase 6, Lahore</option>
                      <option>Gulberg, Islamabad</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-xl font-bold bg-zinc-800 hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-4 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition-colors"
                  >
                    Complete Registration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
