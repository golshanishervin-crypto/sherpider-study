import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Calendar } from 'react-multi-date-picker'
import DateObject from 'react-date-object'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { BookOpen, Calendar as CalIcon, Clock, Users } from 'lucide-react'

export default function CalendarPage({ user }: { user: any }) {
  const [selectedDate, setSelectedDate] = useState<any>(new DateObject())
  const selectedDateStr = selectedDate ? selectedDate.toDate().toISOString().slice(0, 10) : ''
  const [events, setEvents] = useState<any>({ hw: [], ex: [], ss: [], act: [] })

  useEffect(() => {
    const fetchEvents = async () => {
      const { data: hw } = await supabase.from('homework').select('*').eq('user_id', user.id).gte('due_date', selectedDateStr + 'T00:00:00').lte('due_date', selectedDateStr + 'T23:59:59')
      const { data: ex } = await supabase.from('exams').select('*').eq('user_id', user.id).gte('exam_date', selectedDateStr + 'T00:00:00').lte('exam_date', selectedDateStr + 'T23:59:59')
      const { data: ss } = await supabase.from('study_sessions').select('*').eq('user_id', user.id).gte('date', selectedDateStr + 'T00:00:00').lte('date', selectedDateStr + 'T23:59:59')
      const { data: act } = await supabase.from('activities').select('*').eq('user_id', user.id).eq('date', selectedDateStr)
      setEvents({ hw: hw || [], ex: ex || [], ss: ss || [], act: act || [] })
    }
    if (user.id) fetchEvents()
  }, [user.id, selectedDateStr])

  const totalStudyMins = events.ss.reduce((sum: number, s: any) => sum + s.duration_minutes, 0)

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold">تقویم من 📅</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card flex justify-center items-center p-4 bg-white dark:bg-neutral-900 shadow-lg">
          <Calendar value={selectedDate} onChange={setSelectedDate} calendar={persian} locale={persian_fa} className="bg-transparent border-none text-ink dark:text-white" />
        </div>
        <div className="space-y-4">
          <div className="card bg-primary/5 border-primary/20">
            <h3 className="font-bold text-lg mb-2 text-primary">رویدادهای {selectedDate ? selectedDate.format('dddd، DD MMMM YYYY') : 'امروز'}</h3>
            <p className="text-sm text-gray-500">مجموع مطالعه این روز: <span className="font-bold text-primary">{totalStudyMins} دقیقه</span></p>
          </div>
          <div className="space-y-3">
            {events.hw.map((hw: any) => (
              <div key={'hw-'+hw.id} className="card flex items-center gap-3 p-3 border-r-4 border-r-blue-500"><div className="bg-blue-100 text-blue-600 p-2 rounded-full"><BookOpen size={18}/></div><div><p className="font-bold text-sm">{hw.title}</p><p className="text-xs text-gray-500">تکلیف {hw.subject}</p></div></div>
            ))}
            {events.ex.map((ex: any) => (
              <div key={'ex-'+ex.id} className="card flex items-center gap-3 p-3 border-r-4 border-r-red-500"><div className="bg-red-100 text-red-600 p-2 rounded-full"><CalIcon size={18}/></div><div><p className="font-bold text-sm">{ex.title}</p><p className="text-xs text-gray-500">امتحان {ex.subject}</p></div></div>
            ))}
            {events.act.map((act: any) => (
              <div key={'act-'+act.id} className="card flex items-center gap-3 p-3 border-r-4 border-r-purple-500"><div className="bg-purple-100 text-purple-600 p-2 rounded-full"><Users size={18}/></div><div><p className="font-bold text-sm">{act.title}</p><p className="text-xs text-gray-500">{act.category} - {act.start_time}</p></div></div>
            ))}
            {events.ss.map((s: any) => (
<div key={'ss-'+s.id} className="card flex items-center gap-3 p-3 border-r-4 border-r-green-500"><div className="bg-green-100 text-green-600 p-2 rounded-full"><Clock size={18}/></div><div><p className="font-bold text-sm">مطالعه {s.subject}</p><p className="text-xs text-gray-500">{s.duration_minutes} دقیقه</p></div></div>
            ))}
            {events.hw.length === 0 && events.ex.length === 0 && events.ss.length === 0 && events.act.length === 0 && (
              <div className="text-center py-10 text-gray-400">رویدادی برای این روز نیست.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}