/* DemoAdminCalendar.jsx - Demo version of admin calendar
   • Shows full UI and modals for add/edit/delete events
   • Doesn't save to database - demo mode only
   • Maintains all visual functionality for demonstration
   ------------------------------------------------------------ */

import { useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

/* ====================================================================
   Demo Calendar root
==================================================================== */
export default function DemoCalendarView({ allEvents = [], refreshEvents }) {
    const [month, setMonth] = useState(new Date());

    /* modal state */
    const [mode, setMode] = useState(null);           // 'add' | 'edit' | 'vol' | null
    const [selDate, setSelDate] = useState(null);     // Date when adding
    const [selEvent, setSelEvent] = useState(null);   // event object when editing / volunteers

    /* volunteer state for demo */
    const [cands, setCands] = useState([]);
    const [picked, setPicked] = useState([]);
    const [loading, setLoading] = useState(false);

    /* calendar helpers */
    const daysIn  = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const firstWd = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const prev = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
    const next = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));

    /* Demo: simulate loading candidates without API call */
    const loadCandidates = () => {
        setLoading(true);
        // Simulate loading with demo data
        setTimeout(() => {
            setCands([
                { volunteer_id: 1, full_name: "John Smith", skills: "Physical work, teamwork" },
                { volunteer_id: 2, full_name: "Sarah Johnson", skills: "Organization, leadership" },
                { volunteer_id: 3, full_name: "Mike Davis", skills: "Communication, customer service" }
            ]);
            setLoading(false);
        }, 500);
    };

    /* Demo: simulate sending requests without API call */
    const sendRequests = () => {
        if (!picked.length) return;
        toast.success(`Demo: Would send requests to ${picked.length} volunteers`);
        setPicked([]);
        closeModal();
    };

    const closeModal = () => {
        setMode(null);
        setSelDate(null);
        setSelEvent(null);
        setCands([]);
        setPicked([]);
    };

    /* calendar grid */
    const cells = [];
    for (let d = 1; d <= daysIn; d++) {
        const dt = new Date(month.getFullYear(), month.getMonth(), d);
        const list = allEvents.filter(e =>
            e.date.getDate() === d &&
            e.date.getMonth() === month.getMonth() &&
            e.date.getFullYear() === month.getFullYear()
        );

        cells.push(
            <div key={d} className="h-24 relative border border-[#1a2035] p-1">
                <button
                    onClick={() => { setMode("add"); setSelDate(dt); }}
                    className="absolute top-1 right-1 text-gray-400 hover:text-indigo-400"
                ><Plus size={14}/></button>

                <span className="text-xs">{d}</span>

                {list.slice(0, 3).map(ev => (
                    <button
                        key={ev.details.event_id || ev.title}
                        onClick={() => { setMode("vol"); setSelEvent(ev.details); loadCandidates(); }}
                        className="block w-full truncate text-left text-xs text-indigo-300 hover:text-indigo-200"
                    >• {ev.title}</button>
                ))}
            </div>
        );
    }

    // pad start of month
    for (let i = 0; i < firstWd; i++) {
        cells.unshift(<div key={`pad-${i}`} className="h-24 border border-[#1a2035] bg-gray-700/20"/>);
    }

    return (
        <>
            <div className="bg-[#222b45] rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Event Calendar</h2>
                    <div className="flex items-center space-x-4">
                        <button onClick={prev} className="p-1 rounded-full bg-[#1a2035] hover:bg-indigo-700">
                            <ChevronLeft size={20}/>
                        </button>
                        <span className="text-lg">
                            {month.toLocaleDateString("en", { month: "long", year: "numeric" })}
                        </span>
                        <button onClick={next} className="p-1 rounded-full bg-[#1a2035] hover:bg-indigo-700">
                            <ChevronRight size={20}/>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-px bg-[#1a2035]">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                        <div key={d} className="text-center text-xs py-1 bg-[#1a2035] text-gray-400">{d}</div>
                    ))}
                    {cells}
                </div>
            </div>

            {/* modals */}
            {mode === "add" && (
                <DemoEventForm
                    onClose={closeModal}
                    onSaved={() => { closeModal(); refreshEvents(); }}
                    defaultDate={selDate}
                />
            )}
            {mode === "edit" && selEvent && (
                <DemoEventForm
                    event={selEvent}
                    onClose={closeModal}
                    onSaved={() => { closeModal(); refreshEvents(); }}
                />
            )}
            {mode === "vol" && selEvent && (
                <DemoVolunteerModal
                    event={selEvent}
                    candidates={cands}
                    picked={picked}
                    setPicked={setPicked}
                    loading={loading}
                    onSend={sendRequests}
                    onEdit={() => setMode("edit")}
                    onClose={closeModal}
                />
            )}
        </>
    );
}

