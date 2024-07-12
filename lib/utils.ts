import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Returns a random number between 0 and 9
export function getRandomNumber() {
	return Math.floor(Math.random() * 10);
}

export function getDuration(duration: number) {
	const milliToSeconds = Math.round(duration / 1000);
	const minutes = Math.floor(milliToSeconds / 60);
	const seconds = milliToSeconds % 60;
	return `${minutes}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`;
}
