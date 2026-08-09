/**
 * STATIC CURRICULUM CONTENT for HunMaster Learn.
 *
 * Only course/lesson/vocabulary content lives here. Every user-related value
 * (profile, access status, progress, statistics) comes from the database.
 */

export const brand = {
  name: "HunMaster",
  product: "HunMaster Learn",
  telegram: "https://t.me/HunMaster",
};

export type AccessStatus = "active" | "pending" | "expired" | "blocked";
export type UserRole = "user" | "admin";

export const navItems = [
  { label: "Главная", to: "/dashboard" },
  { label: "Мои курсы", to: "/courses" },
  { label: "Словарь", to: "/dictionary" },
  { label: "Прогресс", to: "/progress" },
  { label: "Достижения", to: "/achievements" },
] as const;

export type LessonState = "done" | "current" | "available" | "locked";

export type CourseModule = {
  code: string;
  title: string;
  lessons: { id: string; number: number; title: string; hu: string }[];
};

export const a1Modules: CourseModule[] = [
  {
    code: "01",
    title: "Первые шаги",
    lessons: [
      { id: "a1-1", number: 1, title: "Приветствие", hu: "Köszöntés" },
      { id: "a1-2", number: 2, title: "Знакомство", hu: "Ismerkedés" },
      { id: "a1-3", number: 3, title: "Основные выражения", hu: "Alapkifejezések" },
    ],
  },
  {
    code: "02",
    title: "Основы общения",
    lessons: [
      { id: "a1-4", number: 4, title: "Числа", hu: "Számok" },
      { id: "a1-5", number: 5, title: "Возраст", hu: "Életkor" },
      { id: "a1-6", number: 6, title: "Семья", hu: "Család" },
      { id: "a1-7", number: 7, title: "Профессии", hu: "Foglalkozások" },
    ],
  },
  {
    code: "03",
    title: "Повседневная жизнь",
    lessons: [
      { id: "a1-8", number: 8, title: "Мой день", hu: "A napom" },
      { id: "a1-9", number: 9, title: "Знакомство и рассказ о себе", hu: "Bemutatkozás" },
      { id: "a1-10", number: 10, title: "Еда", hu: "Étel" },
      { id: "a1-11", number: 11, title: "Город", hu: "Város" },
    ],
  },
  {
    code: "04",
    title: "Город и транспорт",
    lessons: [
      { id: "a1-12", number: 12, title: "Транспорт", hu: "Közlekedés" },
      { id: "a1-13", number: 13, title: "Покупки", hu: "Vásárlás" },
      { id: "a1-14", number: 14, title: "В кафе", hu: "A kávézóban" },
    ],
  },
];

export const a1LessonIds = a1Modules.flatMap((m) => m.lessons.map((l) => l.id));

export function findLesson(lessonId: string) {
  for (const m of a1Modules) {
    const lesson = m.lessons.find((l) => l.id === lessonId);
    if (lesson) return { ...lesson, module: m };
  }
  return null;
}

export type DictionaryEntry = {
  hu: string;
  ru: string;
  transcription: string;
  category: "Приветствия" | "Базовое" | "Числа" | "Семья";
};

export const dictionary: DictionaryEntry[] = [
  { hu: "Szia", ru: "Привет", transcription: "[сиа]", category: "Приветствия" },
  { hu: "Köszönöm", ru: "Спасибо", transcription: "[кёсёнём]", category: "Базовое" },
  { hu: "Jó reggelt", ru: "Доброе утро", transcription: "[йо реггельт]", category: "Приветствия" },
  { hu: "Viszlát", ru: "До свидания", transcription: "[вислат]", category: "Приветствия" },
  { hu: "Igen", ru: "Да", transcription: "[иген]", category: "Базовое" },
  { hu: "Nem", ru: "Нет", transcription: "[нем]", category: "Базовое" },
  { hu: "Kérem", ru: "Пожалуйста", transcription: "[керем]", category: "Базовое" },
  { hu: "Bocsánat", ru: "Извините", transcription: "[бочанат]", category: "Базовое" },
  { hu: "Egy", ru: "Один", transcription: "[эдь]", category: "Числа" },
  { hu: "Kettő", ru: "Два", transcription: "[кеттё]", category: "Числа" },
  { hu: "Három", ru: "Три", transcription: "[харом]", category: "Числа" },
  { hu: "Anya", ru: "Мама", transcription: "[аня]", category: "Семья" },
  { hu: "Apa", ru: "Папа", transcription: "[апа]", category: "Семья" },
  { hu: "Testvér", ru: "Брат / сестра", transcription: "[тештвер]", category: "Семья" },
];

export const dictionaryCategories = ["Все", "Приветствия", "Базовое", "Числа", "Семья"] as const;

/** Achievement definitions. Unlock state is derived from real progress. */
export const achievementDefs = [
  { id: "first-lesson", title: "Первый урок", description: "Пройдите первый урок", icon: "book", target: 1, metric: "lessons" },
  { id: "lessons-5", title: "5 уроков", description: "Пройдите 5 уроков", icon: "trophy", target: 5, metric: "lessons" },
  { id: "module-1", title: "Первый модуль", description: "Завершите все уроки модуля 01", icon: "award", target: 3, metric: "lessons" },
  { id: "streak-3", title: "3 дня подряд", description: "Занимайтесь три дня подряд", icon: "flame", target: 3, metric: "streak" },
  { id: "words-20", title: "20 слов", description: "Выучите 20 новых слов", icon: "star", target: 20, metric: "words" },
  { id: "perfect", title: "Идеальный результат", description: "Пройдите урок без ошибок", icon: "target", target: 1, metric: "perfect" },
] as const;

export const accessCopy: Record<
  AccessStatus,
  { title: string; description: string; cta?: string }
> = {
  active: { title: "Доступ активен", description: "Все материалы курса открыты." },
  pending: {
    title: "Доступ ожидает активации",
    description:
      "Ваш аккаунт создан. Для получения доступа к курсам необходимо активировать подписку.",
    cta: "Связаться с HunMaster",
  },
  expired: {
    title: "Срок доступа закончился",
    description: "Ваш прогресс сохранён. Для продления доступа свяжитесь с HunMaster.",
    cta: "Продлить доступ",
  },
  blocked: {
    title: "Доступ к аккаунту ограничен",
    description: "Для получения информации обратитесь в поддержку.",
    cta: "Написать в поддержку",
  },
};