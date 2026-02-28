export interface DaySchedule {
  open: string;
  close: string;
  closed: boolean;
  locationId: string | null;
}

export type WeekSchedule = Record<string, DaySchedule>;

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * Find the next open business day from a given date.
 * Returns the date and associated locationId (if configured).
 * Falls back to tomorrow if no schedule is set or all days are closed.
 */
export function getNextOpenDay(
  schedule: WeekSchedule | null,
  fromDate: Date = new Date()
): { date: Date; dayName: string; locationId: string | null } {
  const tomorrow = new Date(fromDate);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (!schedule) {
    return { date: tomorrow, dayName: DAY_NAMES[tomorrow.getDay()], locationId: null };
  }

  // Search next 7 days for an open day
  for (let i = 1; i <= 7; i++) {
    const candidate = new Date(fromDate);
    candidate.setDate(candidate.getDate() + i);
    const dayName = DAY_NAMES[candidate.getDay()];
    const daySchedule = schedule[dayName];
    if (daySchedule && !daySchedule.closed) {
      return { date: candidate, dayName, locationId: daySchedule.locationId ?? null };
    }
  }

  // All days closed — fallback to tomorrow
  return { date: tomorrow, dayName: DAY_NAMES[tomorrow.getDay()], locationId: null };
}

export function getScheduleForDate(schedule: WeekSchedule | null, date: Date): DaySchedule | null {
  if (!schedule) return null;
  const dayName = DAY_NAMES[date.getDay()];
  return schedule[dayName] ?? null;
}

/**
 * Returns the set of day-of-week indices (0=Sunday … 6=Saturday) that are closed.
 */
export function getClosedDayIndices(schedule: WeekSchedule | null): Set<number> {
  const closed = new Set<number>();
  if (!schedule) return closed;
  for (let i = 0; i < DAY_NAMES.length; i++) {
    const daySchedule = schedule[DAY_NAMES[i]];
    if (daySchedule?.closed) {
      closed.add(i);
    }
  }
  return closed;
}

export { DAY_NAMES };
