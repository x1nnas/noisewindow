// Convert time string (HH:MM) to minutes since midnight
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Validate that start time is before end time
export const validateTimeRange = (start: string, end: string): boolean => {
  if (!start || !end) return false;
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  return startMinutes < endMinutes;
};

// Validate time format (HH:MM)
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Safely parse JSON from localStorage with fallback
export const safeParseJSON = <T>(jsonString: string | null, fallback: T | null): T | null => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
};

// Format countdown time (minutes) to human-readable string
export const formatCountdown = (minutes: number, t: { hours: string; minutes: string }): string => {
  if (minutes <= 0) return '';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `${hours}${t.hours} ${mins}${t.minutes}`;
  } else if (hours > 0) {
    return `${hours}${t.hours}`;
  } else {
    return `${mins}${t.minutes}`;
  }
};
