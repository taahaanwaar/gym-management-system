import React, { useState, useEffect } from 'react';
import { UserCircle, Phone, Mail, Award, Calendar, MoreVertical, Plus, Star } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trainer } from '../types';
import { motion } from 'motion/react';

export default function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const q = query(collection(db, 'trainers'), orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Trainer[];
        setTrainers(list);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Trainer Force</h2>
          <p className="text-zinc-500 mt-1">Manage certified personal trainers and their schedules.</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98]">
          <Plus className="w-5 h-5" />
          Onboard Trainer
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white mb-4"></div>
             Fetching trainer profiles...
          </div>
        ) : trainers.length === 0 ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
             No trainers recorded yet.
          </div>
        ) : trainers.map((trainer, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            key={trainer.id} 
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4">
              <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-zinc-600" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-zinc-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{trainer.name}</h3>
                <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">{trainer.specialties || 'General Fitness'}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Phone className="w-4 h-4" />
                <span>{trainer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Mail className="w-4 h-4" />
                <span className="truncate">{trainer.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Calendar className="w-4 h-4" />
                <span>{trainer.availability || 'Full-time'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">4.9</span>
                <span className="text-xs text-zinc-600 font-medium ml-1">(24 reviews)</span>
              </div>
              <button className="px-4 py-2 bg-zinc-800 hover:bg-white hover:text-black rounded-xl text-xs font-bold transition-all">
                Assignments
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
