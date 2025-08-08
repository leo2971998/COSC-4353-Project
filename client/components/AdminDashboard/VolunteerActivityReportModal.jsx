/* components/AdminDashboard/VolunteerActivityReportModal.jsx
   ------------------------------------------------------------
   Volunteer Activity Report (grouped by volunteer)
   • Filters: date range, urgency, status (Upcoming/Attended/Missed/Withdrew/All)
   • Columns: Volunteer, Events, Hours, Attended, Missed, Withdrew, Avg Rating, First, Last
   • CSV export
   ------------------------------------------------------------ */

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "https://cosc-4353-backend.vercel.app";

export default function VolunteerActivityReportModal({ open, onClose }) {
    if (!open) return null;

    const today = new Date().toISOString().slice(0, 10);
    const [from,    setFrom]    = useState(today);
    const [to,      setTo]      = useState(today);
    const [urgency, setUrgency] = useState("All");
    const [status,  setStatus]  = useState("All");

    const [applied, setApplied] = useState({ from: today, to: today, urgency: "All", status: "All" });
    const [rows,    setRows]    = useState([]);
    const [loading, setLoading] = useState(false);

    const ensureRange = () => {
        if (from > to) { toast.error("Start date must be ≤ end date"); return false; }
        return true;
    };

    const run = async () => {
        if (!ensureRange()) return;

        const qs = new URLSearchParams({ start: from, end: to, urgency, status });
        try {
            setLoading(true);
            const { data } = await axios.get(`${API}/reports/volunteer-activity?` + qs.toString());
            setRows(Array.isArray(data) ? data : []);
            setApplied({ from, to, urgency, status });
        } catch {
            toast.error("Failed to load activity report");
        } finally {
            setLoading(false);
        }
    };

    // initial load (defaults)
    useEffect(() => { run(); /* eslint-disable-next-line */ }, []);

    const fmt2 = (n) => (n == null ? "" : Number(n).toFixed(2));

    const exportCSV = () => {
        const header = ["Volunteer","Events","Hours","Attended","Missed","Withdrew","AvgRating","FirstEvent","LastEvent"];
        const lines = rows.map(r => [
            `"${r.full_name}"`,
            r.events,
            fmt2(r.hours),
            r.attended,
            r.missed,
            r.withdrew,
            fmt2(r.avg_rating),
            r.first_event,
            r.last_event
        ].join(","));
        const csv = [header.join(","), ...lines].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `volunteer_activity_${applied.from}_${applied.to}.csv`;
        a.click();
    };

    const Input = ({ label, ...props }) => (
        <div>
            <label className="block text-sm mb-1">{label}</label>
            <input {...props} className="bg-[#222b45] rounded px-3 py-2 w-full" />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-start pt-20">
            <div className="bg-[#1a2035] w-[95%] max-w-6xl p-6 rounded-xl relative">
                <button onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-2xl">&times;</button>

                <h2 className="text-xl font-semibold mb-4">Volunteer Activity Report</h2>

                {/* Filters */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Input label="From" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
                    <Input label="To"   type="date" value={to}   onChange={e=>setTo(e.target.value)} />

                    <div>
                        <label className="block text-sm mb-1">Urgency</label>
                        <select className="bg-[#222b45] rounded px-3 py-2 w-full"
                                value={urgency} onChange={e=>setUrgency(e.target.value)}>
                            {["All","High","Medium","Low"].map(u=> <option key={u}>{u}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Status</label>
                        <select className="bg-[#222b45] rounded px-3 py-2 w-full"
                                value={status} onChange={e=>setStatus(e.target.value)}>
                            {["All","Upcoming","Attended","Missed","Withdrew"].map(s=> <option key={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="flex gap-2 items-end col-span-full">
                        <button onClick={run}
                                className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded">Run</button>
                        {rows.length > 0 && (
                            <button onClick={exportCSV}
                                    className="bg-gray-600 hover:bg-gray-500 px-5 py-2 rounded">Export CSV</button>
                        )}
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <p className="text-gray-400">Loading…</p>
                ) : rows.length === 0 ? (
                    <p className="text-gray-400">No results for your filters.</p>
                ) : (
                    <div className="overflow-x-auto max-h-[60vh]">
                        <table className="w-full text-sm">
                            <thead className="bg-[#222b45] text-gray-300 sticky top-0">
                            <tr>
                                {["Volunteer","Events","Hours","Attended","Missed","Withdrew","Avg Rating","First","Last"].map(h=>(
                                    <th key={h} className="p-2 text-left">{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map(r=>(
                                <tr key={r.volunteer_id} className="border-b border-gray-700">
                                    <td className="p-2">{r.full_name}</td>
                                    <td className="p-2">{r.events}</td>
                                    <td className="p-2 text-right">{fmt2(r.hours)}</td>
                                    <td className="p-2 text-center">{r.attended}</td>
                                    <td className="p-2 text-center">{r.missed}</td>
                                    <td className="p-2 text-center">{r.withdrew}</td>
                                    <td className="p-2 text-right">{fmt2(r.avg_rating)}</td>
                                    <td className="p-2">{r.first_event}</td>
                                    <td className="p-2">{r.last_event}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
