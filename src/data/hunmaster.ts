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
  { label: "Главная", to: "/" },
  { label: "Мои курсы", to: "/courses" },
  { label: "Словарь", to: "/dictionary" },
  { label: "Прогресс", to: "/progress" },
  { label: "Достижения", to: "/achievements" },
] as const;

export type LessonState = "done" | "current" | "available" | "locked";

export type CourseModule = {
  code: string;
  title: string;
  lessons: { id: string; number: number; title: string; hu: string; state: LessonState }[];
};

export const a1Modules: CourseModule[] = [
  {
    code: "01",
    title: "Первые шаги",
    lessons: [
      { id: "a1-1", number: 1, title: "Приветствие", hu: "Köszöntés" , state: "available" as LessonState },
      { id: "a1-2", number: 2, title: "Знакомство", hu: "Ismerkedés" , state: "available" as LessonState },
      { id: "a1-3", number: 3, title: "Основные выражения", hu: "Alapkifejezések" , state: "available" as LessonState },
    ],
  },
  {
    code: "02",
    title: "Основы общения",
    lessons: [
      { id: "a1-4", number: 4, title: "Числа", hu: "Számok" , state: "available" as LessonState },
      { id: "a1-5", number: 5, title: "Возраст", hu: "Életkor" , state: "available" as LessonState },
      { id: "a1-6", number: 6, title: "Семья", hu: "Család" , state: "available" as LessonState },
      { id: "a1-7", number: 7, title: "Профессии", hu: "Foglalkozások" , state: "available" as LessonState },
    ],
  },
  {
    code: "03",
    title: "Повседневная жизнь",
    lessons: [
      { id: "a1-8", number: 8, title: "Мой день", hu: "A napom" , state: "available" as LessonState },
      { id: "a1-9", number: 9, title: "Знакомство и рассказ о себе", hu: "Bemutatkozás" , state: "available" as LessonState },
      { id: "a1-10", number: 10, title: "Еда", hu: "Étel" , state: "available" as LessonState },
      { id: "a1-11", number: 11, title: "Город", hu: "Város" , state: "available" as LessonState },
    ],
  },
  {
    code: "04",
    title: "Город и транспорт",
    lessons: [
      { id: "a1-12", number: 12, title: "Транспорт", hu: "Közlekedés" , state: "available" as LessonState },
      { id: "a1-13", number: 13, title: "Покупки", hu: "Vásárlás" , state: "available" as LessonState },
      { id: "a1-14", number: 14, title: "В кафе", hu: "A kávézóban" , state: "available" as LessonState },
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
  status: "learned" | "learning" | "new";
};

export const dictionary: DictionaryEntry[] = [
  { hu: "Szia", ru: "Привет", transcription: "[сиа]", category: "Приветствия", status: "new" },
  { hu: "Köszönöm", ru: "Спасибо", transcription: "[кёсёнём]", category: "Базовое", status: "new" },
  { hu: "Jó reggelt", ru: "Доброе утро", transcription: "[йо реггельт]", category: "Приветствия", status: "new" },
  { hu: "Viszlát", ru: "До свидания", transcription: "[вислат]", category: "Приветствия", status: "new" },
  { hu: "Igen", ru: "Да", transcription: "[иген]", category: "Базовое", status: "new" },
  { hu: "Nem", ru: "Нет", transcription: "[нем]", category: "Базовое", status: "new" },
  { hu: "Kérem", ru: "Пожалуйста", transcription: "[керем]", category: "Базовое", status: "new" },
  { hu: "Bocsánat", ru: "Извините", transcription: "[бочанат]", category: "Базовое", status: "new" },
  { hu: "Egy", ru: "Один", transcription: "[эдь]", category: "Числа", status: "new" },
  { hu: "Kettő", ru: "Два", transcription: "[кеттё]", category: "Числа", status: "new" },
  { hu: "Három", ru: "Три", transcription: "[харом]", category: "Числа", status: "new" },
  { hu: "Anya", ru: "Мама", transcription: "[аня]", category: "Семья", status: "new" },
  { hu: "Apa", ru: "Папа", transcription: "[апа]", category: "Семья", status: "new" },
  { hu: "Testvér", ru: "Брат / сестра", transcription: "[тештвер]", category: "Семья", status: "new" },
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
/** Empty until real notifications are delivered from the backend. */
export const notifications: { title: string; text: string; time: string }[] = [];

/** Static catalogue metadata (content, not user data). */
export const courses = [
  { id: "a1", code: "A1", title: "Венгерский A1", description: "База: алфавит, приветствия, числа, первые диалоги.", lessons: a1LessonIds.length, modules: a1Modules.length, hours: 24, progress: 0, state: "available" as "available" | "soon" | "locked" },
  { id: "a2", code: "A2", title: "Венгерский A2", description: "Расширение лексики и грамматики повседневного общения.", lessons: 0, modules: 0, hours: 0, progress: 0, state: "soon" as "available" | "soon" | "locked" },
  { id: "b1", code: "B1", title: "Венгерский B1", description: "Свободные диалоги, работа и учёба.", lessons: 0, modules: 0, hours: 0, progress: 0, state: "soon" as "available" | "soon" | "locked" },
  { id: "speaking", code: "SP", title: "Разговорный клуб", description: "Практика речи с преподавателем.", lessons: 0, modules: 0, hours: 0, progress: 0, state: "soon" as "available" | "soon" | "locked" },
];

/** Zeroed placeholders: replaced by real values from getLearningStats. */
export const learningStats = {
  courseProgress: 0,
  wordsLearned: 0,
  lessonsDone: 0,
  lessonsTotal: a1LessonIds.length,
  streak: 0,
  timeSpent: "0 ч",
};

export const currentLesson = {
  id: a1LessonIds[0]!,
  courseId: "a1",
  courseTitle: "Венгерский A1",
  module: a1Modules[0]!.title,
  number: 1,
  title: a1Modules[0]!.lessons[0]!.title,
  duration: "15 мин",
  tasks: 8,
  progress: 0,
};

export const weeklyActivity = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((day) => ({ day, minutes: 0, words: 0 }));
export const weeklyWords = [1, 2, 3, 4].map((n) => ({ week: `${n} нед.`, words: 0 }));
export const accuracyData = [
  { name: "Верно", value: 0 },
  { name: "Ошибки", value: 100 },
];
export const skillProgress = [
  { section: "Лексика", skill: "Лексика", value: 0 },
  { section: "Грамматика", skill: "Грамматика", value: 0 },
  { section: "Аудирование", skill: "Аудирование", value: 0 },
  { section: "Речь", skill: "Речь", value: 0 },
];
export const activityCalendar = Array.from({ length: 91 }, (_, i) => ({ date: `d${i}`, day: i, level: 0 }));

/** Achievement list with locked state until real progress unlocks them. */
export const achievements = achievementDefs.map((a) => ({ ...a, unlocked: false, progress: 0 }));

export type LessonStep =
  | { kind: "theory"; title: string; body: string; examples: { hu: string; ru: string }[] }
  | { kind: "word"; hu: string; ru: string; transcription: string; hint?: string }
  | { kind: "choice"; prompt: string; options: string[]; correct: number }
  | { kind: "listen"; prompt: string; options: string[]; correct: number }
  | { kind: "input"; prompt: string; hu: string; answers: string[] }
  | { kind: "build"; prompt: string; ru: string; tokens: string[]; correct: string[] };

/** Placeholder step list; protected content is fetched from the server. */
export const lessonSteps: LessonStep[] = [
  {
    kind: "theory",
    title: "Приветствие",
    body: "Szia — неформальное «привет». Jó napot — вежливое «добрый день».",
    examples: [
      { hu: "Szia!", ru: "Привет!" },
      { hu: "Jó napot!", ru: "Добрый день!" },
    ],
  },
  { kind: "word", hu: "Köszönöm", ru: "Спасибо", transcription: "[кёсёнём]", hint: "Вежливая форма" },
  { kind: "choice", prompt: "Как сказать «Спасибо»?", options: ["Kérem", "Köszönöm", "Viszlát"], correct: 1 },
  { kind: "input", prompt: "Переведите на венгерский", hu: "Да", answers: ["igen"] },
];
