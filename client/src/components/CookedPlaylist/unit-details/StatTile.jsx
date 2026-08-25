export default function StatTile({ icon: Icon, label, value, sub }) {
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
      className="rounded-2xl p-4 flex-1"
      style={{ background: "#FFFFFF", border: `1px solid ${HAIRLINE}` }}
    >
      <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: MUTED }}>
        <Icon size={13} />
        {label}
      </div>
      <p className="text-2xl font-semibold" style={{ color: INK }}>
        {value}
      </p>
      {sub && (
        <p className="text-[11px] mt-1" style={{ color: MUTED }}>
          {sub}
        </p>
      )}
    </div>
  );
}