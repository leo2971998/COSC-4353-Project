/* DemoVolunteerCalendar.jsx - Demo version of volunteer calendar
   • Shows calendar view with demo events
   • Click interactions show event details but don't modify data
   • All UI preserved for demonstration purposes
   ------------------------------------------------------------ */

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarView({ calendarInfo = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Normalize incoming data: add _start/_end Date objects once
  const events = Array.isArray(calendarInfo)
    ? calendarInfo.map((ev) => ({
        ...ev,
        _start: new Date(ev.start_time),
        _end: new Date(ev.end_time),
      }))
    : [];

  // Date helpers
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
    "January",
    "February", 
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const renderCalendarDays = () => {
    const cells = [];
    // leading blanks
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`e-${i}`} className="h-10 md:h-14" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const eventsOfDay = events.filter(
        (e) =>
          e._start.getDate() === day &&
          e._start.getMonth() === currentMonth.getMonth() &&
          e._start.getFullYear() === currentMonth.getFullYear()
      );

      cells.push(
        <div
          key={day}
          className="h-10 md:h-14 border border-gray-600 p-1 relative"
        >
          <span className="text-xs">{day}</span>
          {eventsOfDay.map((event, idx) => (
            <button
              key={idx}
              onClick={() => handleEventClick(event)}
              className="block w-full text-left text-xs text-blue-300 hover:text-blue-200 truncate"
            >
              • {event.event_name}
            </button>
          ))}
        </div>
      );
    }
    return cells;
  };

  return (
    <>
      <div className="bg-[#222b45] rounded-xl p-6 mb-6">
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

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
      </div>

      {/* Demo Event Detail Modal */}
      {showEventModal && selectedEvent && (
        <DemoEventModal
          event={selectedEvent}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </>
  );
}

/* ====================================================================
   Demo Event Detail Modal - shows event info but no action buttons
==================================================================== */
function DemoEventModal({ event, onClose }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f172a] rounded-xl p-6 w-full max-w-md border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">{event.event_name}</h3>
        
        {/* Demo mode indicator */}
        <div className="mb-4 p-3 bg-blue-600/20 border border-blue-600/50 rounded-lg">
          <p className="text-blue-200 text-sm">
            💡 <strong>Demo Mode:</strong> This shows event details. In the full version, you could sign up or get directions.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <strong className="text-gray-300">Date:</strong>
            <p className="text-white">{formatDate(event.start_time)}</p>
          </div>
          
          <div>
            <strong className="text-gray-300">Time:</strong>
            <p className="text-white">
              {formatTime(event.start_time)} - {formatTime(event.end_time)}
            </p>
          </div>
          
          <div>
            <strong className="text-gray-300">Location:</strong>
            <p className="text-white">{event.event_location}</p>
          </div>
          
          {event.event_description && (
            <div>
              <strong className="text-gray-300">Description:</strong>
              <p className="text-white">{event.event_description}</p>
            </div>
          )}
          
          {event.event_category && (
            <div>
              <strong className="text-gray-300">Category:</strong>
              <p className="text-white">{event.event_category}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-6">
          <button
            onClick={() => {
              // Demo action - show toast but don't actually sign up
              alert("Demo: In the full version, this would sign you up for the event!");
            }}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex-1"
          >
            Sign Up (Demo)
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}