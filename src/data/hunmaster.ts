/**
 * MOCK / DEMO data layer for HunMaster Learn.
 *
 * Everything here is intentionally isolated from components so it can later be
 * swapped for Supabase queries (auth, courses, lessons, progress, access status)
 * without touching the UI.
 */

export const brand = {
  name: "HunMaster",
  product: "HunMaster Learn",
  telegram: "https://t.me/HunMaster",
};

export type AccessStatus = "active" | "pending" | "expired" | "blocked";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  telegram: string;
  level: string;
  accessStatus: AccessStatus;
  accessUntil: string;
};

export const demoUser: DemoUser = {
  id: "demo-user",
  name: "Александр",
  email: "alexander@example.com",
  telegram: "@alexander",
  level: "A1",
  accessStatus: "active",
  accessUntil: "12 сентября 2026",
};

export const learningStats = {
  courseProgress: 34,
  wordsLearned: 246,
  lessonsDone: 21,
  lessonsTotal: 60,
  streak: 7,
  timeSpent: "12 ч 43 мин",
  accuracy: 87,
  modulesTotal: 12,
  hoursTotal: 30,
};

export const navItems = [
  { label: "Главная", to: "/" },
  { label: "Мои курсы", to: "/courses" },
  { label: "Словарь", to: "/dictionary" },
  { label: "Прогресс", to: "/progress" },
  { label: "Достижения", to: "/achievements" },
] as const;

export const notifications = [
  { title: "Урок 12 ждёт вас", text: "Знакомство и рассказ о себе — 45% пройдено", time: "5 мин" },
  { title: "Серия 7 дней", text: "Не прерывайте серию — занимайтесь сегодня", time: "2 ч" },
  { title: "Новый модуль открыт", text: "Модуль 03 «Повседневная жизнь»", time: "вчера" },
];

export const currentLesson = {
  id: "a1-12",
  courseId: "a1",
  courseTitle: "Hungarian A1",
  module: "Модуль 3",
  number: 12,
  title: "Знакомство и рассказ о себе",
  progress: 45,
  duration: "14 минут",
  tasks: 10,
};

export type CourseCard = {
  id: string;
  code: string;
  title: string;
  description: string;
  lessons: number;
  modules: number;
  hours: number;
  progress: number;
  state: "active" | "locked" | "soon";
};

export const courses: CourseCard[] = [
  {
    id: "a1",
    code: "A1",
    title: "Венгерский язык A1",
    description: "Алфавит, произношение, первые фразы и уверенное знакомство.",
    lessons: 60,
    modules: 12,
    hours: 30,
    progress: 34,
    state: "active",
  },
  {
    id: "a2",
    code: "A2",
    title: "Венгерский A2",
    description: "Повседневные ситуации, прошедшее время и расширенный словарь.",
    lessons: 72,
    modules: 14,
    hours: 38,
    progress: 0,
    state: "locked",
  },
  {
    id: "b1",
    code: "B1",
    title: "Венгерский B1",
    description: "Свободные диалоги, падежи и работа с настоящими текстами.",
    lessons: 84,
    modules: 16,
    hours: 46,
    progress: 0,
    state: "locked",
  },
  {
    id: "speaking",
    code: "SPK",
    title: "Разговорный венгерский",
    description: "Живые диалоги, интонация и уверенная речь в реальных ситуациях.",
    lessons: 40,
    modules: 8,
    hours: 22,
    progress: 0,
    state: "soon",
  },
];

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
      { id: "a1-1", number: 1, title: "Приветствие", hu: "Köszöntés", state: "done" },
      { id: "a1-2", number: 2, title: "Знакомство", hu: "Ismerkedés", state: "done" },
      { id: "a1-3", number: 3, title: "Основные выражения", hu: "Alapkifejezések", state: "done" },
    ],
  },
  {
    code: "02",
    title: "Основы общения",
    lessons: [
      { id: "a1-4", number: 4, title: "Числа", hu: "Számok", state: "done" },
      { id: "a1-5", number: 5, title: "Возраст", hu: "Életkor", state: "done" },
      { id: "a1-6", number: 6, title: "Семья", hu: "Család", state: "available" },
      { id: "a1-7", number: 7, title: "Профессии", hu: "Foglalkozások", state: "locked" },
    ],
  },
  {
    code: "03",
    title: "Повседневная жизнь",
    lessons: [
      { id: "a1-11", number: 11, title: "Мой день", hu: "A napom", state: "done" },
      { id: "a1-12", number: 12, title: "Знакомство и рассказ о себе", hu: "Bemutatkozás", state: "current" },
      { id: "a1-13", number: 13, title: "Еда", hu: "Étel", state: "locked" },
      { id: "a1-14", number: 14, title: "Город", hu: "Város", state: "locked" },
    ],
  },
  {
    code: "04",
    title: "Город и транспорт",
    lessons: [
      { id: "a1-15", number: 15, title: "Транспорт", hu: "Közlekedés", state: "locked" },
      { id: "a1-16", number: 16, title: "Покупки", hu: "Vásárlás", state: "locked" },
      { id: "a1-17", number: 17, title: "В кафе", hu: "A kávézóban", state: "locked" },
    ],
  },
];

