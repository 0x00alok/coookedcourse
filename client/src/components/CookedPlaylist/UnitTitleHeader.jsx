export default function UnitTitleHeader() {
  const INK = "#12151B";
  const TEAL = "#0E7C66";

  return (
    <>
      <p className="font-gloria text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: TEAL }}>
        React Fundamentals · Your syllabus
      </p>
      <h1 className="text-[26px] font-semibold mb-4" style={{ color: INK }}>
        Videos matched to your syllabus
      </h1>
    </>
  )
}
