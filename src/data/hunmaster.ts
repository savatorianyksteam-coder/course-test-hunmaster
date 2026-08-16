/** Brand copy and static UI definitions for HunMaster Learn. */

export const brand = {
  name: "HunMaster",
  product: "HunMaster Learn",
  telegram: "https://t.me/HunMaster",
};

export type AccessStatus = "active" | "pending" | "expired" | "blocked";
export type UserRole = "student" | "moderator" | "teacher" | "admin" | "owner";

export const navItems = [
  { label: "Главная", to: "/" },
  { label: "Мои курсы", to: "/courses" },
  { label: "Словарь", to: "/dictionary" },
  { label: "Прогресс", to: "/progress" },
  { label: "Достижения", to: "/achievements" },
] as const;

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
  {
    hu: "Jó reggelt",
    ru: "Доброе утро",
    transcription: "[йо реггельт]",
    category: "Приветствия",
    status: "new",
  },
  {
    hu: "Viszlát",
    ru: "До свидания",
    transcription: "[вислат]",
    category: "Приветствия",
    status: "new",
  },
  { hu: "Igen", ru: "Да", transcription: "[иген]", category: "Базовое", status: "new" },
  { hu: "Nem", ru: "Нет", transcription: "[нем]", category: "Базовое", status: "new" },
  { hu: "Kérem", ru: "Пожалуйста", transcription: "[керем]", category: "Базовое", status: "new" },
  {
    hu: "Bocsánat",
    ru: "Извините",
    transcription: "[бочанат]",
    category: "Базовое",
    status: "new",
  },
  { hu: "Egy", ru: "Один", transcription: "[эдь]", category: "Числа", status: "new" },
  { hu: "Kettő", ru: "Два", transcription: "[кеттё]", category: "Числа", status: "new" },
  { hu: "Három", ru: "Три", transcription: "[харом]", category: "Числа", status: "new" },
  { hu: "Anya", ru: "Мама", transcription: "[аня]", category: "Семья", status: "new" },
  { hu: "Apa", ru: "Папа", transcription: "[апа]", category: "Семья", status: "new" },
  {
    hu: "Testvér",
    ru: "Брат / сестра",
    transcription: "[тештвер]",
    category: "Семья",
    status: "new",
  },
];

export const dictionaryCategories = ["Все", "Приветствия", "Базовое", "Числа", "Семья"] as const;

/** Achievement definitions. Unlock state is derived from real progress. */
export const achievementDefs = [
  {
    id: "first-lesson",
    title: "Первый урок",
    description: "Пройдите первый урок",
    icon: "book",
    target: 1,
    metric: "lessons",
  },
  {
    id: "lessons-5",
    title: "5 уроков",
    description: "Пройдите 5 уроков",
    icon: "trophy",
    target: 5,
    metric: "lessons",
  },
  {
    id: "module-1",
    title: "Первый модуль",
    description: "Завершите все уроки модуля 01",
    icon: "award",
    target: 3,
    metric: "lessons",
  },
  {
    id: "streak-3",
    title: "3 дня подряд",
    description: "Занимайтесь три дня подряд",
    icon: "flame",
    target: 3,
    metric: "streak",
  },
  {
    id: "words-20",
    title: "20 слов",
    description: "Выучите 20 новых слов",
    icon: "star",
    target: 20,
    metric: "words",
  },
  {
    id: "perfect",
    title: "Идеальный результат",
    description: "Пройдите урок без ошибок",
    icon: "target",
    target: 1,
    metric: "perfect",
  },
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
export const skillProgress = [
  { section: "Лексика", skill: "Лексика", value: 0 },
  { section: "Грамматика", skill: "Грамматика", value: 0 },
  { section: "Аудирование", skill: "Аудирование", value: 0 },
  { section: "Речь", skill: "Речь", value: 0 },
];

/** Achievement list with locked state until real progress unlocks them. */
export const achievements = achievementDefs.map((a) => ({ ...a, unlocked: false, progress: 0 }));
