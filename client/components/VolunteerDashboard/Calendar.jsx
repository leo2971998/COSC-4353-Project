import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const CalendarView = ({ upcomingEvents, allEvents }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  /* ─────────────────────────────
     Date helpers
     ───────────────────────────── */
  const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
  ).getDate();

  const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
  ).getDay();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const prevMonth = () =>
      setCurrentMonth(
          new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
      );
  const nextMonth = () =>
      setCurrentMonth(
          new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      );

  /* ─────────────────────────────
     Render 1–31 grid with dots
     ───────────────────────────── */
  const renderCalendarDays = () => {
    const days = [];

    // Blank cells before day-1
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 md:h-14" />);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const event = allEvents.find(
          (e) =>
              e.date.getDate()   === day &&
              e.date.getMonth()  === currentMonth.getMonth() &&
              e.date.getFullYear() === currentMonth.getFullYear()
      );

      days.push(
          <div
              key={day}
              onClick={() => event && setSelectedEvent(event.details || event)}
              className={`h-10 md:h-14 flex flex-col items-center justify-center rounded-lg ${
                  event
                      ? "bg-indigo-800 hover:bg-indigo-700 cursor-pointer"
                      : "hover:bg-[#1a2035] cursor-pointer"
              }`}
          >
            <span className="text-sm">{day}</span>
            {event && (
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1" />
            )}
          </div>
      );
    }

    return days;
  };

  /* ─────────────────────────────
     JSX
     ───────────────────────────── */
  return (
      <div className="bg-[#222b45] rounded-xl p-6 mb-6">
        {/* header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Calendar</h2>
          <div className="flex items-center space-x-4">
            <button
                onClick={prevMonth}
                className="p-1 rounded-full bg-[#1a2035] hover:bg-indigo-700"
            >
              <ChevronLeft size={20} />
            </button>
            <span>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
            <button
                onClick={nextMonth}
                className="p-1 rounded-full bg-[#1a2035] hover:bg-indigo-700"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* weekday header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((d) => (
              <div key={d} className="text-center text-sm text-gray-400">
                {d}
              </div>
          ))}
        </div>

        {/* day cells */}
        <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

        {/* Upcoming list */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h3 className="font-medium mb-2">Upcoming Confirmed Events</h3>

          {[...upcomingEvents]              // clone so we don’t mutate state
              .sort((a, b) => a.date - b.date)   // earliest → latest
              .map((event, idx) => (
                  <div
                      key={idx}
                      className="bg-[#1a2035] rounded-lg p-3 mb-2 flex justify-between"
                  >
                    <span>{event.title}</span>
                    <span className="text-indigo-400">
            {event.date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
                  </div>
              ))}
        </div>

        {/* Pop-up */}
        {selectedEvent && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-[#1a2035] text-white rounded-xl p-6 w-[90%] max-w-md relative shadow-lg">
                {/* close */}
                <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
                >
                  &times;
                </button>

                {/* title */}
                <h3 className="text-2xl font-semibold text-indigo-400 mb-4">
                  {selectedEvent.event_name || selectedEvent.title}
                </h3>

                {/* when */}
                <p className="text-sm">
                  {new Date(selectedEvent.start_time || selectedEvent.date).toLocaleString()}
                  {selectedEvent.end_time && (
                      <> &mdash; {new Date(selectedEvent.end_time).toLocaleString()}</>
                  )}
                </p>

                {/* where */}
                {selectedEvent.event_location && (
                    <p className="text-sm mt-1">
                      <strong>Location:</strong> {selectedEvent.event_location}
                    </p>
                )}

                {/* urgency */}
                {selectedEvent.urgency && (
                    <p className="text-sm mt-1">
                      <strong>Urgency:</strong> {selectedEvent.urgency}
                    </p>
                )}

                {/* skills */}
                {selectedEvent.required_skills && (
                    <p className="text-sm mt-1">
                      <strong>Required skills:</strong> {selectedEvent.required_skills}
                    </p>
                )}

                {/* description */}
                {selectedEvent.event_description && (
                    <p className="text-sm mt-3 whitespace-pre-wrap">
                      {selectedEvent.event_description}
                    </p>
                )}
              </div>
            </div>
        )}
      </div>
  );
};
