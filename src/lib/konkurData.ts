export interface KonkurQuestion {
  id: number
  year: string
  field: string
  subject: string
  question: string
  options: string[]
  correct: number // 0 to 3
}

export interface KonkurExam {
  year: string
  title: string
  description: string
  pdfLink: string
  answersLink: string | null
  mockQuestions: KonkurQuestion[]
}

export const KONKUR_EXAMS: KonkurExam[] = [
  // ================= ۱۴۰۴ =================
  {
    year: '۱۴۰۴',
    title: 'کنکور سراسری ۱۴۰۴ (ریاضی)',
    description: 'دفترچه سوالات و پاسخنامه تشریحی',
    pdfLink: 'https://dl3.riazisara.ir/download/konkoor/dakhel/riazi/soal-konkoor-riazi140404-d1.pdf',
    answersLink: 'https://riazisara.ir/%d8%ad%d9%84-%d8%aa%d8%b4%d8%b1%db%8c%d8%ad%db%8c-%d8%b3%d9%88%d8%a7%d9%84%d8%a7%d8%aa-%da%a9%d9%86%da%a9%d9%88%d8%b1-%d8%aa%d8%ac%d8%b1%d8%a8%db%8c-%d8%aa%db%8c%d8%b1-%d9%85%d8%a7%d9%87-1404/',
    mockQuestions: [
      { id: 1, year: '۱۴۰۴', field: 'ریاضی', subject: 'حسابان', question: 'حاصل حد (sin x)/x وقتی x به سمت صفر میل می‌کند، چیست؟', options: ['صفر', '۱', 'بی‌نهایت', 'وجود ندارد'], correct: 1 },
      { id: 2, year: '۱۴۰۴', field: 'ریاضی', subject: 'هندسه', question: 'در یک مثلث قائم‌الزاویه، اگر اضلاع قائمه ۳ و ۴ باشند، وتر چند است؟', options: ['۵', '۶', '۷', '۲۵'], correct: 0 },
      { id: 3, year: '۱۴۰۴', field: 'ریاضی', subject: 'فیزیک', question: 'کدام کمیت زیر برداری است؟', options: ['جرم', 'زمان', 'سرعت', 'دما'], correct: 2 },
      { id: 4, year: '۱۴۰۴', field: 'ریاضی', subject: 'شیمی', question: 'تعداد مولکول‌های موجود در ۱ مول آب چند است؟', options: ['۶.۰۲ × ۱۰^۲۳', '۱', '۱۸', '۳.۱۴'], correct: 0 },
      { id: 5, year: '۱۴۰۴', field: 'ریاضی', subject: 'گسسته', question: 'اگر گرافی ۴ راس داشته باشد، حداکثر چند یال می‌تواند داشته باشد؟', options: ['۴', '۵', '۶', '۸'], correct: 2 },
      { id: 6, year: '۱۴۰۴', field: 'ریاضی', subject: 'حسابان', question: 'مشتق تابع f(x) = x^2 + 3x در نقطه x=1 چقدر است؟', options: ['۳', '۴', '۵', '۶'], correct: 2 },
      { id: 7, year: '۱۴۰۴', field: 'ریاضی', subject: 'هندسه', question: 'مساحت دایره‌ای به شعاع ۳ چقدر است؟', options: ['۳π', '۶π', '۹π', '۱۲π'], correct: 2 },
      { id: 8, year: '۱۴۰۴', field: 'ریاضی', subject: 'فیزیک', question: 'واحد اندازه‌گیری توان در سیستم SI چیست؟', options: ['ژول', 'وات', 'نیوتن', 'پاسکال'], correct: 1 },
      { id: 9, year: '۱۴۰۴', field: 'ریاضی', subject: 'شیمی', question: 'کدام یک از گازهای زیر گاز نجیب است؟', options: ['اکسیژن', 'نیتروژن', 'آرگون', 'هیدروژن'], correct: 2 },
      { id: 10, year: '۱۴۰۴', field: 'ریاضی', subject: 'گسسته', question: 'در پرتاب دو تاس، احتمال اینکه مجموع اعداد ۷ باشد چقدر است؟', options: ['۱/۶', '۱/۱۲', '۱/۹', '۱/۴'], correct: 0 },
    ]
  },
  {
    year: '۱۴۰۴ - تجربی',
    title: 'کنکور سراسری ۱۴۰۴ (تجربی)',
    description: 'دفترچه سوالات و پاسخنامه تشریحی',
    pdfLink: 'https://dl3.riazisara.ir/download/konkoor/dakhel/tajrobi/soal-konkoor-tajrobi140404-d1.pdf',
    answersLink: 'https://riazisara.ir/%d8%ad%d9%84-%d8%aa%d8%b4%d8%b1%db%8c%d8%ad%db%8c-%d8%b3%d9%88%d8%a7%d9%84%d8%a7%d8%aa-%da%a9%d9%86%da%a9%d9%88%d8%b1-%d8%aa%d8%ac%d8%b1%d8%a8%db%8c-%d8%aa%db%8c%d8%b1-%d9%85%d8%a7%d9%87-1404/',
    mockQuestions: [
      { id: 11, year: '۱۴۰۴', field: 'تجربی', subject: 'زیست', question: 'کدام بخش از مغز مرکز تنظیم تنفس است؟', options: ['مخچه', 'بصل النخاع', 'هیپوتالاموس', 'تالاموس'], correct: 1 },
      { id: 12, year: '۱۴۰۴', field: 'تجربی', subject: 'شیمی', question: 'کدام یک از موارد زیر یک اسید قوی است؟', options: ['استیک اسید', 'کربنیک اسید', 'هیدروکلریک اسید', 'سیتریک اسید'], correct: 2 },
      { id: 13, year: '۱۴۰۴', field: 'تجربی', subject: 'فیزیک', question: 'واحد اندازه‌گیری مقاومت الکتریکی چیست؟', options: ['آمپر', 'ولت', 'اهم', 'وات'], correct: 2 },
      { id: 14, year: '۱۴۰۴', field: 'تجربی', subject: 'ریاضی', question: 'حاصل ۲ به توان ۵ منهای ۳ برابر ۴ چند است؟', options: ['۲۰', '۲۴', '۲۸', '۳۲'], correct: 0 },
{ id: 15, year: '۱۴۰۴', field: 'تجربی', subject: 'زیست', question: 'کدام هورمون توسط پانکراس ترشح می‌شود؟', options: ['تیروکسین', 'انسولین', 'آدرنالین', 'استروژن'], correct: 1 },
      { id: 16, year: '۱۴۰۴', field: 'تجربی', subject: 'شیمی', question: 'کدام یک از ترکیبات زیر آلی است؟', options: ['NaCl', 'H2O', 'CH4', 'CO2'], correct: 2 },
      { id: 17, year: '۱۴۰۴', field: 'تجربی', subject: 'فیزیک', question: 'نور در کدام محیط با بیشترین سرعت حرکت می‌کند؟', options: ['هوا', 'آب', 'شیشه', 'خلأ'], correct: 3 },
      { id: 18, year: '۱۴۰۴', field: 'تجربی', subject: 'ریاضی', question: 'اگر f(x) = 3x - 2 باشد، f(4) کدام است؟', options: ['۸', '۱۰', '۱۲', '۱۴'], correct: 1 },
      { id: 19, year: '۱۴۰۴', field: 'تجربی', subject: 'زیست', question: 'کدام اندامک در سنتز پروتئین نقش دارد؟', options: ['ریبوزوم', 'میتوکندری', 'لیزوزوم', 'واکوئل'], correct: 0 },
      { id: 20, year: '۱۴۰۴', field: 'تجربی', subject: 'شیمی', question: 'pH یک محلول اسیدی چگونه است؟', options: ['بیشتر از ۷', 'برابر ۷', 'کمتر از ۷', 'همیشه صفر'], correct: 2 },
    ]
  },
  {
    year: '۱۴۰۴ - انسانی',
    title: 'کنکور سراسری ۱۴۰۴ (انسانی)',
    description: 'دفترچه سوالات و پاسخنامه تشریحی',
    pdfLink: 'https://dl3.riazisara.ir/download/konkoor/dakhel/ensani/soal-konkoor-ensani140404-d1.pdf',
    answersLink: 'https://riazisara.ir/%d8%ad%d9%84-%d8%b3%d9%88%d8%a7%d9%84%d8%a7%d8%aa-%da%a9%d9%86%da%a9%d9%88%d8%b1-%d8%a7%d9%86%d8%b3%d8%a7%d9%86%db%8c-%d8%aa%db%8c%d8%b1-%d9%85%d8%a7%d9%87-1404/',
    mockQuestions: [
      { id: 21, year: '۱۴۰۴', field: 'انسانی', subject: 'ادبیات', question: '«تشبیه» در کدام گزینه وجود دارد؟', options: ['علی شیر است', 'علی رفت', 'علی مرد', 'علی دیر آمد'], correct: 0 },
      { id: 22, year: '۱۴۰۴', field: 'انسانی', subject: 'تاریخ', question: 'کدام پادشاه سلسله هخامنشیان را بنیان نهاد؟', options: ['داریوش', 'کوروش', 'خشایارشا', 'اردشیر'], correct: 1 },
      { id: 23, year: '۱۴۰۴', field: 'انسانی', subject: 'عربی', question: 'مترادف کلمه «کبیر» کدام است؟', options: ['صغیر', 'عظیم', 'قلیل', 'ضعیف'], correct: 1 },
      { id: 24, year: '۱۴۰۴', field: 'انسانی', subject: 'اقتصاد', question: 'هزینه فرصت به چه معناست؟', options: ['هزینه پولی', 'ارزش بهترین گزینه رها شده', 'سود کل', 'هزینه ثابت'], correct: 1 },
      { id: 25, year: '۱۴۰۴', field: 'انسانی', subject: 'منطق', question: 'در قیاس، حد وسط کدام است؟', options: ['حد اصغر', 'حد اکبر', 'حد مشترک', 'نتیجه'], correct: 2 },
      { id: 26, year: '۱۴۰۴', field: 'انسانی', subject: 'ادبیات', question: 'کدام شاعر «مثنوی معنوی» را سروده است؟', options: ['حافظ', 'سعدی', 'مولانا', 'نظامی'], correct: 2 },
      { id: 27, year: '۱۴۰۴', field: 'انسانی', subject: 'جغرافیا', question: 'بلندترین قله ایران کدام است؟', options: ['دنا', 'علم‌کوه', 'دماوند', 'زردکوه'], correct: 2 },
      { id: 28, year: '۱۴۰۴', field: 'انسانی', subject: 'عربی', question: 'کدام کلمه جمع مکسر است؟', options: ['کتاب', 'کاتب', 'کتب', 'مکتوب'], correct: 2 },
      { id: 29, year: '۱۴۰۴', field: 'انسانی', subject: 'جامعه‌شناسی', question: 'نهاد اصلی جامعه‌پذیری اولیه کودک چیست؟', options: ['مدرسه', 'خانواده', 'رسانه', 'همسالان'], correct: 1 },
      { id: 30, year: '۱۴۰۴', field: 'انسانی', subject: 'فلسفه', question: 'کدام فیلسوف معتقد به «من می‌اندیشم، پس هستم» بود؟', options: ['افلاطون', 'ارسطو', 'دکارت', 'کانت'], correct: 2 },
    ]
  },

  // ================= ۱۴۰۳ =================
  {
    year: '۱۴۰۳',
    title: 'کنکور سراسری ۱۴۰۳ (ریاضی)',
    description: 'دفترچه سوالات و پاسخنامه تشریحی',
    pdfLink: 'https://dl3.riazisara.ir/download/konkoor/dakhel/riazi/soal-konkoor-riazi140304-d1.pdf',
    answersLink: 'https://dl3.riazisara.ir/download/konkoor/dakhel/riazi/soal-pasokh-riazi-konkoor-riazi0304-asadi.pdf',
    mockQuestions: [
      { id: 31, year: '۱۴۰۳', field: 'ریاضی', subject: 'حسابان', question: 'مشتق تابع f(x) = x^3 در نقطه x=2 چقدر است؟', options: ['۴', '۸', '۱۲', '۱۶'], correct: 2 },
]
  },
  {
    year: '۱۴۰۳ - انسانی',
    title: 'کنکور سراسری ۱۴۰۳ (انسانی)',
    description: 'دفترچه سوالات و پاسخنامه تشریحی',
    pdfLink: 'https://dl3.riazisara.ir/download/konkoor/dakhel/ensani/soal-konkoor-ensani140304-d1.pdf',
    answersLink: 'https://dl3.riazisara.ir/download/konkoor/dakhel/ensani/soal-pasokh-riazi-konkoor-ensani0304-asadi.pdf',
    mockQuestions: [
      { id: 51, year: '۱۴۰۳', field: 'انسانی', subject: 'ادبیات', question: '«استعاره» در کدام گزینه وجود دارد؟', options: ['سرو آزاد', 'شیر را دیدم که شمشیر می‌زد', 'علی مثل شیر است', 'شب رفت'], correct: 1 },
      { id: 52, year: '۱۴۰۳', field: 'انسانی', subject: 'جغرافیا', question: 'کدام کشور با ایران مرز مشترک ندارد؟', options: ['ترکمنستان', 'عراق', 'سوریه', 'پاکستان'], correct: 2 },
      { id: 53, year: '۱۴۰۳', field: 'انسانی', subject: 'عربی', question: 'کدام کلمه مؤنث است؟', options: ['کاتب', 'طالبة', 'معلم', 'رجل'], correct: 1 },
      { id: 54, year: '۱۴۰۳', field: 'انسانی', subject: 'جامعه‌شناسی', question: 'به مجموعه باورها، ارزش‌ها و آداب یک جامعه چه می‌گویند؟', options: ['فرهنگ', 'اقتصاد', 'سیاست', 'قانون'], correct: 0 },
      { id: 55, year: '۱۴۰۳', field: 'انسانی', subject: 'فلسفه', question: 'کدام فیلسوف شاگرد افلاطون بود؟', options: ['سقراط', 'ارسطو', 'دکارت', 'کانت'], correct: 1 },
      { id: 56, year: '۱۴۰۳', field: 'انسانی', subject: 'ادبیات', question: 'کتاب «گلستان» اثر کیست؟', options: ['حافظ', 'سعدی', 'مولانا', 'فردوسی'], correct: 1 },
      { id: 57, year: '۱۴۰۳', field: 'انسانی', subject: 'تاریخ', question: 'کدام سلسله اولین حکومت ایرانی پس از اسلام بود؟', options: ['صفاریان', 'سامانیان', 'طاهریان', 'غزنویان'], correct: 2 },
      { id: 58, year: '۱۴۰۳', field: 'انسانی', subject: 'عربی', question: 'مترادف کلمه «صعب» چیست؟', options: ['آسان', 'سخت', 'زیبا', 'بزرگ'], correct: 1 },
      { id: 59, year: '۱۴۰۳', field: 'انسانی', subject: 'اقتصاد', question: 'در بازار رقابت کامل، قیمت چگونه تعیین می‌شود؟', options: ['توسط دولت', 'توسط عرضه و تقاضا', 'توسط تولیدکننده بزرگ', 'توسط مصرف‌کننده'], correct: 1 },
      { id: 60, year: '۱۴۰۳', field: 'انسانی', subject: 'منطق', question: '«قضیه شرطیه» به چه معناست؟', options: ['جمله خبری ساده', 'جمله‌ای با اگر و آنگاه', 'پرسش', 'امر و نهی'], correct: 1 },
    ]
  },

  // ================= ۱۴۰۲ =================
  {
    year: '۱۴۰۲',
    title: 'کنکور سراسری ۱۴۰۲ (ریاضی)',
    description: 'دفترچه سوالات و پاسخنامه تشریحی',
    pdfLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/riazi/soal-konkoor-riazi140204-d1.pdf',
    answersLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/riazi/soal-pasokh-riazi-konkoor-riazi0204-asadi.pdf',
    mockQuestions: [
      { id: 61, year: '۱۴۰۲', field: 'ریاضی', subject: 'حسابان', question: 'مساحت زیر نمودار تابع y = 2x از x=0 تا x=3 چقدر است؟', options: ['۳', '۶', '۹', '۱۲'], correct: 2 },
      { id: 62, year: '۱۴۰۲', field: 'ریاضی', subject: 'هندسه', question: 'کدام یک از اشکال زیر تمام اضلاعش با هم برابر است؟', options: ['مستطیل', 'لوزی', 'متوازی‌الاضلاع', 'ذوزنقه'], correct: 1 },
      { id: 63, year: '۱۴۰۲', field: 'ریاضی', subject: 'فیزیک', question: 'انرژی جنبشی با سرعت چه رابطه‌ای دارد؟', options: ['مستقیم', 'عکس', 'با مجذور سرعت', 'با ریشه دوم سرعت'], correct: 2 },
      { id: 64, year: '۱۴۰۲', field: 'ریاضی', subject: 'شیمی', question: 'کدام پیوند در مولکول NaCl وجود دارد؟', options: ['کووالانسی', 'یونی', 'هیدروژنی', 'فلزی'], correct: 1 },
      { id: 65, year: '۱۴۰۲', field: 'ریاضی', subject: 'گسسته', question: 'در پرتاب یک سکه سالم، احتمال آمدن شیر چند است؟', options: ['۱', '۰.۵', '۰.۲۵', '۰'], correct: 1 },
      { id: 66, year: '۱۴۰۲', field: 'ریاضی', subject: 'حسابان', question: 'مشتق تابع f(x) = sin(x) چیست؟', options: ['cos(x)', '-cos(x)', 'tan(x)', '-sin(x)'], correct: 0 },
      { id: 67, year: '۱۴۰۲', field: 'ریاضی', subject: 'هندسه', question: 'در یک مثلث متساوی‌الاضلاع، هر زاویه چند درجه است؟', options: ['۴۵', '۶۰', '۹۰', '۱۲۰'], correct: 1 },
{ id: 68, year: '۱۴۰۲', field: 'ریاضی', subject: 'فیزیک', question: 'کدام یک از امواج زیر الکترومغناطیسی نیست؟', options: ['نور مرئی', 'امواج رادیویی', 'امواج صوتی', 'پرتو ایکس'], correct: 2 },
      { id: 69, year: '۱۴۰۲', field: 'ریاضی', subject: 'شیمی', question: 'کدام یک از عناصر زیر در گروه فلزات قلیایی است؟', options: ['منیزیم', 'پتاسیم', 'کلسیم', 'آلومینیوم'], correct: 1 },
      { id: 70, year: '۱۴۰۲', field: 'ریاضی', subject: 'گسسته', question: 'اگر n=5 باشد، n فاکتوریل (n!) چند است؟', options: ['۲۵', '۶۰', '۱۲۰', '۷۲۰'], correct: 2 },
    ]
  },
  {
    year: '۱۴۰۲ - تجربی',
    title: 'کنکور سراسری ۱۴۰۲ (تجربی)',
    description: 'دفترچه سوالات و پاسخنامه تشریحی',
    pdfLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/tajrobi/soal-konkoor-tajrobi140204-d1.pdf',
    answersLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/tajrobi/soal-pasokh-riazi-konkoor-tajrobi0204-asadi.pdf',
    mockQuestions: [
      { id: 71, year: '۱۴۰۲', field: 'تجربی', subject: 'زیست', question: 'در کدام مرحله از تقسیم میوز، کروموزوم‌های همتا از هم جدا می‌شوند؟', options: ['پروفاز ۱', 'متافاز ۱', 'آنافاز ۱', 'تلوفاز ۱'], correct: 2 },
      { id: 72, year: '۱۴۰۲', field: 'تجربی', subject: 'شیمی', question: 'pH یک محلول خنثی در دمای اتاق چقدر است؟', options: ['۰', '۷', '۱۴', '۱'], correct: 1 },
      { id: 73, year: '۱۴۰۲', field: 'تجربی', subject: 'فیزیک', question: 'کدام ذره زیر بار منفی دارد؟', options: ['پروتون', 'نوترون', 'الکترون', 'پوزیترون'], correct: 2 },
      { id: 74, year: '۱۴۰۲', field: 'تجربی', subject: 'ریاضی', question: 'اگر لگاریتم ۱۰۰ در مبنای ۱۰ باشد، حاصل چند است؟', options: ['۱', '۲', '۱۰', '۱۰۰'], correct: 1 },
      { id: 75, year: '۱۴۰۲', field: 'تجربی', subject: 'زیست', question: 'کدام یک از اندام‌های زیر در دستگاه گوارش انسان، ترشح آنزیم ندارد؟', options: ['معده', 'کبد', 'مری', 'روده باریک'], correct: 2 },
      { id: 76, year: '۱۴۰۲', field: 'تجربی', subject: 'شیمی', question: 'کدام یک از ترکیبات زیر یک هیدروکربن است؟', options: ['متانول', 'اتان', 'استیک اسید', 'استون'], correct: 1 },
      { id: 77, year: '۱۴۰۲', field: 'تجربی', subject: 'فیزیک', question: 'قانون اهم رابطه بین ولتاژ، جریان و مقاومت را بیان می‌کند.', options: ['V = I / R', 'V = I * R', 'V = I + R', 'V = R / I'], correct: 1 },
      { id: 78, year: '۱۴۰۲', field: 'تجربی', subject: 'ریاضی', question: 'مساحت یک مربع به ضلع ۴ چقدر است؟', options: ['۸', '۱۲', '۱۶', '۲۰'], correct: 2 },
      { id: 79, year: '۱۴۰۲', field: 'تجربی', subject: 'زیست', question: 'کدام بخش از دستگاه تنفس، محل تبادل گازهاست؟', options: ['نای', 'نایژه', 'آلوئول', 'حنجره'], correct: 2 },
      { id: 80, year: '۱۴۰۲', field: 'تجربی', subject: 'شیمی', question: 'کدام یک از عناصر زیر در جدول تناوبی نماد Fe دارد؟', options: ['فلور', 'آهن', 'فرانسیوم', 'فسفر'], correct: 1 },
    ]
  },
  {
    year: '۱۴۰۲ - انسانی',
    title: 'کنکور سراسری ۱۴۰۲ (انسانی)',
    description: 'دفترچه سوالات و پاسخنامه تشریحی',
    pdfLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/ensani/soal-konkoor-ensani140204-d1.pdf',
    answersLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/ensani/soal-pasokh-riazi-konkoor-ensani0204-asadi.pdf',
    mockQuestions: [
      { id: 81, year: '۱۴۰۲', field: 'انسانی', subject: 'ادبیات', question: '«کنایه» در کدام گزینه وجود دارد؟', options: ['دستش را بالا برد', 'فلانی دست و پا چلفتی است', 'شیر آمد', 'علی رفت'], correct: 1 },
      { id: 82, year: '۱۴۰۲', field: 'انسانی', subject: 'تاریخ', question: 'سلسله ساسانی را چه کسی بنیان نهاد؟', options: ['شاپور اول', 'اردشیر بابکان', 'بهرام گور', 'خسرو انوشیروان'], correct: 1 },
      { id: 83, year: '۱۴۰۲', field: 'انسانی', subject: 'جغرافیا', question: 'کدام دریاچه در ایران بزرگ‌ترین دریاچه داخلی است؟', options: ['ارومیه', 'خزر', 'هامون', 'بختگان'], correct: 0 },
      { id: 84, year: '۱۴۰۲', field: 'انسانی', subject: 'عربی', question: 'کدام کلمه مفرد است؟', options: ['کتب', 'اقلام', 'طالب', 'رجال'], correct: 2 },
{ id: 32, year: '۱۴۰۳', field: 'ریاضی', subject: 'هندسه', question: 'معادله خطی که از دو نقطه (۰,۱) و (۱,۳) می‌گذرد چیست؟', options: ['y = 2x + 1', 'y = x + 1', 'y = 3x', 'y = 2x - 1'], correct: 0 },
      { id: 33, year: '۱۴۰۳', field: 'ریاضی', subject: 'فیزیک', question: 'قانون اول نیوتن بیانگر کدام مفهوم است؟', options: ['نیرو', 'اینرسی', 'شتاب', 'گرانش'], correct: 1 },
      { id: 34, year: '۱۴۰۳', field: 'ریاضی', subject: 'شیمی', question: 'عدد اتمی عنصر اکسیژن چند است؟', options: ['۶', '۷', '۸', '۱۶'], correct: 2 },
      { id: 35, year: '۱۴۰۳', field: 'ریاضی', subject: 'گسسته', question: 'کدام یک از اعداد زیر اول است؟', options: ['۲۱', '۲۷', '۲۹', '۳۳'], correct: 2 },
      { id: 36, year: '۱۴۰۳', field: 'ریاضی', subject: 'حسابان', question: 'حاصل انتگرال تابع f(x) = 2x از ۰ تا ۲ چقدر است؟', options: ['۲', '۴', '۶', '۸'], correct: 1 },
      { id: 37, year: '۱۴۰۳', field: 'ریاضی', subject: 'هندسه', question: 'در یک لوزی، قطرها بر هم عمودند و یکدیگر را نصف می‌کنند.', options: ['درست', 'غلط', 'فقط در مربع درست است', 'به زاویه بستگی دارد'], correct: 0 },
      { id: 38, year: '۱۴۰۳', field: 'ریاضی', subject: 'فیزیک', question: 'فرمول انرژی جنبشی چیست؟', options: ['mv', 'mv^2', '1/2 mv^2', 'ma'], correct: 2 },
      { id: 39, year: '۱۴۰۳', field: 'ریاضی', subject: 'شیمی', question: 'کدام یک از عناصر زیر در گروه هالوژن‌ها قرار دارد؟', options: ['سدیم', 'کلر', 'کلسیم', 'آهن'], correct: 1 },
      { id: 40, year: '۱۴۰۳', field: 'ریاضی', subject: 'گسسته', question: 'تعداد زیرمجموعه‌های یک مجموعه ۳ عضوی چند است؟', options: ['۳', '۶', '۸', '۹'], correct: 2 },
    ]
  },
  {
    year: '۱۴۰۳ - تجربی',
    title: 'کنکور سراسری ۱۴۰۳ (تجربی)',
    description: 'دفترچه سوالات و پاسخنامه تشریحی',
    pdfLink: 'https://dl3.riazisara.ir/download/konkoor/dakhel/tajrobi/soal-konkoor-tajrobi140304-d1.pdf',
    answersLink: 'https://dl3.riazisara.ir/download/konkoor/dakhel/tajrobi/soal-pasokh-riazi-konkoor-tajrobi0304-asadi.pdf',
    mockQuestions: [
      { id: 41, year: '۱۴۰۳', field: 'تجربی', subject: 'زیست', question: 'کدام سلول‌ها در سیستم ایمنی بدن پادتن (آنتی‌بادی) تولید می‌کنند؟', options: ['گلبول قرمز', 'لنفوسیت B', 'لنفوسیت T', 'پلاکت'], correct: 1 },
      { id: 42, year: '۱۴۰۳', field: 'تجربی', subject: 'شیمی', question: 'در واکنش سوختن متان، کدام گازها تولید می‌شوند؟', options: ['CO2 و H2O', 'CO و H2', 'O2 و H2O', 'C و H2O'], correct: 0 },
      { id: 43, year: '۱۴۰۳', field: 'تجربی', subject: 'فیزیک', question: 'واحد انرژی در سیستم SI کدام است؟', options: ['نیوتن', 'ژول', 'وات', 'پاسکال'], correct: 1 },
      { id: 44, year: '۱۴۰۳', field: 'تجربی', subject: 'ریاضی', question: 'اگر ۳x = ۱۲ باشد، حاصل ۲x + ۱ چقدر است؟', options: ['۷', '۸', '۹', '۱۰'], correct: 2 },
      { id: 45, year: '۱۴۰۳', field: 'تجربی', subject: 'زیست', question: 'تنظیم قند خون توسط کدام غده انجام می‌شود؟', options: ['تیروئید', 'پانکراس', 'فوق کلیه', 'هیپوفیز'], correct: 1 },
      { id: 46, year: '۱۴۰۳', field: 'تجربی', subject: 'شیمی', question: 'کدام یک از ترکیبات زیر یک باز است؟', options: ['HCl', 'NaOH', 'H2SO4', 'HNO3'], correct: 1 },
      { id: 47, year: '۱۴۰۳', field: 'تجربی', subject: 'فیزیک', question: 'واحد اندازه‌گیری جریان الکتریکی چیست؟', options: ['ولت', 'اهم', 'آمپر', 'وات'], correct: 2 },
      { id: 48, year: '۱۴۰۳', field: 'تجربی', subject: 'ریاضی', question: 'مساحت مثلثی با قاعده ۶ و ارتفاع ۴ چقدر است؟', options: ['۱۰', '۱۲', '۲۴', '۴۸'], correct: 1 },
      { id: 49, year: '۱۴۰۳', field: 'تجربی', subject: 'زیست', question: 'کدام اندامک مسئول هضم درون سلولی است؟', options: ['ریبوزوم', 'میتوکندری', 'لیزوزوم', 'شبکه آندوپلاسمی'], correct: 2 },
      { id: 50, year: '۱۴۰۳', field: 'تجربی', subject: 'شیمی', question: 'کدام عنصر فراوان‌ترین عنصر در پوسته زمین است؟', options: ['آهن', 'سیلیسیم', 'اکسیژن', 'آلومینیوم'], correct: 2 },
{ id: 85, year: '۱۴۰۲', field: 'انسانی', subject: 'فلسفه', question: 'معنای لغوی «فلسفه» چیست؟', options: ['دوستی با دانایی', 'علم تجربی', 'هنر سخنوری', 'شعر'], correct: 0 },
      { id: 86, year: '۱۴۰۲', field: 'انسانی', subject: 'جامعه‌شناسی', question: '«کنش اجتماعی» به چه معناست؟', options: ['هر عملی', 'عملی که با نیت و در برابر دیگران انجام شود', 'فقط کار فیزیکی', 'فقط گفتار'], correct: 1 },
      { id: 87, year: '۱۴۰۲', field: 'انسانی', subject: 'اقتصاد', question: 'تورم به چه معناست؟', options: ['کاهش قیمت‌ها', 'افزایش مداوم سطح عمومی قیمت‌ها', 'ثبات قیمت‌ها', 'کاهش تولید'], correct: 1 },
      { id: 88, year: '۱۴۰۲', field: 'انسانی', subject: 'ادبیات', question: 'کدام کتاب اثر «جلال آل‌احمد» است؟', options: ['مدیر مدرسه', 'کلیله و دمنه', 'گلستان', 'بوف کور'], correct: 0 },
      { id: 89, year: '۱۴۰۲', field: 'انسانی', subject: 'تاریخ', question: 'انقلاب مشروطه در زمان کدام پادشاه قاجار رخ داد؟', options: ['ناصرالدین‌شاه', 'مظفرالدین‌شاه', 'محمدعلی‌شاه', 'احمدشاه'], correct: 1 },
      { id: 90, year: '۱۴۰۲', field: 'انسانی', subject: 'منطق', question: '«قیاس استثنایی» چه ویژگی دارد؟', options: ['نتیجه در مقدمات هست', 'نتیجه جدید است', 'مقدمات ندارد', 'همیشه غلط است'], correct: 0 },
    ]
  },
// ================= ۱۴۰۱ =================
{
  year: '۱۴۰۱',
  title: 'کنکور سراسری ۱۴۰۱ (ریاضی)',
  description: 'دفترچه سوالات و پاسخنامه تشریحی',
  pdfLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/riazi/soal-konkoor-riazi140104-d1.pdf',
  answersLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/riazi/soal-pasokh-riazi-konkoor-riazi0104-asadi.pdf',
  mockQuestions: [
    { id: 91, year: '۱۴۰۱', field: 'ریاضی', subject: 'حسابان', question: 'حاصل حد (x^2 - 1)/(x - 1) وقتی x به سمت ۱ میل کند، چیست؟', options: ['۰', '۱', '۲', 'وجود ندارد'], correct: 2 },
    { id: 92, year: '۱۴۰۱', field: 'ریاضی', subject: 'حسابان', question: 'مشتق تابع f(x) = ln x چیست؟', options: ['x', '۱/x', 'ln x', 'e^x'], correct: 1 },
    { id: 93, year: '۱۴۰۱', field: 'ریاضی', subject: 'هندسه', question: 'مجموع زوایای داخلی هر مثلث چند درجه است؟', options: ['۹۰', '۱۸۰', '۲۷۰', '۳۶۰'], correct: 1 },
    { id: 94, year: '۱۴۰۱', field: 'ریاضی', subject: 'فیزیک', question: 'قانون دوم نیوتن کدام رابطه را بیان می‌کند؟', options: ['F = ma', 'E = mc^2', 'V = IR', 'P = F/A'], correct: 0 },
    { id: 95, year: '۱۴۰۱', field: 'ریاضی', subject: 'شیمی', question: 'تعداد ذرات موجود در یک مول ماده چند است؟', options: ['۶.۰۲ × ۱۰^۲۳', '۳.۱۴ × ۱۰^۲۳', '۱ × ۱۰^۲۳', '۹.۸ × ۱۰^۲۳'], correct: 0 },
    { id: 96, year: '۱۴۰۱', field: 'ریاضی', subject: 'گسسته', question: 'گراف کامل با ۴ راس چند یال دارد؟', options: ['۴', '۵', '۶', '۸'], correct: 2 },
    { id: 97, year: '۱۴۰۱', field: 'ریاضی', subject: 'حسابان', question: 'حاصل انتگرال cos x dx چیست؟', options: ['sin x + C', '-sin x + C', 'cos x + C', '-cos x + C'], correct: 0 },
    { id: 98, year: '۱۴۰۱', field: 'ریاضی', subject: 'هندسه', question: 'اگر ضرب داخلی دو بردار غیرصفر صفر باشد، آن دو بردار چه وضعیتی دارند؟', options: ['موازی‌اند', 'عمودند', 'هم‌جهت‌اند', 'مساوی‌اند'], correct: 1 },
    { id: 99, year: '۱۴۰۱', field: 'ریاضی', subject: 'شیمی', question: 'pH یک محلول اسید قوی نسبت به ۷ چگونه است؟', options: ['بیشتر', 'برابر', 'کمتر', 'همیشه صفر'], correct: 2 },
    { id: 100, year: '۱۴۰۱', field: 'ریاضی', subject: 'گسسته', question: 'در پرتاب دو تاس، احتمال اینکه مجموع اعداد ۸ باشد چقدر است؟', options: ['۵/۳۶', '۱/۶', '۱/۹', '۱/۱۲'], correct: 0 },
  ]
},
{
  year: '۱۴۰۱ - تجربی',
  title: 'کنکور سراسری ۱۴۰۱ (تجربی)',
  description: 'دفترچه سوالات و پاسخنامه تشریحی',
  pdfLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/tajrobi/soal-konkoor-tajrobi140104-d1.pdf',
  answersLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/tajrobi/soal-pasokh-riazi-konkoor-tajrobi0104-asadi.pdf',
  mockQuestions: [
    { id: 101, year: '۱۴۰۱', field: 'تجربی', subject: 'زیست', question: 'ماده وراثتی در سلول‌های یوکاریوتی عمدتاً در کدام بخش قرار دارد؟', options: ['سیتوپلاسم', 'هسته', 'غشا', 'دیواره سلولی'], correct: 1 },
    { id: 102, year: '۱۴۰۱', field: 'تجربی', subject: 'زیست', question: 'آنزیم کاتالاز تجزیهٔ کدام ماده را catalyze می‌کند؟', options: ['پروتئین', 'پراکسید هیدروژن', 'گلوکز', 'چربی'], correct: 1 },
    { id: 103, year: '۱۴۰۱', field: 'تجربی', subject: 'فیزیک', question: 'عدسی محدب چه نوع تصویری از جسم دور ایجاد می‌کند؟', options: ['مجازی و مستقیم', 'حقیقی و وارونه', 'مجازی و وارونه', 'حقیقی و مستقیم'], correct: 1 },
    { id: 104, year: '۱۴۰۱', field: 'تجربی', subject: 'ریاضی', question: 'مشتق تابع f(x) = x^2 در نقطه x=3 چقدر است؟', options: ['۳', '۶', '۹', '۱۲'], correct: 1 },
    { id: 105, year: '۱۴۰۱', field: 'تجربی', subject: 'زیست', question: 'کدام گروه خونی دهندهٔ عمومی محسوب می‌شود؟', options: ['A', 'B', 'AB', 'O'], correct: 3 },
    { id: 106, year: '۱۴۰۱', field: 'تجربی', subject: 'شیمی', question: 'پیوند بین دو اتم غیرفلز معمولاً چه نوع پیوندی است؟', options: ['یونی', 'کووالانسی', 'فلزی', 'هیدروژنی'], correct: 1 },
    { id: 107, year: '۱۴۰۱', field: 'تجربی', subject: 'فیزیک', question: 'در مدار سری، مقاومت کل چگونه محاسبه می‌شود؟', options: ['مجموع مقاومت‌ها', 'معکوس مجموع معکوس‌ها', 'حاصل‌ضرب مقاومت‌ها', 'میانگین مقاومت‌ها'], correct: 0 },
{ id: 125, year: '۱۴۰۰', field: 'ریاضی', subject: 'شیمی', question: 'یک «مول» از هر ماده چند واحد بنیادی دارد؟', options: ['۱۰', '۱۰۰', '۶.۰۲ × ۱۰^۲۳', '۳.۱۴ × ۱۰^۲۳'], correct: 2 },
    { id: 126, year: '۱۴۰۰', field: 'ریاضی', subject: 'گسسته', question: 'حاصل ترکیب C(5,2) چند است؟', options: ['۵', '۱۰', '۲۰', '۲۵'], correct: 1 },
    { id: 127, year: '۱۴۰۰', field: 'ریاضی', subject: 'حسابان', question: 'حاصل انتگرال ۱/x dx چیست؟', options: ['x + C', 'ln|x| + C', '۱/x^2 + C', 'e^x + C'], correct: 1 },
    { id: 128, year: '۱۴۰۰', field: 'ریاضی', subject: 'هندسه', question: 'بردار یکه، برداری است که طول آن چند باشد؟', options: ['۰', '۱', '۲', 'بی‌نهایت'], correct: 1 },
    { id: 129, year: '۱۴۰۰', field: 'ریاضی', subject: 'شیمی', question: 'عدد اتمی هیدروژن چند است؟', options: ['۱', '۲', '۳', '۴'], correct: 0 },
    { id: 130, year: '۱۴۰۰', field: 'ریاضی', subject: 'گسسته', question: 'در دو پرتاب متوالی یک سکهٔ سالم، احتمال آمدن دو شیر پشت سر هم چقدر است؟', options: ['۱/۲', '۱/۳', '۱/۴', '۱/۸'], correct: 2 },
  ]
},
{
  year: '۱۴۰۰ - تجربی',
  title: 'کنکور سراسری ۱۴۰۰ (تجربی)',
  description: 'دفترچه سوالات و پاسخنامه تشریحی',
  pdfLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/tajrobi/soal-konkoor-tajrobi140004-d1.pdf',
  answersLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/tajrobi/soal-pasokh-riazi-konkoor-tajrobi0004-asadi.pdf',
  mockQuestions: [
    { id: 131, year: '۱۴۰۰', field: 'تجربی', subject: 'زیست', question: 'تولید ATP در سلول عمدتاً در کدام اندامک انجام می‌شود؟', options: ['ریبوزوم', 'میتوکندری', 'لیزوزوم', 'واکوئل'], correct: 1 },
    { id: 132, year: '۱۴۰۰', field: 'تجربی', subject: 'زیست', question: 'هورمون رشد توسط کدام غده ترشح می‌شود؟', options: ['تیروئید', 'هیپوفیز', 'پانکراس', 'فوق کلیه'], correct: 1 },
    { id: 133, year: '۱۴۰۰', field: 'تجربی', subject: 'فیزیک', question: 'آینهٔ مقعر در چه شرایطی تصویر حقیقی تشکیل می‌دهد؟', options: ['همیشه', 'هرگز', 'وقتی جسم خارج از کانون باشد', 'وقتی جسم روی کانون باشد'], correct: 2 },
    { id: 134, year: '۱۴۰۰', field: 'تجربی', subject: 'ریاضی', question: 'ریشه‌های معادلهٔ x^2 - 5x + 6 = 0 کدام‌اند؟', options: ['۲ و ۳', '۱ و ۶', '-۲ و -۳', '۵ و ۶'], correct: 0 },
    { id: 135, year: '۱۴۰۰', field: 'تجربی', subject: 'زیست', question: 'دیابت شیرین با اختلال در کدام هورمون مرتبط است؟', options: ['تیروکسین', 'انسولین', 'آدرنالین', 'تستوسترون'], correct: 1 },
    { id: 136, year: '۱۴۰۰', field: 'تجربی', subject: 'شیمی', question: 'کدام محلول pH کمتر از ۷ دارد؟', options: ['آب خالص', 'محلول اسیدی', 'محلول بازی', 'محلول خنثی'], correct: 1 },
    { id: 137, year: '۱۴۰۰', field: 'تجربی', subject: 'فیزیک', question: 'واحد توان در SI چیست؟', options: ['ژول', 'وات', 'نیوتن', 'آمپر'], correct: 1 },
    { id: 138, year: '۱۴۰۰', field: 'تجربی', subject: 'ریاضی', question: 'محیط دایره‌ای به شعاع ۵ چقدر است؟', options: ['۵π', '۱۰π', '۲۵π', '۵۰π'], correct: 1 },
    { id: 139, year: '۱۴۰۰', field: 'تجربی', subject: 'زیست', question: 'تبادل گازهای تنفسی در انسان در کدام بخش انجام می‌شود؟', options: ['نای', 'نایژه', 'آلوئول', 'حنجره'], correct: 2 },
    { id: 140, year: '۱۴۰۰', field: 'تجربی', subject: 'شیمی', question: 'کدام عنصر پایهٔ اصلی ترکیبات آلی است؟', options: ['اکسیژن', 'نیتروژن', 'کربن', 'هیدروژن'], correct: 2 },
  ]
},
{
  year: '۱۴۰۰ - انسانی',
  title: 'کنکور سراسری ۱۴۰۰ (انسانی)',
  description: 'دفترچه سوالات و پاسخنامه تشریحی',
  pdfLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/ensani/soal-konkoor-ensani140004-d1.pdf',
  answersLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/ensani/soal-pasokh-riazi-konkoor-ensani0004-asadi.pdf',
  mockQuestions: [
    { id: 141, year: '۱۴۰۰', field: 'انسانی', subject: 'ادبیات', question: '«تشبیه» در کدام گزینه وجود دارد؟', options: ['علی شیر است', 'علی آمد', 'علی رفت', 'علی نشست'], correct: 0 },
{ id: 108, year: '۱۴۰۱', field: 'تجربی', subject: 'ریاضی', question: 'حاصل log₂ ۸ چند است؟', options: ['۲', '۳', '۴', '۸'], correct: 1 },
    { id: 109, year: '۱۴۰۱', field: 'تجربی', subject: 'زیست', question: 'فتوسنتز در کدام اندامک انجام می‌شود؟', options: ['میتوکندری', 'کلروپلاست', 'ریبوزوم', 'لیزوزوم'], correct: 1 },
    { id: 110, year: '۱۴۰۱', field: 'تجربی', subject: 'شیمی', question: 'نماد شیمیایی سدیم کدام است؟', options: ['S', 'Na', 'Mg', 'K'], correct: 1 },
  ]
},
{
  year: '۱۴۰۱ - انسانی',
  title: 'کنکور سراسری ۱۴۰۱ (انسانی)',
  description: 'دفترچه سوالات و پاسخنامه تشریحی',
  pdfLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/ensani/soal-konkoor-ensani140104-d1.pdf',
  answersLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/ensani/soal-pasokh-riazi-konkoor-ensani0104-asadi.pdf',
  mockQuestions: [
    { id: 111, year: '۱۴۰۱', field: 'انسانی', subject: 'ادبیات', question: '«تشخیص» (جان‌بخشی) در کدام گزینه وجود دارد؟', options: ['گل خندید', 'علی رفت', 'شب آمد', 'باران بارید'], correct: 0 },
    { id: 112, year: '۱۴۰۱', field: 'انسانی', subject: 'تاریخ', question: 'جنگ جهانی اول در چه سالی آغاز شد؟', options: ['۱۹۱۴', '۱۹۱۸', '۱۹۳۹', '۱۹۴۵'], correct: 0 },
    { id: 113, year: '۱۴۰۱', field: 'انسانی', subject: 'جغرافیا', question: 'کدام استان ایران بیشترین مرز مشترک را با عراق دارد؟', options: ['خوزستان', 'کرمانشاه', 'ایلام', 'کردستان'], correct: 2 },
    { id: 114, year: '۱۴۰۱', field: 'انسانی', subject: 'عربی', question: 'کدام کلمه جمع مکسر است؟', options: ['معلم', 'معلمان', 'معالم', 'متعلم'], correct: 2 },
    { id: 115, year: '۱۴۰۱', field: 'انسانی', subject: 'فلسفه', question: '«انقلاب کوپرنیکی» در فلسفهٔ کدام فیلسوف مطرح است؟', options: ['دکارت', 'کانت', 'هگل', 'ارسطو'], correct: 1 },
    { id: 116, year: '۱۴۰۱', field: 'انسانی', subject: 'جامعه‌شناسی', question: '«ارزش‌ها» در جامعه‌شناسی به چه معناست؟', options: ['قوانین رسمی', 'معیارهای مطلوب و شایسته', 'ساختار اقتصادی', 'نهادهای سیاسی'], correct: 1 },
    { id: 117, year: '۱۴۰۱', field: 'انسانی', subject: 'اقتصاد', question: 'در بازار، نقطهٔ تعادل عرضه و تقاضا چه چیزی را تعیین می‌کند؟', options: ['قیمت تعادلی', 'هزینه تولید', 'سود دولت', 'مالیات'], correct: 0 },
    { id: 118, year: '۱۴۰۱', field: 'انسانی', subject: 'ادبیات', question: '«شاهنامه» اثر کدام شاعر است؟', options: ['حافظ', 'سعدی', 'فردوسی', 'نظامی'], correct: 2 },
    { id: 119, year: '۱۴۰۱', field: 'انسانی', subject: 'تاریخ', question: 'کدام سلسله آخرین حکومت ایران پیش از ورود اسلام بود؟', options: ['هخامنشیان', 'اشکانیان', 'ساسانیان', 'صفویان'], correct: 2 },
    { id: 120, year: '۱۴۰۱', field: 'انسانی', subject: 'منطق', question: 'در «قیاس اقترانی»، نتیجه چگونه به دست می‌آید؟', options: ['از یک مقدمه', 'از دو مقدمه یا بیشتر', 'بدون مقدمه', 'فقط از تجربه'], correct: 1 },
  ]
},

// ================= ۱۴۰۰ =================
{
  year: '۱۴۰۰',
  title: 'کنکور سراسری ۱۴۰۰ (ریاضی)',
  description: 'دفترچه سوالات و پاسخنامه تشریحی',
  pdfLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/riazi/soal-konkoor-riazi140004-d1.pdf',
  answersLink: 'https://dl.riazisara.ir/download/konkoor/dakhel/riazi/soal-pasokh-riazi-konkoor-riazi0004-asadi.pdf',
  mockQuestions: [
    { id: 121, year: '۱۴۰۰', field: 'ریاضی', subject: 'حسابان', question: 'حاصل حد (sin x)/x وقتی x به سمت صفر میل کند، چند است؟', options: ['۰', '۱', '∞', 'وجود ندارد'], correct: 1 },
    { id: 122, year: '۱۴۰۰', field: 'ریاضی', subject: 'حسابان', question: 'مشتق تابع f(x) = e^x چیست؟', options: ['e^x', 'x·e^x', 'e^(x-1)', '۱/e^x'], correct: 0 },
    { id: 123, year: '۱۴۰۰', field: 'ریاضی', subject: 'هندسه', question: 'مساحت مثلثی با قاعده ۸ و ارتفاع ۵ چقدر است؟', options: ['۱۳', '۲۰', '۴۰', '۸۰'], correct: 1 },
    { id: 124, year: '۱۴۰۰', field: 'ریاضی', subject: 'فیزیک', question: 'قانون سوم نیوتن چه چیزی را بیان می‌کند؟', options: ['اینرسی', 'کنش و واکنش', 'شتاب', 'گرانش'], correct: 1 },
{ id: 142, year: '۱۴۰۰', field: 'انسانی', subject: 'تاریخ', question: 'بنیان‌گذار سلسلهٔ هخامنشیان کیست؟', options: ['داریوش', 'کوروش', 'خشایارشا', 'اردشیر'], correct: 1 },
    { id: 143, year: '۱۴۰۰', field: 'انسانی', subject: 'جغرافیا', question: 'رشته‌کوه زاگرس در کدام بخش ایران قرار دارد؟', options: ['شمال', 'جنوب و غرب', 'شرق', 'مرکز'], correct: 1 },
    { id: 144, year: '۱۴۰۰', field: 'انسانی', subject: 'عربی', question: 'مترادف کلمهٔ «کبیر» کدام است؟', options: ['صغیر', 'عظیم', 'قلیل', 'ضعیف'], correct: 1 },
    { id: 145, year: '۱۴۰۰', field: 'انسانی', subject: 'فلسفه', question: 'کدام فیلسوف کتاب «متافیزیک» را نوشت؟', options: ['افلاطون', 'ارسطو', 'سقراط', 'دکارت'], correct: 1 },
    { id: 146, year: '۱۴۰۰', field: 'انسانی', subject: 'جامعه‌شناسی', question: '«جامعه‌پذیری» چیست؟', options: ['فرایند یادگیری هنجارها و ارزش‌ها', 'مهاجرت', 'تولید اقتصادی', 'تغییر حکومت'], correct: 0 },
    { id: 147, year: '۱۴۰۰', field: 'انسانی', subject: 'اقتصاد', question: 'تولید ناخالص داخلی (GDP) چه چیزی را اندازه می‌گیرد؟', options: ['ارزش کل کالاها و خدمات نهایی تولیدشده در یک کشور', 'درآمد دولت', 'صادرات نفت', 'نرخ بیکاری'], correct: 0 },
    { id: 148, year: '۱۴۰۰', field: 'انسانی', subject: 'ادبیات', question: '«دیوان حافظ» شامل کدام نوع شعر است؟', options: ['غزل', 'مثنوی', 'قصیده', 'رباعی'], correct: 0 },
    { id: 149, year: '۱۴۰۰', field: 'انسانی', subject: 'تاریخ', question: 'سلسلهٔ صفویه در چه قرنی به قدرت رسید؟', options: ['قرن ۷', 'قرن ۸', 'قرن ۹', 'قرن ۱۰'], correct: 3 },
    { id: 150, year: '۱۴۰۰', field: 'انسانی', subject: 'منطق', question: '«استدلال» چیست؟', options: ['هر جمله‌ای', 'فرایند استنتاج نتیجه از مقدمات', 'پرسش و پاسخ', 'توصیف یک شیء'], correct: 1 },
  ] 
},
]