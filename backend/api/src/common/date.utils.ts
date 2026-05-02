export function hoursAgo(hours: number): Date {
  return new Date(Date.now() - 1000 * 60 * 60 * hours);
}

export function daysAgo(days: number): Date {
  return new Date(Date.now() - 1000 * 60 * 60 * 24 * days);
}

export function isOlderThan(date: Date | null | undefined, hours: number): boolean {
  if (!date) {
    return true;
  }

  return date.getTime() < hoursAgo(hours).getTime();
}