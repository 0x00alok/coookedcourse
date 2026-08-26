import React from 'react';

import { HAIRLINE, AMBER, INK, MUTED } from '@/constants/colors';

export default function UnitRail({ chapters, onChaptersSelect, activeChapterIndex }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {chapters.map((u, i) => (
        <React.Fragment key={u.id}>
          <div className="flex flex-col items-center gap-1.5 hover:cursor-pointer hover:scale-105 transition duration-300" onClick={onChaptersSelect}>
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: i === activeChapterIndex ? AMBER : HAIRLINE }}
            />
            <span className="text-[10px] font-medium" style={{ color: i === activeChapterIndex ? INK : MUTED }}>
              {u.name}
            </span>
          </div>
          {i < chapters.length - 1 && <div className="h-px flex-1 mb-4" style={{ background: HAIRLINE }} />}
        </React.Fragment>
      ))}
    </div>
  )
}
