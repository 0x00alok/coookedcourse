import { useState } from 'react'

import { MUTED, PAPER, HAIRLINE, TEAL, AMBER, INK } from '@/constants/colors';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, MoreHorizontal } from 'lucide-react';

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

export default function YTTopicCard({ videos, fallbackVideos }) {
  const [selectedMatch, setSelectedMatch] = useState(0);

  return (
    <div className="space-y-3">
      {videos.map((vid, i) => {
        const isSelected = selectedMatch === i;
        return (
          <Card
            key={vid.id}
            onClick={() => setSelectedMatch(i)}
            className="flex-row items-center gap-4 p-4 cursor-pointer transition rounded-2xl border shadow-none"
            style={{
              borderColor: isSelected ? TEAL : HAIRLINE,
              background: isSelected ? "#F1F8F6" : "#fff",
            }}
          >
            <div className='h-18 w-18 shrink-0 flex items-center'>
              <img src={vid.thumbnail} alt="Yt thumbnail..." />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate" style={{ color: INK }}>
                  {vid.channel}
                </h3>
                <Badge
                  variant="outline"
                  className="text-[10px] font-medium px-1.5 py-0 h-5 rounded-full"
                  style={{ borderColor: HAIRLINE, color: MUTED }}
                >
                  Unit {vid.unit + 1}
                </Badge>
              </div>
              <p className="text-sm mt-0.5 truncate" style={{ color: MUTED }}>
                {vid.title}
              </p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>
                {`@${vid.channel}`} · 18k · 1 hr · Intermediate
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-center text-center shrink-0 pl-2" style={{ minWidth: 64 }}>
              <span className="text-[10px]" style={{ color: MUTED }}>
                8/14 topics
              </span>
              <span className="text-[10px]" style={{ color: MUTED }}>
                3 days ago
              </span>
            </div>

            <MatchRing score={100} />

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
