import { Badge } from '@/components/ui/badge';
import IsoDoodles from './IsoDoodles';
import { MoreVertical, Play, Users } from 'lucide-react';

export default function MatchHeroCard({ match }) {
  const [firstWord, ...rest] = match.unit.split(" ");
  const restText = rest.join(" ");

  const INK = "#12151B";
  const MUTED = "#6E7180";
  const PAPER = "#F5F6F4";
  const HAIRLINE = "#E7E8E3";
  const TEAL = "#0E7C66";
  const TEAL_BRIGHT = "#2FD9B4";
  const AMBER = "#D98E3B";

  const PANEL_BG = "#F7F7F5";
  const HERO_BG = "#EEF0EA";
  const LIME = "#BEF264";
  const LIME_SOFT = "#E3F6B8";

  return (
    <div
      className="rounded-[26px] overflow-hidden"
      style={{ background: "#FFFFFF", border: `1px solid ${HAIRLINE}` }}
    >
      <div className="relative h-[168px]" style={{ background: HERO_BG }}>
        <IsoDoodles />

        <button
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm"
          style={{ border: `1px solid ${HAIRLINE}` }}
          aria-label="More options"
        >
          <MoreVertical size={15} style={{ color: MUTED }} />
        </button>

        <div className="absolute left-5 bottom-5 right-16">
          <p className="text-[17px] leading-snug" style={{ color: INK }}>
            Best pick for{" "}
            <span
              className="font-semibold"
              style={{ background: LIME_SOFT, padding: "1px 5px", borderRadius: 4 }}
            >
              {firstWord} {restText}
            </span>{" "}
            right now.
          </p>
        </div>
      </div>

      <div className="px-5">
        <div
          className="h-11 w-11 rounded-2xl flex items-center justify-center -mt-[22px] shadow-sm relative z-10"
          style={{ background: LIME }}
        >
          <span className="text-sm font-bold" style={{ color: INK }}>
            {match.initials}
          </span>
        </div>
      </div>

      <div className="px-5 pt-3 pb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-semibold" style={{ color: INK }}>
            {match.channel}
          </h3>
          <Badge
            variant="secondary"
            className="text-[10px] font-medium px-2 py-0 h-5 rounded-full border-0"
            style={{ background: "#EFF0EC", color: MUTED }}
          >
            {match.level}
          </Badge>
        </div>

        <p className="text-sm mt-1.5 leading-relaxed" style={{ color: MUTED }}>
          {match.topic}
        </p>
      </div>

      <div style={{ borderTop: `1px solid ${HAIRLINE}` }} />

      <div className="flex items-center justify-between px-5 py-4">
        <button
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-slate-50"
          style={{ background: "#FFFFFF", border: `1px solid ${HAIRLINE}`, color: INK }}
        >
          <Play size={14} fill={INK} />
          Preview video
        </button>

        <div className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
          <Users size={13} />
          {match.subs}
        </div>
      </div>
    </div>
  );
}