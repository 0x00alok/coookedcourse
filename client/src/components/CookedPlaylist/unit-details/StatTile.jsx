import { HAIRLINE, INK, MUTED } from '@/constants/colors';

export default function StatTile({ icon: Icon, label, value, sub }) {
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