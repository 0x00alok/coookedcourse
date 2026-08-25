import { useState } from 'react'

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, MoreHorizontal } from 'lucide-react';

const INK = "#12151B";
const MUTED = "#6E7180";
const PAPER = "#F5F6F4";
const HAIRLINE = "#E7E8E3";
const TEAL = "#0E7C66";
const AMBER = "#D98E3B";

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

function MatchRing({ score, size = 46, stroke = 4 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const tone = score >= 90 ? TEAL : score >= 70 ? AMBER : "#B5622E";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={HAIRLINE} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[11px] font-semibold" style={{ color: tone }}>
          {score}
        </span>
      </div>
    </div>
  );
}

export default function YTTopicCard() {
  const [selectedMatch, setSelectedMatch] = useState(matches[0]);

  return (
    <div className="space-y-3">
      {matches.map((m) => {
        const isSelected = selectedMatch.id === m.id;
        return (
          <Card
            key={m.id}
            onClick={() => setSelectedMatch(m)}
            className="flex-row items-center gap-4 p-4 cursor-pointer transition rounded-2xl border shadow-none"
            style={{
              borderColor: isSelected ? TEAL : HAIRLINE,
              background: isSelected ? "#F1F8F6" : "#fff",
            }}
          >
            <Avatar className="h-11 w-11 shrink-0">
              <AvatarFallback style={{ background: m.color, color: "#fff" }}>{m.initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate" style={{ color: INK }}>
                  {m.channel}
                </h3>
                <Badge
                  variant="outline"
                  className="text-[10px] font-medium px-1.5 py-0 h-5 rounded-full"
                  style={{ borderColor: HAIRLINE, color: MUTED }}
                >
                  {m.unit}
                </Badge>
              </div>
              <p className="text-sm mt-0.5 truncate" style={{ color: MUTED }}>
                {m.topic}
              </p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>
                {m.handle} · {m.subs} · {m.duration} · {m.level}
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-center text-center shrink-0 pl-2" style={{ minWidth: 64 }}>
              <span className="text-[10px]" style={{ color: MUTED }}>
                {m.matched}/{m.total} topics
              </span>
              <span className="text-[10px]" style={{ color: MUTED }}>
                {m.uploaded}
              </span>
            </div>

            <MatchRing score={m.score} />

            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Bookmark className="w-4 h-4" style={{ color: MUTED }} />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="w-4 h-4" style={{ color: MUTED }} />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  )
}
