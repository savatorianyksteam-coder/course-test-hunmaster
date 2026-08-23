export type DictionaryEntry = {
  hu: string;
  ru: string;
  transcription: string;
  category: "Приветствия" | "Базовое" | "Числа" | "Семья";
  status: "learned" | "learning" | "new";
};

export const dictionaryCategories = ["Все", "Приветствия", "Базовое", "Числа", "Семья"] as const;
