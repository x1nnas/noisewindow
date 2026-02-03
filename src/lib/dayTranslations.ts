import { Language, translations } from './translations';

// Map English day names to translation keys
const dayKeyMap: Record<string, keyof typeof translations.en.days> = {
  'Tomorrow': 'tomorrow',
  'Monday': 'monday',
  'Tuesday': 'tuesday',
  'Wednesday': 'wednesday',
  'Thursday': 'thursday',
  'Friday': 'friday',
  'Saturday': 'saturday',
  'Sunday': 'sunday',
};

// Map translation keys back to English day names (for storage)
const reverseDayKeyMap: Record<string, string> = {
  'tomorrow': 'Tomorrow',
  'monday': 'Monday',
  'tuesday': 'Tuesday',
  'wednesday': 'Wednesday',
  'thursday': 'Thursday',
  'friday': 'Friday',
  'saturday': 'Saturday',
  'sunday': 'Sunday',
};

export const translateDayName = (dayName: string, language: Language): string => {
  const dayKey = dayKeyMap[dayName];
  if (dayKey) {
    return translations[language].days[dayKey];
  }
  // If not found in map, return original (fallback)
  return dayName;
};

export const getEnglishDayName = (dayKey: string): string => {
  return reverseDayKeyMap[dayKey] || dayKey;
};
