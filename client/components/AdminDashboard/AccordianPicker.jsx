/* AccordionPicker.jsx
   ------------------------------------------------------------
   • multi=true  ⇒ check-boxes, selection array
   • Only one accordion row can stay open at a time
   • Shows “No matching volunteers.” when list is empty
   ------------------------------------------------------------ */

import { useState, memo } from "react";
import { ChevronDown, Check } from "lucide-react";

export default memo(function AccordionPicker({
                                                 candidates = [],           // [{ volunteer_id, full_name, overlap, skills }]
                                                 requiredSkills = [],       // ["First Aid", ...]
                                                 multi = false,
                                                 onChangeSelection,
                                             }) {
    /* Selection (array even in radio mode) */
    const [picked, setPicked] = useState([]);

    /* Leo Nguyen – single-accordion-open */
    const [openId, setOpenId] = useState(null);

    /* ---------- utilities ---------- */
    const togglePick = (id) => {
        const next = multi
            ? picked.includes(id)
                ? picked.filter((x) => x !== id)
                : [...picked, id]
            : [id];
        setPicked(next);
        onChangeSelection?.(next);
    };

    const handleToggleOpen = (id) => {
        setOpenId((prev) => (prev === id ? null : id));
    };
    /* ---------- render ---------- */
    return (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {candidates.map((c) => {
                const skillsArr = (c.skills || "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);

                const matched = skillsArr.filter((s) =>
                    requiredSkills.includes(s)
                );
                const isOpen   = openId === c.volunteer_id;
                const selected = picked.includes(c.volunteer_id);

                return (
                    <div
                        key={c.volunteer_id}
                        className="border border-gray-600 rounded-lg"
                    >
                        {/* header */}
                        <button
                            onClick={() => handleToggleOpen(c.volunteer_id)}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#282f48]"
                        >
                            <span className="truncate">{c.full_name}</span>
                            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  {c.overlap} match
                </span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform ${
                                        isOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </div>
                        </button>

                        {/* body */}
                        {isOpen && (
                            <div className="px-4 pb-3 pt-1 text-sm">
                                <div className="flex flex-wrap gap-2">
                                    {skillsArr.map((skill) => {
                                        const hit = matched.includes(skill);
                                        return (
                                            <span
                                                key={skill}
                                                className={`flex items-center gap-1 px-2 py-[2px] rounded-full text-xs
                          ${
                                                    hit
                                                        ? "bg-emerald-600/20 text-emerald-300"
                                                        : "bg-gray-600/30 text-gray-300"
                                                }`}
                                            >
                        {hit && <Check size={12} />}
                                                {skill}
                      </span>
                                        );
                                    })}
                                </div>

                                <label className="mt-3 flex items-center gap-2">
                                    <input
                                        type={multi ? "checkbox" : "radio"}
                                        checked={selected}
                                        onChange={() => togglePick(c.volunteer_id)}
                                        className="accent-indigo-500"
                                    />
                                    <span>Select</span>
                                </label>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});
