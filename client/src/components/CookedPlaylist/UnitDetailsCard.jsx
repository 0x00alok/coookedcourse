import { useState } from 'react';

import StatTile from '@/components/CookedPlaylist/unit-details/StatTile';
import MatchHeroCard from '@/components/CookedPlaylist/unit-details/MatchHeroCard';
import CoverageBar from '@/components/CookedPlaylist/unit-details/CoverageBar';
import MatchedUnmatchedCard from '@/components/CookedPlaylist/unit-details/MatchedUnmatchedCard';
import { PANEL_BG, MUTED } from '@/constants/colors';

import { Download, Gauge, RotateCcw } from 'lucide-react';

export default function UnitDetailsCard({
  matchedSyllabusTopics,
  unmatchedSyllabusTopics,
  activeChapterIndex,
  currentChannel,
  currentChapter
}) {
  return (
    <div
      className="w-[380px] min-w-0 max-w-full shrink-0 px-5 py-8 overflow-y-auto"
      style={{ background: PANEL_BG }}
    >
      <MatchHeroCard
        currentChannel={currentChannel}
        activeChapterIndex={activeChapterIndex + 1}
        currentChapter={currentChapter}
      />

      <div>
        <MatchedUnmatchedCard
          matchedSyllabusTopics={matchedSyllabusTopics}
          unmatchedSyllabusTopics={unmatchedSyllabusTopics}
        />
      </div>

      <div className="flex gap-3 mt-4">
        <StatTile
          icon={Gauge}
          label="Match score"
          value={67}
          sub={`out of 100 · 45 mins`}
        />
      </div>
      <div className="mt-3">
        <CoverageBar matched={4} total={7} />
      </div>

      <div
        className="flex items-center justify-between text-[11px] mt-4 px-1"
        style={{ color: MUTED }}
      >
        <span className="flex items-center gap-1.5">
          <RotateCcw size={12} /> Updated
          {/* {selectedMatch.uploaded} */}
        </span>
        <span className="flex items-center gap-1.5">
          <Download size={12} /> Save offline
        </span>
      </div>
    </div>
  )
}
