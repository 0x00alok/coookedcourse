import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import Header from '../components/CookedCourse/Header';
import MainBody from '../components/CookedCourse/MainBody';

function CookedCourse() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen w-full bg-[#F6F5F1] px-6 py-16 font-sans text-[#1C1B18]">
            {/* faint paper texture */}
            <div
                className="pointer-events-none fixed inset-0 opacity-40"
                style={{
                    backgroundImage: 'radial-gradient(#DAD6C8 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                }}
            />

            <button
                onClick={() => navigate('/')}
                className="group relative z-10 mx-auto mb-10 flex w-full max-w-3xl items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1C1B18]/45 transition-colors hover:text-[#1C1B18] focus-visible:outline-none focus-visible:text-[#1C1B18]"
            >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                Back to Home
            </button>

            <div className="relative z-10 mx-auto w-full max-w-3xl">
                {/* stamped card tab — the one signature move */}
                <div className="relative">
                    <span className="absolute -top-3 left-6 -rotate-1 rounded-sm bg-[#1C1B18] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#F6F5F1]">
                        Syllabus → Plan
                    </span>

                    <div className="rounded-md border border-[#E4E1D6] bg-white px-8 pb-10 pt-10">
                        <Header />

                        <div className="mt-10 border-t border-[#E4E1D6] pt-10">
                            <MainBody />
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-center gap-2 text-[#1C1B18]/35">
                    <span className="h-[3px] w-[3px] rounded-full bg-current" />
                    <span className="text-[9px] font-medium uppercase tracking-[0.4em]">CookedCourse</span>
                    <span className="h-[3px] w-[3px] rounded-full bg-current" />
                </div>
            </div>
        </div>
    );
}

export default CookedCourse;