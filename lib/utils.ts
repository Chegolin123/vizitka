import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Объединяет Tailwind-классы с сохранением последнего приоритета.
 * Используется всеми UI-компонентами.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