/* ====================================================================
   Demo Event add / edit form - shows UI but doesn't save to database
==================================================================== */
function DemoEventForm({ event = null, defaultDate, onClose, onSaved }) {
    const isEdit = !!event;
    const today = defaultDate || new Date();

    const [name, setName] = useState(event?.event_name || "");
    const [desc, setDesc] = useState(event?.event_description || "");
    const [loc, setLoc] = useState(event?.event_location || "");
    const [urg, setUrg] = useState(event?.urgency || "Low");
    const [skills, setSkills] = useState(
        (event?.required_skills || "").split(",").map(s => s.trim()).filter(Boolean)
    );
    const [start, setStart] = useState(
        event ? event.start_time?.slice(0, 16) : today.toISOString().slice(0, 16)
    );
    const [end, setEnd] = useState(
        event ? event.end_time?.slice(0, 16) : today.toISOString().slice(0, 16)
    );
    const [busy, setBusy] = useState(false);

    /* Demo skills data */
    const [skillQuery, setSkillQuery] = useState("");
    const demoSkills = [
        "Physical work", "Teamwork", "Leadership", "Communication", 
        "Organization", "Customer service", "Teaching", "Computer skills",
        "Problem solving", "Time management", "First aid", "Animal care"
    ];

    const filteredSkills = demoSkills.filter(s =>
        s.toLowerCase().includes(skillQuery.toLowerCase())
    );

    const toggleSkill = (s) =>
        setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

    const save = async () => {
        if (!name.trim()) return toast.error("Event name required");
        setBusy(true);
        // Simulate save delay
        setTimeout(() => {
            toast.success(isEdit ? "Demo: Event updated (not saved to database)" : "Demo: Event created (not saved to database)");
            setBusy(false);
            onSaved();
        }, 1000);
    };

    const del = async () => {
        if (!window.confirm("Delete this event? (Demo mode - not actually deleted)")) return;
        toast.success("Demo: Event deleted (not actually removed from database)");
        onSaved();
    };

    return (
        <DemoModal onClose={onClose}>
            <div className="max-h-[85vh] overflow-y-auto pr-1">
                <h3 className="text-xl font-semibold mb-4">{isEdit ? "Edit Event" : "Add Event"}</h3>
                
                {/* Demo mode indicator */}
                <div className="mb-4 p-3 bg-blue-600/20 border border-blue-600/50 rounded-lg">
                    <p className="text-blue-200 text-sm">
                        💡 <strong>Demo Mode:</strong> This form shows the full interface but won't save to the database.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Event Name</label>
                        <input
                            value={name}
                            maxLength={50}
                            onChange={e => setName(e.target.value)}
                            className="bg-[#222b45] w-full rounded px-3 py-2 text-white"
                        />
                        <p className="text-xs text-gray-400 text-right">{name.length}/50 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Event Description</label>
                        <textarea
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            className="bg-[#222b45] w-full rounded px-3 py-2 text-white h-20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Location</label>
                        <input
                            value={loc}
                            onChange={e => setLoc(e.target.value)}
                            className="bg-[#222b45] w-full rounded px-3 py-2 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Urgency</label>
                        <select
                            value={urg}
                            onChange={e => setUrg(e.target.value)}
                            className="bg-[#222b45] w-full rounded px-3 py-2 text-white"
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Start Time</label>
                            <input
                                type="datetime-local"
                                value={start}
                                onChange={e => setStart(e.target.value)}
                                className="bg-[#222b45] w-full rounded px-3 py-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">End Time</label>
                            <input
                                type="datetime-local"
                                value={end}
                                onChange={e => setEnd(e.target.value)}
                                className="bg-[#222b45] w-full rounded px-3 py-2 text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Required Skills</label>
                        <input
                            placeholder="Search skills..."
                            value={skillQuery}
                            onChange={e => setSkillQuery(e.target.value)}
                            className="bg-[#222b45] w-full rounded px-3 py-2 text-white mb-2"
                        />
                        <div className="max-h-32 overflow-y-auto border border-gray-600 rounded p-2">
                            {filteredSkills.map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    className={`block w-full text-left px-2 py-1 rounded text-sm ${
                                        skills.includes(skill) ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                                    }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                        {skills.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-400 mb-1">Selected skills:</p>
                                <div className="flex flex-wrap gap-1">
                                    {skills.map(skill => (
                                        <span key={skill} className="bg-blue-600 text-xs px-2 py-1 rounded">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            onClick={save}
                            disabled={busy}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
                        >
                            {busy ? "Saving..." : (isEdit ? "Update" : "Create")}
                        </button>
                        {isEdit && (
                            <button
                                onClick={del}
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </DemoModal>
    );
}

/* ====================================================================
   Demo Volunteer picker modal
==================================================================== */
function DemoVolunteerModal({ event, candidates, picked, setPicked, loading, onSend, onEdit, onClose }) {
    return (
        <DemoModal onClose={onClose}>
            <div className="max-h-[85vh] overflow-y-auto pr-1">
                <h3 className="text-xl font-semibold mb-4">Volunteer Requests - {event.event_name}</h3>
                
                {/* Demo mode indicator */}
                <div className="mb-4 p-3 bg-blue-600/20 border border-blue-600/50 rounded-lg">
                    <p className="text-blue-200 text-sm">
                        💡 <strong>Demo Mode:</strong> Volunteer requests shown but not actually sent.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="bg-[#1a2035] p-3 rounded">
                        <p><strong>Event:</strong> {event.event_name}</p>
                        <p><strong>Location:</strong> {event.event_location}</p>
                        <p><strong>Skills:</strong> {event.required_skills}</p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Available Volunteers:</h4>
                        {loading ? (
                            <p className="text-gray-400">Loading volunteers...</p>
                        ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {candidates.map(vol => (
                                    <div key={vol.volunteer_id} className="flex items-center gap-2 p-2 bg-[#1a2035] rounded">
                                        <input
                                            type="checkbox"
                                            checked={picked.includes(vol.volunteer_id)}
                                            onChange={() => {
                                                setPicked(prev =>
                                                    prev.includes(vol.volunteer_id)
                                                        ? prev.filter(id => id !== vol.volunteer_id)
                                                        : [...prev, vol.volunteer_id]
                                                );
                                            }}
                                        />
                                        <div>
                                            <p className="font-medium">{vol.full_name}</p>
                                            <p className="text-sm text-gray-400">{vol.skills}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            onClick={onSend}
                            disabled={!picked.length}
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
                        >
                            Send Requests ({picked.length})
                        </button>
                        <button
                            onClick={onEdit}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                        >
                            Edit Event
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
        </DemoModal>
    );
}

/* ====================================================================
   Demo Modal wrapper
==================================================================== */
function DemoModal({ children, onClose }) {
    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-[#0f172a] rounded-xl p-6 w-full max-w-2xl border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}