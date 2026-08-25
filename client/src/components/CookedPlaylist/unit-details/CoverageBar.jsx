import { Gauge } from 'lucide-react';

export default function CoverageBar({ matched, total }) {
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

  const pct = Math.round((matched / total) * 100);
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "#FFFFFF", border: `1px solid ${HAIRLINE}` }}
    >
      <div className="flex items-center justify-between text-xs mb-2" style={{ color: MUTED }}>
        <span className="flex items-center gap-1.5">
          <Gauge size={13} /> Topics covered
        </span>
        <span>
          {matched}/{total}
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: HAIRLINE }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${TEAL} 0%, ${TEAL_BRIGHT} 100%)` }}
        />
      </div>
    </div>
  );
}