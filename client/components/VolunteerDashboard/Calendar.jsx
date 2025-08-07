import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ------------------------------------------------------------
   Generic read-only calendar (volunteer view)
   Leo Nguyen – Fix multi-event display:
     • show the *count* when > 1 events fall on the same day
------------------------------------------------------------ */
export function CalendarView({ upcomingEvents, allEvents }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedEvents, setSelectedEvents] = useState([]); // array!

    /* date helpers */
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

    /* Leo Nguyen – Fix multi-event display */
    const renderCalendarDays = () => {
        const cells = [];
        for (let i = 0; i < firstDayOfMonth; i++)
            cells.push(<div key={`e-${i}`} className="h-10 md:h-14" />);

        for (let day = 1; day <= daysInMonth; day++) {
            const eventsOfDay = allEvents.filter(
                (e) =>
                    e.date.getDate() === day &&
                    e.date.getMonth() === currentMonth.getMonth() &&
                    e.date.getFullYear() === currentMonth.getFullYear()
            );

            const hasEvents = eventsOfDay.length > 0;
            const count = eventsOfDay.length;

            cells.push(
                <div
                    key={day}
                    onClick={() => hasEvents && setSelectedEvents(eventsOfDay)}
                    className={`h-10 md:h-14 flex flex-col items-center justify-center rounded-lg ${
                        hasEvents
                            ? "bg-indigo-800 hover:bg-indigo-700 cursor-pointer"
                            : "hover:bg-[#1a2035] cursor-pointer"
                    }`}
                >
                    <span className="text-sm">{day}</span>
                    {hasEvents && (
                        <div className="flex items-center gap-0.5 mt-1">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                            {/* Leo Nguyen – Fix multi-event display (count badge) */}
                            {count > 1 && (
                                <span className="text-[10px] leading-none ml-0.5">{`+${count - 1}`}</span>
                            )}
                        </div>
                    )}
                </div>
            );
        }
        return cells;
    };

    return (
        <div className="bg-[#222b45] rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Calendar</h2>
                <div className="flex items-center space-x-4">
                    <button onClick={prevMonth} className="p-1 rounded-full bg-[#1a2035] hover:bg-indigo-700">
                        <ChevronLeft size={20} />
                    </button>
                    <span>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
                    <button onClick={nextMonth} className="p-1 rounded-full bg-[#1a2035] hover:bg-indigo-700">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((d) => (
                    <div key={d} className="text-center text-sm text-gray-400">
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

            {/* modal list of events on that day */}
            {selectedEvents.length > 0 && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-[#1a2035] text-white rounded-xl p-6 w-[90%] max-w-md relative shadow-lg">
                        <button
                            onClick={() => setSelectedEvents([])}
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
                        >
                            &times;
                        </button>

                        <h3 className="text-xl font-semibold mb-4">Events</h3>
                        {selectedEvents.map((ev) => (
                            <div key={ev.details.event_id} className="mb-4 border-b border-gray-600 pb-3 last:border-b-0">
                                <p className="font-medium">{ev.title}</p>
                                <p className="text-sm text-gray-400">
                                    {ev.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                                {ev.details.event_location && (
                                    <p className="text-sm text-gray-400">{ev.details.event_location}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
