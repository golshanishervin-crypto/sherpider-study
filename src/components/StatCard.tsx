import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
  delay?: number;
}

export default function StatCard({ title, value, icon: Icon, color, bg, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative overflow-hidden rounded-3xl p-6 bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-xl border border-gray-100 dark:border-white/10 shadow-lg group"
    >
      {/* افکت نور در پس‌زمینه */}
      <div className={"absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-20 rounded-full " + bg + " group-hover:opacity-40 transition-opacity duration-300"}></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-black text-gray-800 dark:text-white">{value}</h3>
        </div>
        <div className={"p-3 rounded-2xl " + bg + " bg-opacity-20 " + color}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
}