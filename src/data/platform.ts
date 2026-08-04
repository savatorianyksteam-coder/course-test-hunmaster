import {
  Award,
  BookOpen,
  BrainCircuit,
  CalendarCheck,
  LineChart,
  Mic2,
  type LucideIcon,
} from "lucide-react";

export const platform = {
  name: "MagyarFlow",
  tagline: "Венгерский язык понятным и современным способом",
  heroTitle: "Заговори на венгерском уверенно",
  heroSubtitle:
    "Интерактивный курс, который помогает изучать венгерский язык постепенно, понятно и без скучной зубрёжки.",
};

export const navItems = [
  { label: "Главная", to: "/" },
  { label: "Курсы", to: "/courses" },
  { label: "Практика", to: "/practice" },
  { label: "Прогресс", to: "/progress" },
  { label: "Тарифы", to: "/pricing" },
] as const;

export const heroWords = [
  { hu: "Szia", ru: "Привет" },
  { hu: "Köszönöm", ru: "Спасибо" },
  { hu: "Jó reggelt", ru: "Доброе утро" },
  { hu: "Viszlát", ru: "До свидания" },
];

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: "red" | "green" | "gold";
};

export const features: Feature[] = [
  {
    title: "Короткие уроки",
    description: "Понятные блоки по 10–15 минут, которые легко встроить в обычный день.",
    icon: BookOpen,
    accent: "red",
  },
  {
    title: "Тренировка произношения",
    description: "Разбор сложных венгерских звуков с примерами и визуальной обратной связью.",
    icon: Mic2,
    accent: "green",
  },
  {
    title: "Ежедневная практика",
    description: "Небольшие задания каждый день, чтобы язык становился привычкой.",
    icon: CalendarCheck,
    accent: "gold",
  },
  {
    title: "Отслеживание прогресса",
    description: "Аналитика по разделам, точности и времени обучения в одном месте.",
    icon: LineChart,
    accent: "green",
  },
  {
    title: "Система достижений",
    description: "Награды за серии занятий, выученные слова и уверенную грамматику.",
    icon: Award,
    accent: "red",
  },
  {
    title: "Словарь изученных слов",
    description: "Личная коллекция слов с повторениями по интервальному принципу.",
    icon: BrainCircuit,
    accent: "gold",
  },
];

export const demoUser = {
  name: "Александр",
  level: "A1",
  courseProgress: 34,
  daysLearning: 18,
  streak: 7,
  wordsLearned: 246,
  hoursLearned: 12,
  lessonsDone: 21,
  lessonsTotal: 60,
  startedAt: "12 марта 2026",
  nextGoal: "Завершить раздел «Знакомство»",
};

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

export const sectionProgress = [
  { section: "Словарный запас", value: 62 },
  { section: "Грамматика", value: 41 },
  { section: "Аудирование", value: 35 },
  { section: "Произношение", value: 28 },
  { section: "Чтение", value: 47 },
];

export const currentLesson = {
  title: "Урок 12. Знакомство и рассказ о себе",
  duration: "14 минут",
  tasks: 8,
  progress: 45,
};

export const upcomingLessons = [
  { title: "Приветствие", hu: "Köszöntés", locked: false, tasks: 6 },
  { title: "Числа", hu: "Számok", locked: false, tasks: 7 },
  { title: "Семья", hu: "Család", locked: false, tasks: 8 },
  { title: "Еда", hu: "Étel", locked: false, tasks: 9 },
  { title: "Город", hu: "Város", locked: true, tasks: 8 },
  { title: "Транспорт", hu: "Közlekedés", locked: true, tasks: 7 },
  { title: "Покупки", hu: "Vásárlás", locked: true, tasks: 8 },
  { title: "Общение в кафе", hu: "A kávézóban", locked: true, tasks: 10 },
];

export const dailyGoals = [
  { title: "Пройти один урок", done: true },
  { title: "Повторить десять слов", done: true },
  { title: "Выполнить пять упражнений", done: false },
  { title: "Заниматься не менее пятнадцати минут", done: false },
];

export const achievements = [
  { title: "Первый урок", description: "Начало пути", unlocked: true },
  { title: "Семь дней подряд", description: "Серия занятий", unlocked: true },
  { title: "Сто изученных слов", description: "Словарь растёт", unlocked: true },
  { title: "Отличная грамматика", description: "90% точности", unlocked: false },
  { title: "Мастер произношения", description: "50 разборов звуков", unlocked: false },
  { title: "Месяц обучения", description: "30 дней подряд", unlocked: false },
];

export const courses = [
  {
    code: "A1",
    title: "Венгерский с нуля",
    description: "Алфавит, произношение, первые фразы и уверенное знакомство.",
    lessons: 60,
    duration: "около 3 месяцев",
    progress: 34,
    available: true,
  },
  {
    code: "A2",
    title: "Базовый венгерский",
    description: "Повседневные ситуации, прошедшее время и расширенный словарь.",
    lessons: 72,
    duration: "около 4 месяцев",
    progress: 0,
    available: false,
  },
  {
    code: "B1",
    title: "Средний уровень",
    description: "Свободные диалоги, падежи и работа с настоящими текстами.",
    lessons: 84,
    duration: "около 5 месяцев",
    progress: 0,
    available: false,
  },
  {
    code: "B2",
    title: "Уверенное общение",
    description: "Сложная грамматика, идиомы и обсуждение абстрактных тем.",
    lessons: 96,
    duration: "около 6 месяцев",
    progress: 0,
    available: false,
  },
];

export const lessonStages = [
  "Теория",
  "Новые слова",
  "Аудирование",
  "Практика",
  "Итоговый тест",
];

export const lessonQuestion = {
  prompt: "Выберите правильный перевод слова „Köszönöm“",
  options: ["Привет", "Спасибо", "До свидания", "Пожалуйста"],
  correct: 1,
};

export const plans = [
  {
    name: "Бесплатный",
    price: "0 ₽",
    period: "навсегда",
    features: ["Несколько вводных уроков", "Базовый словарь", "Ограниченная статистика"],
    highlighted: false,
  },
  {
    name: "Полный курс",
    price: "1 490 ₽",
    period: "в месяц",
    features: [
      "Все уроки",
      "Подробная аналитика",
      "Тренировка произношения",
      "Достижения",
      "Персональный прогресс",
    ],
    highlighted: true,
  },
];

export const activityCalendar = Array.from({ length: 91 }, (_, i) => ({
  day: i,
  level: [0, 1, 2, 3, 4][Math.floor((Math.sin(i * 1.7) + 1) * 2.4) % 5],
}));
