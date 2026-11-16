import { useTranslation } from 'react-i18next';

type GuideProps = {
  onBack? : () => void;
};

export default function Guide({ onBack }: GuideProps) {
  const { t } = useTranslation();

  const features = [
    { key: 'dashboard', icon: '🏠', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' },
    { key: 'timetable', icon: '📅', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' },
    { key: 'homework', icon: '📖', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' },
    { key: 'tasks', icon: '📝', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' },
    { key: 'exams', icon: '🎓', color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30' },
    { key: 'timer', icon: '⏱️', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' },
    { key: 'stats', icon: '📊', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30' },
    { key: 'calendar', icon: '🗓️', color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30' },
    { key: 'activities', icon: '🏃', color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30' },
    { key: 'flashcards', icon: '🃏', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30' },
    { key: 'game', icon: '🎮', color: 'bg-lime-100 text-lime-600 dark:bg-lime-900/30' },
    { key: 'quizzes', icon: '📝', color: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30' },
    { key: 'profile', icon: '⚙️', color: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-fade-in pb-24">
      {/* هدر صفحه */}
      <div className="text-center space-y-2 mt-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2">
          <span>📘</span> {t('guide.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{t('guide.subtitle')}</p>
      </div>

      {/* گرید منوها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((item) => (
          <div
            key={item.key}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4"
          >
            <div className={"flex items-center justify-center w-12 h-12 rounded-xl text-2xl shrink-0 " + item.color}>
              {item.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                {t('nav.' + item.key)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-justify">
                {t('guide.' + item.key)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
