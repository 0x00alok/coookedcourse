import { useState } from 'react'

export default function YTChannelSelect() {
  const [activeFilter, setActiveFilter] = useState("Akshay Saini");

  const filters = ["Akshay Saini", "Trouble Free", "CampusX", "Gate Smashers"];

  const INK = "#12151B";
  const MUTED = "#6E7180";
  const HAIRLINE = "#E7E8E3";

  return (
    <div className="flex items-center gap-2 mb-8 flex-wrap">
      {filters.map((f) => {
        const isActive = activeFilter === f;
        return (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="rounded-full text-xs font-medium px-3.5 py-1.5 transition border"
            style={
              isActive
                ? { background: INK, color: "#fff", borderColor: INK }
                : { background: "#fff", color: MUTED, borderColor: HAIRLINE }
            }
          >
            {f}
          </button>
        );
      })}
    </div>
  )
}