export type LessonStep =
  | { kind: "theory"; title: string; body: string; examples: { hu: string; ru: string }[] }
  | { kind: "word"; hu: string; ru: string; transcription: string; hint: string }
  | { kind: "choice"; prompt: string; options: string[]; correct: number }
  | { kind: "input"; prompt: string; hu: string; answers: string[] }
  | { kind: "build"; prompt: string; tokens: string[]; correct: string[]; ru: string }
  | { kind: "listen"; prompt: string; hu: string; options: string[]; correct: number };

export const lessonSteps: LessonStep[] = [
  {
    kind: "theory",
    title: "Как представиться по-венгерски",
    body: "В венгерском языке имя обычно называют после фразы «A nevem…» — «Меня зовут…». Ударение всегда падает на первый слог.",
    examples: [
      { hu: "A nevem Sándor.", ru: "Меня зовут Шандор." },
      { hu: "Örvendek!", ru: "Приятно познакомиться!" },
    ],
  },
  {
    kind: "word",
    hu: "Köszönöm",
    ru: "Спасибо",
    transcription: "[кёсёнём]",
    hint: "Более короткий вариант — «Kösz», уместен в неформальной речи.",
  },
  {
    kind: "choice",
    prompt: "Как переводится «Köszönöm»?",
    options: ["Привет", "Спасибо", "Пожалуйста", "До свидания"],
    correct: 1,
  },
  {
    kind: "input",
    prompt: "Введите перевод слова",
    hu: "Jó reggelt",
    answers: ["доброе утро", "доброе утро!"],
  },
  {
    kind: "build",
    prompt: "Составьте предложение",
    ru: "Меня зовут Александр.",
    tokens: ["nevem", "Sándor", "A", "."],
    correct: ["A", "nevem", "Sándor", "."],
  },
  {
    kind: "listen",
    prompt: "Прослушайте и выберите услышанное слово",
    hu: "Viszlát",
    options: ["Viszlát", "Vasárnap", "Virág", "Város"],
    correct: 0,
  },
  {
    kind: "choice",
    prompt: "Какое приветствие используют утром?",
    options: ["Jó estét", "Jó reggelt", "Jó éjszakát", "Viszlát"],
    correct: 1,
  },
  {
    kind: "word",
    hu: "Örvendek",
    ru: "Приятно познакомиться",
    transcription: "[ёрвендек]",
    hint: "Употребляется при первом знакомстве.",
  },
  {
    kind: "input",
    prompt: "Введите перевод слова",
    hu: "Igen",
    answers: ["да"],
  },
  {
    kind: "choice",
    prompt: "Выберите правильный ответ на «Hogy vagy?»",
    options: ["Köszönöm, jól", "Viszlát", "Nem értem", "Jó éjszakát"],
    correct: 0,
  },
];

export type DictionaryEntry = {
  hu: string;
  ru: string;
  transcription: string;
  category: "Приветствия" | "Базовое" | "Числа" | "Семья";
  status: "learned" | "learning" | "new";
};

