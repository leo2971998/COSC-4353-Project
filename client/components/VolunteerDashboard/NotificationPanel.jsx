/* NotificationPanel.jsx
   ------------------------------------------------------------
   Leo Nguyen – richer volunteer-request cards
   • shows event name, when, where, required skills
   • Accept / Decline buttons remain
   • generic notifications unchanged
   ------------------------------------------------------------ */

import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { API_URL } from "../../api";

/* fetch + cache an event row by id */
async function getEventCached(id, cache) {
    if (cache.current.has(id)) return cache.current.get(id);
    try {
        const { data } = await axios.get(`${API_URL}/events`);
        const ev = (data.events || []).find(
            (e) => Number(e.event_id) === Number(id)
        );
        cache.current.set(id, ev);          // may be undefined if not found
        return ev;
    } catch {
        return undefined;
    }
}

export default function NotificationsPanel({ notifications = [], refresh }) {
    const [busyIds, setBusy] = useState([]);
    const eventCache = useRef(new Map());

    const respond = async (reqId, status) => {
        try {
            setBusy((p) => [...p, reqId]);
            await axios.patch(`${API_URL}/requests/${reqId}`, { status });
            refresh();                             // reload list from parent
        } catch (err) {
            console.error("respond error:", err.message);
        } finally {
            setBusy((p) => p.filter((x) => x !== reqId));
        }
    };

    /* ------- card for a volunteer-request row ------- */
    const RequestCard = ({ n }) => {
        const [ev, setEv] = useState(null);

        useEffect(() => {
            getEventCached(n.event_id, eventCache).then(setEv);
        }, [n.event_id]);

        return (
            <div className="border border-gray-600 rounded-lg p-3 mb-3">
                {/* headline */}
                <p className="font-medium mb-1">
                    {ev ? ev.event_name : `Event #${n.event_id}`}
                </p>

                {/* when / where */}
                {ev && (
                    <p className="text-xs text-gray-400 mb-1">
                        {new Date(ev.start_time).toLocaleString()}{" "}
                        {ev.end_time && " – " + new Date(ev.end_time).toLocaleString()}
                        {ev.event_location && `— ${ev.event_location}`}
                    </p>
                )}

                {/* skills */}
                {ev?.required_skills && (
                    <p className="text-xs text-gray-400 mb-2">
                        <b>Skills:</b> {ev.required_skills}
                    </p>
                )}

                <p className="mb-3">Please accept or decline.</p>

                <div className="flex gap-3">
                    <button
                        disabled={busyIds.includes(n.request_id)}
                        onClick={() => respond(n.request_id, "Accepted")}
                        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40"
                    >
                        Accept
                    </button>
                    <button
                        disabled={busyIds.includes(n.request_id)}
                        onClick={() => respond(n.request_id, "Declined")}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 disabled:opacity-40"
                    >
                        Decline
                    </button>
                </div>
            </div>
        );
    };

    /* ------- panel ------- */
    return (
        <div className="bg-[#1a2035] rounded-xl p-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3">Notifications</h2>

            {notifications.length === 0 && (
                <p className="text-sm text-gray-400">
                    You’re all caught up!
                </p>
            )}

            {notifications.map((n) =>
                n.type === "request" ? (
                    <RequestCard key={n.request_id} n={n} />
                ) : (
                    <div key={n.id} className="border border-gray-600 rounded-lg p-3 mb-3">
                        <p className="mb-1">{n.message}</p>
                        {n.created_at && (
                            <p className="text-xs text-gray-400">
                                {new Date(n.created_at).toLocaleString()}
                            </p>
                        )}
                    </div>
                )
            )}
        </div>
    );
}
