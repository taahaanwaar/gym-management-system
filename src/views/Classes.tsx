import React, { useState } from 'react';
import { Calendar, Clock, User, Users, Plus, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MOCK_CLASSES = [
  { id: '1', name: 'Power Yoga', trainer: 'Sarah Ahmed', time: '07:00 AM', duration: '60 min', day: 'Mon', capacity: 20, joined: 12 },
  { id: '2', name: 'HIIT Intensive', trainer: 'Zain Malik', time: '06:00 PM', duration: '45 min', day: 'Mon', capacity: 15, joined: 15 },
  { id: '3', name: 'Strength & Conditioning', trainer: 'Omar Khan', time: '08:00 AM', duration: '90 min', day: 'Tue', capacity: 10, joined: 4 },
  { id: '4', name: 'Kickboxing', trainer: 'Hamza Ali', time: '07:30 PM', duration: '60 min', day: 'Wed', capacity: 12, joined: 8 },
];

export default function Classes() {
  const [selectedDay, setSelectedDay] = useState('Mon');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Class Schedule</h2>
          <p className="text-zinc-500 mt-1">Organize and book group training sessions across branches.</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-zinc-200 transition-all">
          <Plus className="w-5 h-5" />
          Create Class
        </button>
      </header>

      {/* Week Selector */}
      <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-2xl w-full max-w-2xl">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={cn(
              "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
              selectedDay === day ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_CLASSES.filter(c => c.day === selectedDay).map((cls, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={cls.id}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-zinc-800 rounded-2xl group-hover:bg-white group-hover:text-black transition-all">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{cls.time}</p>
                <p className="text-[10px] uppercase font-bold text-zinc-500">{cls.duration}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-1">{cls.name}</h3>
            <p className="text-sm text-zinc-400 flex items-center gap-2 mb-6">
              <User className="w-4 h-4" /> {cls.trainer}
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold uppercase text-zinc-500">Attendance</span>
                <span className="text-sm font-bold">{cls.joined}/{cls.capacity}</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    cls.joined >= cls.capacity ? "bg-red-500" : "bg-white"
                  )}
                  style={{ width: `${(cls.joined / cls.capacity) * 100}%` }}
                />
              </div>
            </div>

            <button 
              disabled={cls.joined >= cls.capacity}
              className={cn(
                "w-full mt-6 py-4 rounded-xl font-bold transition-all",
                cls.joined >= cls.capacity 
                  ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" 
                  : "bg-zinc-800 hover:bg-zinc-700 text-white"
              )}
            >
              {cls.joined >= cls.capacity ? 'Class Full' : 'Book Session'}
            </button>
          </motion.div>
        ))}
        {MOCK_CLASSES.filter(c => c.day === selectedDay).length === 0 && (
          <div className="col-span-full py-20 text-center bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-zinc-800" />
            <p className="text-zinc-500 font-medium">No classes scheduled for {selectedDay}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
