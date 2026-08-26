function Header() {
    return (
        <div className="mb-2 flex flex-col items-center text-center">
            <div className="mb-5 flex h-8 w-8 rotate-2 items-center justify-center rounded-sm bg-[#1C1B18]">
                <span
                    className="-rotate-2 text-sm font-semibold text-[#F6F5F1]"
                    style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
                >
                    C
                </span>
            </div>

            <h1
                className="text-[2rem] leading-none tracking-tight text-[#1C1B18]"
                style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
            >
                Cooked<span className="font-light italic text-[#46592E]">Course</span>
            </h1>

            <p className="mt-3 max-w-[19rem] text-[13px] leading-relaxed text-[#1C1B18]/55">
                Enter your syllabus details to generate a structured study journey.
            </p>
        </div>
    );
}

export default Header;