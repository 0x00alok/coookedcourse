import { Home, ChefHat, BarChart2, Settings, SquareLibrary, HandPlatter } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: ChefHat, label: "Syllabus" },
    { icon: BarChart2, label: "Details" },
    { icon: Settings, label: "Settings" },
    { icon: SquareLibrary, label: "Discover" },
  ];
  return (
    <div className="fixed top-0 left-0 h-screen w-16 shrink-0 border-r border-slate-100 bg-white z-20 overflow-y-auto flex flex-col justify-center items-center">
      <div className="text-xl font-bold text-indigo-900 ml-auto mr-auto pt-4">
        <HandPlatter />
      </div>

      <nav className="flex flex-col mt-25 space-y-1">
        {navItems.map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm ${active ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-400 hover:text-slate-600"
              }`}
          >
            <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
          </div>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-2 bg-gray-100 rounded-sm mb-4 shadow-sm">
        <img
          src="https://i.pravatar.cc/64?img=13"
          alt="Samuel L."
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
    </div>
  )
}
