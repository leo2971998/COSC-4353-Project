import { Info } from "lucide-react";

export default function DemoModeIndicator({ role = "demo" }) {
  return (
    <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-600/50 rounded-lg p-3 mb-6 flex items-center gap-3">
      <Info className="w-5 h-5 text-amber-400 flex-shrink-0" />
      <div className="text-sm">
        <p className="text-amber-200 font-medium">
          🎯 Demo Mode - {role === "admin" ? "Administrator" : "Volunteer"} Experience
        </p>
        <p className="text-amber-300/80">
          You're exploring a demo with sample data. Actions won't affect real users or events.
        </p>
      </div>
    </div>
  );
}