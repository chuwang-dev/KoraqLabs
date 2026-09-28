export type DateRangePreset =
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "last90"
  | "this_month"
  | "last_month"
  | "custom";

export const DATE_RANGE_PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7", label: "Last 7 days" },
  { value: "last30", label: "Last 30 days" },
  { value: "last90", label: "Last 90 days" },
  { value: "this_month", label: "This month" },
  { value: "last_month", label: "Last month" },
  { value: "custom", label: "Custom range" },
];

export type ResolvedDateRange = {
  preset: DateRangePreset;
  from: Date;
  to: Date; // exclusive upper bound
  label: string;
};

// Koraq Labs' primary audience is Nigerian ("Today"/"This month" should mean
// Lagos calendar days), but the app server almost never runs in that
// timezone — Vercel functions run in UTC. Computing boundaries from
// `new Date().setHours(0,0,0,0)` would silently use the *server's* local
// time, which on a UTC host makes "Today" start and end an hour off from
// an actual day in Lagos. West Africa Time is a fixed UTC+1 with no DST,
// so a constant offset is exact — no timezone database or Intl dependency
// needed just to get this right.
const LAGOS_OFFSET_MS = 60 * 60 * 1000;

function lagosCalendarParts(date: Date): { year: number; month: number; day: number } {
  const shifted = new Date(date.getTime() + LAGOS_OFFSET_MS);
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth(), day: shifted.getUTCDate() };
}

/** UTC instant for the start (00:00:00.000) of a given Lagos calendar day. */
function lagosDayStart(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0) - LAGOS_OFFSET_MS);
}

/** UTC instant for the end (23:59:59.999) of a given Lagos calendar day. */
function lagosDayEnd(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day, 23, 59, 59, 999) - LAGOS_OFFSET_MS);
}

function parseLagosDateString(value: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]) - 1, day: Number(match[3]) };
}

/**
 * Resolves URL search params (`range`, and `from`/`to` for custom) into a
 * concrete date window, with day/month boundaries computed in West Africa
 * Time rather than the server's local timezone. Defaults to the last 30
 * days on anything unrecognized, matching the spec's stated default.
 */
export function resolveDateRange(params: {
  range?: string;
  from?: string;
  to?: string;
}): ResolvedDateRange {
  const now = new Date();
  const today = lagosCalendarParts(now);
  const preset = (params.range as DateRangePreset) || "last30";

  switch (preset) {
    case "today":
      return {
        preset,
        from: lagosDayStart(today.year, today.month, today.day),
        to: lagosDayEnd(today.year, today.month, today.day),
        label: "Today",
      };

    case "yesterday": {
      const y = lagosCalendarParts(new Date(now.getTime() - 24 * 60 * 60 * 1000));
      return {
        preset,
        from: lagosDayStart(y.year, y.month, y.day),
        to: lagosDayEnd(y.year, y.month, y.day),
        label: "Yesterday",
      };
    }

    case "last7": {
      const start = lagosCalendarParts(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));
      return {
        preset,
        from: lagosDayStart(start.year, start.month, start.day),
        to: lagosDayEnd(today.year, today.month, today.day),
        label: "Last 7 days",
      };
    }

    case "last90": {
      const start = lagosCalendarParts(new Date(now.getTime() - 89 * 24 * 60 * 60 * 1000));
      return {
        preset,
        from: lagosDayStart(start.year, start.month, start.day),
        to: lagosDayEnd(today.year, today.month, today.day),
        label: "Last 90 days",
      };
    }

    case "this_month":
      return {
        preset,
        from: lagosDayStart(today.year, today.month, 1),
        to: lagosDayEnd(today.year, today.month, today.day),
        label: "This month",
      };

    case "last_month": {
      const lastMonthYear = today.month === 0 ? today.year - 1 : today.year;
      const lastMonth = today.month === 0 ? 11 : today.month - 1;
      const daysInLastMonth = new Date(Date.UTC(lastMonthYear, lastMonth + 1, 0)).getUTCDate();
      return {
        preset,
        from: lagosDayStart(lastMonthYear, lastMonth, 1),
        to: lagosDayEnd(lastMonthYear, lastMonth, daysInLastMonth),
        label: "Last month",
      };
    }

    case "custom": {
      const from = params.from ? parseLagosDateString(params.from) : null;
      const to = params.to ? parseLagosDateString(params.to) : null;
      if (from && to) {
        return {
          preset,
          from: lagosDayStart(from.year, from.month, from.day),
          to: lagosDayEnd(to.year, to.month, to.day),
          label: `${params.from} – ${params.to}`,
        };
      }
      // Incomplete custom range — fall through to the default below.
      break;
    }
  }

  const start = lagosCalendarParts(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000));
  return {
    preset: "last30",
    from: lagosDayStart(start.year, start.month, start.day),
    to: lagosDayEnd(today.year, today.month, today.day),
    label: "Last 30 days",
  };
}
