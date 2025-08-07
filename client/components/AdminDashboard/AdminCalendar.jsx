/* AdminCalendar.jsx  –  v2
   Leo Nguyen – CRUD from the calendar
   ------------------------------------------------------------ */

import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const API = "https://cosc-4353-backend.vercel.app";

export function CalendarView({
                                 allEvents = [],
                                 refreshEvents,              // callback from parent to reload list after CRUD
                             }) {
    /* month navigation */
    const [current, setCurrent] = useState(new Date());

    /* modal state */
    const [modal, setModal] = useState({ type: null, date: null, event: null });
    // type: 'add' | 'edit' | null

    /* helpers */
    const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
    const firstDay    = new Date(current.getFullYear(), current.getMonth(), 1).getDay();
    const prevMonth   = () => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
    const nextMonth   = () => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));

    /* ------------ render cells ------------ */
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} />);

    for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(current.getFullYear(), current.getMonth(), day);
        const dayEvents = allEvents.filter(
            (e) =>
                e.date.getDate()   === day &&
                e.date.getMonth()  === current.getMonth() &&
                e.date.getFullYear() === current.getFullYear()
        );

        cells.push(
            <div key={day} className="h-24 relative border border-[#1a2035] p-1">
                {/* add button */}
                <button
                    onClick={() => setModal({ type: "add", date: dateObj, event: null })}
                    className="absolute top-1 right-1 text-gray-400 hover:text-indigo-400"
                >
                    <Plus size={14} />
                </button>

                {/* day number */}
                <span className="text-xs">{day}</span>

                {/* list titles */}
                {dayEvents.slice(0, 3).map((ev) => (
                    <button
                        key={ev.details.event_id}
                        onClick={() => setModal({ type: "edit", date: null, event: ev.details })}
                        className="block w-full truncate text-left text-xs text-indigo-300 hover:text-indigo-200"
                    >
                        • {ev.title}
                    </button>
                ))}

                {/* “+n more” if overflow */}
                {dayEvents.length > 3 && (
                    <span className="block text-xs text-gray-400">
            +{dayEvents.length - 3} more
          </span>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="bg-[#222b45] rounded-xl p-6 mb-6">
                {/* header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Admin Calendar</h2>
                    <div className="flex items-center gap-4">
                        <button onClick={prevMonth} className="p-1 rounded-full bg-[#1a2035] hover:bg-indigo-700">
                            <ChevronLeft size={20} />
                        </button>
                        <span>
              {current.toLocaleString("default", { month: "long" })} {current.getFullYear()}
            </span>
                        <button onClick={nextMonth} className="p-1 rounded-full bg-[#1a2035] hover:bg-indigo-700">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* grid */}
                <div className="grid grid-cols-7 gap-px bg-[#1a2035]">
                    {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                        <div key={d} className="text-center text-xs py-1 bg-[#1a2035] text-gray-400">
                            {d}
                        </div>
                    ))}
                    {cells}
                </div>
            </div>

            {/* modal */}
            {modal.type && (
                <EventFormModal
                    mode={modal.type}          // "add" | "edit"
                    defaultDate={modal.date}
                    event={modal.event}
                    onClose={() => setModal({ type: null, date: null, event: null })}
                    onSuccess={() => {
                        setModal({ type: null, date: null, event: null });
                        refreshEvents();         // reload list in parent
                    }}
                />
            )}
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  Reusable form for Add / Edit                                      */
/* ------------------------------------------------------------------ */
function EventFormModal({ mode, defaultDate, event, onClose, onSuccess }) {
    const isEdit = mode === "edit";

    /* form state */
    const [name,  setName]  = useState(event?.event_name || "");
    const [desc,  setDesc]  = useState(event?.event_description || "");
    const [loc,   setLoc]   = useState(event?.event_location || "");
    const [urg,   setUrg]   = useState(event?.urgency || "Low");
    const [start, setStart] = useState(
        isEdit
            ? event.start_time.slice(0, 16)
            : defaultDate.toISOString().slice(0, 16)
    );
    const [end,   setEnd]   = useState(
        isEdit
            ? event.end_time.slice(0, 16)
            : defaultDate.toISOString().slice(0, 16)
    );
    const [saving, setSaving] = useState(false);

    /* submit */
    const handleSave = async () => {
        if (!name.trim()) return alert("Event name required");
        try {
            setSaving(true);
            if (isEdit) {
                await axios.put(`${API}/events/${event.event_id}`, {
                    event_name: name,
                    event_description: desc,
                    event_location: loc,
                    urgency: urg,
                    start_time: start,
                    end_time: end,
                });
            } else {
                await axios.post(`${API}/events`, {
                    event_name: name,
                    event_description: desc,
                    event_location: loc,
                    urgency: urg,
                    start_time: start,
                    end_time: end,
                    created_by: Number(localStorage.getItem("userId") || 0),
                });
            }
            onSuccess();
        } catch (err) {
            console.error("Save error:", err.message);
            alert("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    /* delete */
    const handleDelete = async () => {
        if (!window.confirm("Delete this event?")) return;
        try {
            await axios.delete(`${API}/events/${event.event_id}`);
            onSuccess();
        } catch (err) {
            console.error("Delete error:", err.message);
            alert("Failed to delete");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-[#1a2035] text-white rounded-xl p-6 w-[90%] max-w-md relative shadow-lg">
                <button onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-xl">&times;</button>

                <h3 className="text-xl font-semibold mb-4">
                    {isEdit ? "Edit Event" : "Add Event"}
                </h3>

                <div className="space-y-3">
                    <Input label="Event Name" value={name} onChange={setName}/>
                    <TextArea label="Description" value={desc} onChange={setDesc}/>
                    <Input label="Location" value={loc} onChange={setLoc}/>
                    <Select label="Urgency" value={urg} onChange={setUrg}
                            options={["High","Medium","Low"]}/>
                    <Input label="Start" type="datetime-local" value={start} onChange={setStart}/>
                    <Input label="End"   type="datetime-local" value={end}   onChange={setEnd}/>
                </div>

                <div className="flex justify-between mt-6">
                    {isEdit && (
                        <button onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded">
                            Delete
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded disabled:opacity-40"
                    >
                        {saving ? "Saving…" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* small inputs */
function Input({ label, type="text", value, onChange }) {
    return (
        <div>
            <label className="block text-sm mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={e=>onChange(e.target.value)}
                className="bg-[#222b45] w-full rounded px-3 py-2"
            />
        </div>
    );
}
function TextArea({ label, value, onChange }) {
    return (
        <div>
            <label className="block text-sm mb-1">{label}</label>
            <textarea
                value={value}
                onChange={e=>onChange(e.target.value)}
                rows={3}
                className="bg-[#222b45] w-full rounded px-3 py-2"
            />
        </div>
    );
}
function Select({ label, value, onChange, options=[] }) {
    return (
        <div>
            <label className="block text-sm mb-1">{label}</label>
            <select
                value={value}
                onChange={e=>onChange(e.target.value)}
                className="bg-[#222b45] w-full rounded px-3 py-2"
            >
                {options.map(o=>(
                    <option key={o}>{o}</option>
                ))}
            </select>
        </div>
    );
}
