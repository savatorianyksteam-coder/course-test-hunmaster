import type { DictionaryEntry } from "./dictionary.types";

// Paid course material: keep this module server-only so words never ship in an unauthorized bundle.
export const dictionaryEntries: DictionaryEntry[] = [
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
