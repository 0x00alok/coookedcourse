import { INK, MUTED, HAIRLINE } from '@/constants/colors';

export default function YTChannelSelect({ navChannels, onChannelSelect, activeChannelIndex }) {
  return (
    <div className="flex items-center gap-2 mb-8 flex-wrap">
      {navChannels.map((f, i) => {
        const isActive = activeChannelIndex === i;

        return (
          <button
            key={f}
            onClick={() => onChannelSelect(i)}
            className="rounded-full text-xs font-medium px-3.5 py-1.5 transition border"
            style={
              isActive
                ? { background: INK, color: "#fff", borderColor: INK }
                : { background: "#fff", color: MUTED, borderColor: HAIRLINE }
            }
          >
            {f}
          </button>
        );
      })}
    </div>
  )
}