export const dictionary: DictionaryEntry[] = [
  { hu: "Szia", ru: "Привет", transcription: "[сиа]", category: "Приветствия", status: "learned" },
  { hu: "Köszönöm", ru: "Спасибо", transcription: "[кёсёнём]", category: "Базовое", status: "learned" },
  { hu: "Jó reggelt", ru: "Доброе утро", transcription: "[йо реггельт]", category: "Приветствия", status: "learning" },
  { hu: "Viszlát", ru: "До свидания", transcription: "[висláт]", category: "Приветствия", status: "learned" },
  { hu: "Igen", ru: "Да", transcription: "[иген]", category: "Базовое", status: "learned" },
  { hu: "Nem", ru: "Нет", transcription: "[нем]", category: "Базовое", status: "learned" },
  { hu: "Kérem", ru: "Пожалуйста", transcription: "[керем]", category: "Базовое", status: "learning" },
  { hu: "Bocsánat", ru: "Извините", transcription: "[бочанат]", category: "Базовое", status: "new" },
  { hu: "Egy", ru: "Один", transcription: "[эдь]", category: "Числа", status: "learned" },
  { hu: "Kettő", ru: "Два", transcription: "[кеттё]", category: "Числа", status: "learning" },
  { hu: "Három", ru: "Три", transcription: "[харом]", category: "Числа", status: "new" },
  { hu: "Anya", ru: "Мама", transcription: "[аня]", category: "Семья", status: "learned" },
  { hu: "Apa", ru: "Папа", transcription: "[апа]", category: "Семья", status: "learning" },
  { hu: "Testvér", ru: "Брат / сестра", transcription: "[тештвер]", category: "Семья", status: "new" },
];

export const dictionaryCategories = ["Все", "Приветствия", "Базовое", "Числа", "Семья"] as const;

export type AchievementId =
  | "first-lesson"
  | "streak-7"
  | "words-100"
  | "first-module"
  | "lessons-20"
  | "perfect";

export const achievements: {
  id: AchievementId;
  title: string;
  description: string;
  icon: "award" | "flame" | "star" | "trophy" | "book" | "target";
  unlocked: boolean;
  progress: number;
}[] = [
  { id: "first-lesson", title: "Первый урок", description: "Начало пути", icon: "book", unlocked: true, progress: 100 },
  { id: "streak-7", title: "7 дней подряд", description: "Серия занятий", icon: "flame", unlocked: true, progress: 100 },
  { id: "words-100", title: "100 слов", description: "Словарь растёт", icon: "star", unlocked: true, progress: 100 },
  { id: "first-module", title: "Первый модуль", description: "Модуль 01 завершён", icon: "award", unlocked: true, progress: 100 },
  { id: "lessons-20", title: "20 уроков", description: "21 из 20 уроков", icon: "trophy", unlocked: true, progress: 100 },
  { id: "perfect", title: "Идеальный результат", description: "Урок без единой ошибки", icon: "target", unlocked: false, progress: 60 },
];

export const weeklyActivity = [
  { day: "Пн", minutes: 18, words: 12 },
  { day: "Вт", minutes: 25, words: 18 },
  { day: "Ср", minutes: 12, words: 8 },
  { day: "Чт", minutes: 32, words: 24 },
  { day: "Пт", minutes: 22, words: 15 },
  { day: "Сб", minutes: 40, words: 29 },
  { day: "Вс", minutes: 28, words: 21 },
];

export const weeklyWords = [
  { week: "1 нед.", words: 34 },
  { week: "2 нед.", words: 52 },
  { week: "3 нед.", words: 71 },
  { week: "4 нед.", words: 89 },
];

export const accuracyData = [
  { name: "Верно", value: 87 },
  { name: "Ошибки", value: 13 },
];

export const skillProgress = [
  { section: "Словарь", value: 62 },
  { section: "Грамматика", value: 41 },
  { section: "Чтение", value: 47 },
  { section: "Аудирование", value: 35 },
  { section: "Произношение", value: 28 },
];

export const activityCalendar: { day: number; level: number }[] = Array.from(
  { length: 91 },
  (_, i) => ({ day: i, level: Math.floor((Math.sin(i * 1.7) + 1) * 2.4) % 5 }),
);

export const accessCopy: Record<
  AccessStatus,
  { title: string; description: string; cta?: string }
> = {
  active: { title: "Доступ активен", description: "Все материалы курса открыты." },
  pending: {
    title: "Доступ ожидает активации",
    description: "Ваш аккаунт создан, но курс пока не активирован.",
    cta: "Связаться с HunMaster",
  },
  expired: {
    title: "Срок доступа закончился",
    description: "Прогресс сохранён. Продлите доступ, чтобы продолжить обучение.",
    cta: "Продлить доступ",
  },
  blocked: {
    title: "Доступ к аккаунту ограничен",
    description: "Обратитесь в поддержку, чтобы восстановить доступ.",
    cta: "Написать в поддержку",
  },
};