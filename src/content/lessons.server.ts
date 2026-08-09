// SERVER ONLY. Protected lesson content: never bundled into the client, only
// returned by a server function after the user's access status is verified.

export type LessonStep =
  | { kind: "theory"; title: string; body: string; examples: { hu: string; ru: string }[] }
  | { kind: "word"; hu: string; ru: string; transcription: string; hint: string }
  | { kind: "choice"; prompt: string; options: string[]; correct: number }
  | { kind: "input"; prompt: string; hu: string; answers: string[] }
  | { kind: "build"; prompt: string; tokens: string[]; correct: string[]; ru: string }
  | { kind: "listen"; prompt: string; hu: string; options: string[]; correct: number };

const baseSteps: LessonStep[] = [
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
    ru: "Меня зовут Шандор.",
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
  { kind: "input", prompt: "Введите перевод слова", hu: "Igen", answers: ["да"] },
  {
    kind: "choice",
    prompt: "Выберите правильный ответ на «Hogy vagy?»",
    options: ["Köszönöm, jól", "Viszlát", "Nem értem", "Jó éjszakát"],
    correct: 0,
  },
];

export function getStepsForLesson(_lessonId: string): LessonStep[] {
  return baseSteps;
}

export function countWordSteps(lessonId: string): number {
  return getStepsForLesson(lessonId).filter((s) => s.kind === "word").length;
}