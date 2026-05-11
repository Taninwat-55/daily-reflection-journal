"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface JournalCalendarProps {
  entryDates: string[];
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function JournalCalendar({ entryDates }: JournalCalendarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [month, setMonth] = useState(new Date());

  const activeDateStr = searchParams.get("date");
  const activeDate = activeDateStr ? parseISO(activeDateStr) : null;

  const parsedEntryDates = entryDates.map((d) => parseISO(d));

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startPadding = monthStart.getDay();

  function handleDayClick(day: Date) {
    const formatted = format(day, "yyyy-MM-dd");
    const params = new URLSearchParams(searchParams.toString());

    if (activeDateStr === formatted) {
      params.delete("date");
    } else {
      params.set("date", formatted);
    }

    router.push(`/?${params.toString()}`);
  }

  function hasEntry(day: Date) {
    return parsedEntryDates.some((d) => isSameDay(d, day));
  }

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-journal-text">
          {format(month, "MMMM yyyy")}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1))}
            className="p-1 text-journal-muted hover:text-journal-text transition-colors rounded"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1))}
            className="p-1 text-journal-muted hover:text-journal-text transition-colors rounded"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[10px] text-journal-muted font-medium py-1">
            {d}
          </div>
        ))}

        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {days.map((day) => {
          const inMonth = isSameMonth(day, month);
          const today = isToday(day);
          const active = activeDate ? isSameDay(day, activeDate) : false;
          const hasJournalEntry = hasEntry(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={!inMonth}
              className={`
                relative flex items-center justify-center text-[11px] rounded-md h-7 w-full transition-colors
                ${!inMonth ? "opacity-0 pointer-events-none" : ""}
                ${active ? "bg-journal-accent text-journal-bg font-semibold" : ""}
                ${today && !active ? "text-journal-accent font-semibold" : ""}
                ${!active && !today ? "text-journal-muted hover:text-journal-text hover:bg-journal-raised" : ""}
              `}
            >
              {format(day, "d")}
              {hasJournalEntry && !active && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-journal-accent opacity-70" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
