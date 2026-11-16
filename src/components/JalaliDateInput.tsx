import DatePicker from 'react-multi-date-picker'
import type DateObject from 'react-date-object'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import gregorian from 'react-date-object/calendars/gregorian'
import gregorian_en from 'react-date-object/locales/gregorian_en'

interface Props {
  value: string // مثل 2026-11-14 (همان فرمت input نوع date)
  onChange: (ymd: string) => void
  placeholder?: string
}

const pad = (n: number) => String(n).padStart(2, '0')

function toYmd(d: Date) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}

export default function JalaliDateInput({ value, onChange, placeholder = 'انتخاب تاریخ' }: Props) {
  const isFa = document.documentElement.lang !== 'en'
  const isDark = document.documentElement.classList.contains('dark')

  return (
    <DatePicker
      value={value ? new Date(value.slice(0, 10) + 'T00:00:00') : null}
      onChange={(d) => {
        if (!d || Array.isArray(d)) {
          onChange('')
          return
        }
        onChange(toYmd((d as DateObject).toDate()))
      }}
      calendar={isFa ? persian : gregorian}
      locale={isFa ? persian_fa : gregorian_en}
      format="YYYY/MM/DD"
      placeholder={placeholder}
      editable={false}
      className={isDark ? 'bg-dark' : ''}
      containerClassName="w-full"
      inputClass="w-full p-2 rounded border bg-white/80 dark:bg-neutral-800 text-center outline-none focus:ring-2 focus:ring-primary"
    />
  )
}