import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Activity, Clock, BookOpen, Loader2 } from 'lucide-react'

const COLORS = ['#E53935', '#43A047', '#1E88E5', '#FB8C00', '#8E24AA', '#00ACC1']

export default function StatsPage({ user }: { user: any }) {
  const [statsData, setStatsData] = useState<any>({ barData: [], pieData: [], totalMinutes: 0, totalSessions: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      const { data: sessions } = await supabase.from('study_sessions').select('*').eq('user_id', user.id)
      if (sessions) {
        const last7Days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().slice(0, 10) })
        const barData = last7Days.map(dateStr => {
          const daySessions = sessions.filter(s => s.date.startsWith(dateStr))
          return { name: new Date(dateStr).toLocaleDateString('fa-IR', { weekday: 'short' }), minutes: daySessions.reduce((sum, s) => sum + s.duration_minutes, 0) }
        })
        const subjectMap: { [key: string]: number } = {}
        sessions.forEach(s => { subjectMap[s.subject] = (subjectMap[s.subject] || 0) + s.duration_minutes })
        const pieData = Object.keys(subjectMap).map(sub => ({ name: sub, value: subjectMap[sub] })).sort((a, b) => b.value - a.value)
        setStatsData({ barData, pieData, totalMinutes: sessions.reduce((sum, s) => sum + s.duration_minutes, 0), totalSessions: sessions.length })
      }
      setIsLoading(false)
    }
    if (user.id) fetchStats()
  }, [user.id])

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>

  const totalHours = Math.floor(statsData.totalMinutes / 60)

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold">آمار و نمودارها 📊</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card flex items-center gap-4 p-6 bg-gradient-to-l from-primary/10 to-transparent border-primary/20">
          <div className="p-4 bg-primary text-white rounded-full shadow-lg shadow-primary/30"><Clock size={28} /></div>
          <div><p className="text-gray-500 font-medium">کل زمان مطالعه</p><p className="text-3xl font-bold text-primary">{totalHours} <span className="text-lg font-normal text-gray-500">ساعت</span></p></div>
        </div>
        <div className="card flex items-center gap-4 p-6">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full"><Activity size={28} /></div>
          <div><p className="text-gray-500 font-medium">تعداد جلسات مطالعه</p><p className="text-3xl font-bold">{statsData.totalSessions} <span className="text-lg font-normal text-gray-500">جلسه</span></p></div>
        </div>
      </div>

      <div className="card p-6 bg-white dark:bg-neutral-900">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Activity className="text-primary" size={20}/> عملکرد ۷ روز گذشته</h3>
        <div className="h-64 w-full" dir="ltr">
          {statsData.barData.some((d:any) => d.minutes > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData.barData}><XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} /><Bar dataKey="minutes" fill="#E53935" radius={[6, 6, 0, 0]} barSize={40} /></BarChart>
            </ResponsiveContainer>
          ) : <div className="h-full flex items-center justify-center text-gray-400">داده‌ای برای نمایش نیست.</div>}
        </div>
      </div>
<div className="card p-6 bg-white dark:bg-neutral-900">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><BookOpen className="text-primary" size={20}/> زمان مطالعه به تفکیک دروس</h3>
        <div className="h-72 w-full" dir="ltr">
          {statsData.pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={statsData.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">{statsData.pieData.map((entry:any, index:number) => <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} /><Legend verticalAlign="bottom" height={36} iconType="circle" /></PieChart>
            </ResponsiveContainer>
          ) : <div className="h-full flex items-center justify-center text-gray-400">ابتدا با تایمر مطالعه کن.</div>}
        </div>
      </div>
    </div>
  )
}