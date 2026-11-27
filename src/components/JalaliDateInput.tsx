import DatePickerImport from 'react-multi-date-picker'
import type DateObject from 'react-date-object'
import persianImport from 'react-date-object/calendars/persian'
import persianFaImport from 'react-date-object/locales/persian_fa'
import gregorianImport from 'react-date-object/calendars/gregorian'
import gregorianEnImport from 'react-date-object/locales/gregorian_en'

// این کتابخانه‌ها در بیلد نهایی گاهی به‌جای خود تابع، یک آبجکت {default: ...} برمی‌گردانند
// و باعث خطای قرمز React #130 می‌شوند. این تابع هر دو حالت را درست می‌کند.
function unwrap(m: any): any {
  return m && m.default ? m.default : m
}

const DatePicker: any = unwrap(DatePickerImport)
const persian: any = unwrap(persianImport)
const persianFa: any = unwrap(persianFaImport)
const gregorian: any = unwrap(gregorianImport)
const gregorianEn: any = unwrap(gregorianEnImport)

interface Props {
  value: string
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
      onChange={(d: DateObject | DateObject[] | null) => {
        if (!d || Array.isArray(d)) {
          onChange('')
          return
        }
        onChange(toYmd(d.toDate()))
      }}
      calendar={isFa ? persian : gregorian}
      locale={isFa ? persianFa : gregorianEn}
      format="YYYY/MM/DD"
      placeholder={placeholder}
      editable={false}
      className={isDark ? 'bg-dark' : ''}
      containerClassName="w-full"
      inputClass="w-full p-2 rounded border bg-white/80 dark:bg-neutral-800 text-center outline-none focus:ring-2 focus:ring-primary"
    />
  )
}
