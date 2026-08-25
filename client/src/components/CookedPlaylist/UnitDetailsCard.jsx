import { useState } from 'react';

import StatTile from '@/components/CookedPlaylist/unit-details/StatTile';
import MatchHeroCard from '@/components/CookedPlaylist/unit-details/MatchHeroCard';
import CoverageBar from '@/components/CookedPlaylist/unit-details/CoverageBar';

import { Download, Gauge, RotateCcw } from 'lucide-react';

const matches = [
  {
    id: 1,
    channel: "CodeWithSara",
    handle: "@codewithsara",
    initials: "CS",
    color: "#17324A",
    unit: "Unit 4",
    topic: "Custom hook patterns and lifecycle debugging",
    subs: "1.2M subscribers",
    uploaded: "3 days ago",
    duration: "42 min",
    level: "Intermediate",
    matched: 5,
    total: 6,
    score: 92,
  },
  {
    id: 2,
    channel: "Akshay Saini",
    handle: "@akshaysaini",
    initials: "AS",
    color: "#0E7C66",
    unit: "Unit 2",
    topic: "Call stack, closures, and hoisting explained end-to-end",
    subs: "890K subscribers",
    uploaded: "1 week ago",
    duration: "58 min",
    level: "Advanced",
    matched: 6,
    total: 6,
    score: 97,
  },
  {
    id: 3,
    channel: "CampusX",
    handle: "@campusx",
    initials: "CX",
    color: "#4A5568",
    unit: "Unit 5",
    topic: "Redux Toolkit walkthrough with a real project",
    subs: "540K subscribers",
    uploaded: "5 days ago",
    duration: "51 min",
    level: "Intermediate",
    matched: 4,
    total: 7,
    score: 74,
  },
  {
    id: 4,
    channel: "Gate Smashers",
    handle: "@gatesmashers",
    initials: "GS",
    color: "#3B4252",
    unit: "Unit 1",
    topic: "Normalization forms with worked examples",
    subs: "1.5M subscribers",
    uploaded: "today",
    duration: "36 min",
    level: "Beginner",
    matched: 6,
    total: 6,
    score: 100,
  },
  {
    id: 5,
    channel: "Trouble Free",
    handle: "@troublefree",
    initials: "TF",
    color: "#5B4636",
    unit: "Unit 6",
    topic: "CI/CD pipeline setup for React apps",
    subs: "610K subscribers",
    uploaded: "2 days ago",
    duration: "44 min",
    level: "Intermediate",
    matched: 3,
    total: 6,
    score: 58,
  },
];

export default function UnitDetailsCard() {
  const [selectedMatch, setSelectedMatch] = useState(matches[0]);

  const PANEL_BG = "#F7F7F5";
  const MUTED = "#6E7180";

  return (
    <div
      className="w-[380px] min-w-0 max-w-full shrink-0 px-5 py-8 overflow-y-auto"
      style={{ background: PANEL_BG }}
    >
      <MatchHeroCard match={selectedMatch} />

      <div className="flex gap-3 mt-4">
        <StatTile
          icon={Gauge}
          label="Match score"
          value={selectedMatch.score}
          sub={`out of 100 · ${selectedMatch.duration}`}
        />
      </div>
      <div className="mt-3">
        <CoverageBar matched={selectedMatch.matched} total={selectedMatch.total} />
      </div>

      <div
        className="flex items-center justify-between text-[11px] mt-4 px-1"
        style={{ color: MUTED }}
      >
        <span className="flex items-center gap-1.5">
          <RotateCcw size={12} /> Updated {selectedMatch.uploaded}
        </span>
        <span className="flex items-center gap-1.5">
          <Download size={12} /> Save offline
        </span>
      </div>
    </div>
  )
}
