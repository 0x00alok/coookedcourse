import React from 'react'

export default function UnitRail() {
  const units = ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6"];
  const currentUnit = "Unit 4";

  const HAIRLINE = "#E7E8E3";
  const AMBER = "#D98E3B";
  const INK = "#12151B";
  const MUTED = "#6E7180";

  return (
    <div className="flex items-center gap-2 mb-6">
      {units.map((u, i) => (
        <React.Fragment key={u}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: u === currentUnit ? AMBER : HAIRLINE }}
            />
            <span className="text-[10px] font-medium" style={{ color: u === currentUnit ? INK : MUTED }}>
              {u}
            </span>
          </div>
          {i < units.length - 1 && <div className="h-px flex-1 mb-4" style={{ background: HAIRLINE }} />}
        </React.Fragment>
      ))}
    </div>
  )
}
