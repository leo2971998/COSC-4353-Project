import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AccordionPicker from "./AccordianPicker.jsx";
import {toast} from "react-toastify";

/* ------------------------------------------------------------
   Admin calendar with request workflow
   Leo Nguyen – Fix multi-event display:
     • badge shows "+n" when multiple events share a date
     • modal now lets admin pick *which* event before choosing volunteers
------------------------------------------------------------ */
export function CalendarView({
                                 allEvents,
                                 isAdmin = false,
                                 currentUserId = null,
                                 API_URL = "https://cosc-4353-backend.vercel.app",
                             }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [dayEvents, setDayEvents] = useState([]);  // array of events for selected day
    const [activeEvent, setActiveEvent] = useState(null);

    /* candidate flow */
    const [candidates, setCandidates] = useState([]);
    const [pickedVolunteers, setPicked] = useState([]);
    const [loading, setLoading] = useState(false);

    /* helpers */
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    /* Leo Nguyen – Fix multi-event display */
    const renderCalendarDays = () => {
        const cells = [];
        for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} className="h-10 md:h-14"/>);

        for (let day = 1; day <= daysInMonth; day++) {
            const eventsOfDay = allEvents.filter(
                (e) =>
                    e.date.getDate() === day &&
                    e.date.getMonth() === currentMonth.getMonth() &&
                    e.date.getFullYear() === currentMonth.getFullYear()
            );
            const count = eventsOfDay.length;

            cells.push(
                <div
                    key={day}
                    onClick={() => count && openDay(eventsOfDay)}
                    className={`h-10 md:h-14 flex flex-col items-center justify-center rounded-lg ${
                        count ? "bg-indigo-800 hover:bg-indigo-700 cursor-pointer"
                            : "hover:bg-[#1a2035] cursor-pointer"
                    }`}
                >
                    <span className="text-sm">{day}</span>
                    {count > 0 && (
                        <div className="flex items-center gap-0.5 mt-1">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"/>
                            {count > 1 && <span className="text-[10px] leading-none ml-0.5">{`+${count - 1}`}</span>}
                        </div>
                    )}
                </div>
            );
        }
        return cells;
    };

    /* move the fetch logic into a re-usable fn */
    const loadCandidates = async (ev) => {
        if (!isAdmin || !ev) return;
        try {
            setLoading(true);
            const {data} = await axios.get(`${API_URL}/events/${ev.event_id}/candidates`);
            setCandidates(data);
        } catch (err) {
            console.error("loadCandidates", err.message);
            setCandidates([]);                 // Leo Nguyen – show "No matching volunteers."
        } finally {
            setLoading(false);
        }
    };

    /* open modal for one day */
    const openDay = async (events) => {
        setDayEvents(events);
        /* immediately fetch candidates for the first event */
        if (events.length) {
            await loadCandidates(events[0].details);
            setActiveEvent(events[0].details);
        } else {
            setActiveEvent(null);
        }
        setPicked([]);                       // reset selections
    };

    /* fire whenever admin switches to another event tab */
    useEffect(() => {
        loadCandidates(activeEvent);
    }, [activeEvent]);

    /* bulk send */
    const sendRequest = async () => {
        if (!pickedVolunteers.length) return;
        try {
            setLoading(true);
            await axios.post(`${API_URL}/events/${activeEvent.event_id}/requests/bulk`, {
                volunteerIds: pickedVolunteers,
                requestedBy: currentUserId,
            });
            toast.success(`Sent request${pickedVolunteers.length > 1 ? "s" : ""} 🎉`);
            closeModal();
        } catch (err) {
            console.error("sendRequest:", err.message);
            toast.error("Failed to send request");
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setDayEvents([]);
        setActiveEvent(null);
        setCandidates([]);
        setPicked([]);
    };

    return (
        <div className="bg-[#222b45] rounded-xl p-6 mb-6">
            {/* header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{isAdmin ? "Admin Calendar" : "Calendar"}</h2>
                <div className="flex items-center space-x-4">
                    <button onClick={prevMonth} className="p-1 rounded-full bg-[#1a2035] hover:bg-indigo-700">
                        <ChevronLeft size={20}/></button>
                    <span>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                    <button onClick={nextMonth} className="p-1 rounded-full bg-[#1a2035] hover:bg-indigo-700">
                        <ChevronRight size={20}/></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((d) => <div key={d} className="text-center text-sm text-gray-400">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

            {/* day-modal */}
            {dayEvents.length > 0 && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-[#1a2035] text-white rounded-xl p-6 w-[90%] max-w-lg relative shadow-lg">
                        <button onClick={closeModal}
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-400">&times;</button>

                        {/* event switcher if multiple */}
                        {dayEvents.length > 1 && (
                            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                                {dayEvents.map((e) => (
                                    <button
                                        key={e.details.event_id}
                                        onClick={async () => {
                                            await loadCandidates(e.details);
                                            setActiveEvent(e.details);
                                        }}
                                        className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${
                                            activeEvent && activeEvent.event_id === e.details.event_id
                                                ? "bg-indigo-600"
                                                : "bg-gray-700 hover:bg-gray-600"
                                        }`}>
                                        {e.title}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* active event info */}
                        {activeEvent && (
                            <>
                                <h3 className="text-2xl font-semibold text-indigo-400 mb-2">
                                    {activeEvent.event_name}
                                </h3>
                                <p className="text-sm">
                                    {new Date(activeEvent.start_time).toLocaleString()}
                                    {activeEvent.end_time && <> ― {new Date(activeEvent.end_time).toLocaleString()}</>}
                                </p>
                                {activeEvent.event_location &&
                                    <p className="text-sm mt-1"><b>Location:</b> {activeEvent.event_location}</p>}
                                {activeEvent.required_skills &&
                                    <p className="text-sm mt-1"><b>Skills:</b> {activeEvent.required_skills}</p>}
                                {activeEvent.event_description &&
                                    <p className="text-sm mt-3 whitespace-pre-wrap">{activeEvent.event_description}</p>}
                            </>
                        )}

                        {/* admin volunteer picker */}
                        {isAdmin && activeEvent && (
                            <>
                                <h4 className="mt-4 font-medium">Volunteers</h4>
                                {loading && <p className="text-sm text-gray-400">Loading…</p>}
                                {/* Leo Nguyen – show explicit notice when nothing was returned */}
                                {!loading && candidates.length === 0 && (
                                <p className="text-sm text-red-400 mb-2">
                                    No volunteers match the required skills for this event.
                                </p>)}
                                <AccordionPicker
                                    multi
                                    candidates={candidates}
                                    requiredSkills={(activeEvent.required_skills || "")
                                        .split(",")
                                        .map((s) => s.trim())
                                        .filter(Boolean)}
                                    onChangeSelection={(arr) => setPicked(arr)}
                                />

                                {/* Leo Nguyen – If no candidates matched, show msg (AccordionPicker already shows) */}

                                {candidates.length > 0 && (
                                    <button
                                        onClick={sendRequest}
                                        disabled={!pickedVolunteers.length || loading}
                                        className={`mt-4 w-full py-2 rounded-lg ${
                                            pickedVolunteers.length
                                                ? "bg-indigo-600 hover:bg-indigo-500"
                                                : "bg-gray-600 cursor-not-allowed"
                                        }`}
                                    >
                                        {loading ? "Sending…" : `Send Request${pickedVolunteers.length > 1 ? "s" : ""}`}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}