import Sidebar from '@/components/Sidebar';
import UnitTitleHeader from '@/components/CookedPlaylist/UnitTitleHeader';
import UnitRail from '@/components/CookedPlaylist/UnitRail';
import SearchTopic from '@/components/SearchTopic';
import YTChannelSelect from '@/components/CookedPlaylist/YTChannelSelect';
import SortUnit from '@/components/CookedPlaylist/SortUnit';
import YTTopicCard from '@/components/CookedPlaylist/YTTopicCard';
import UnitDetailsCard from '@/components/CookedPlaylist/UnitDetailsCard';

const PAPER = "#F5F6F4";

const matches = [
  {
    id: 1,
    channel: "CodeWithSara",
    handle: "@codewithsara",
    initials: "CS",
    color: "#17324A",
    unit: "Unit 4",
    topic: "Custom hook patterns and lifecycle debugging",
    subs: "1.2M subscribers",
    uploaded: "3 days ago",
    duration: "42 min",
    level: "Intermediate",
    matched: 5,
    total: 6,
    score: 92,
  },
  {
    id: 2,
    channel: "Akshay Saini",
    handle: "@akshaysaini",
    initials: "AS",
    color: "#0E7C66",
    unit: "Unit 2",
    topic: "Call stack, closures, and hoisting explained end-to-end",
    subs: "890K subscribers",
    uploaded: "1 week ago",
    duration: "58 min",
    level: "Advanced",
    matched: 6,
    total: 6,
    score: 97,
  },
  {
    id: 3,
    channel: "CampusX",
    handle: "@campusx",
    initials: "CX",
    color: "#4A5568",
    unit: "Unit 5",
    topic: "Redux Toolkit walkthrough with a real project",
    subs: "540K subscribers",
    uploaded: "5 days ago",
    duration: "51 min",
    level: "Intermediate",
    matched: 4,
    total: 7,
    score: 74,
  },
  {
    id: 4,
    channel: "Gate Smashers",
    handle: "@gatesmashers",
    initials: "GS",
    color: "#3B4252",
    unit: "Unit 1",
    topic: "Normalization forms with worked examples",
    subs: "1.5M subscribers",
    uploaded: "today",
    duration: "36 min",
    level: "Beginner",
    matched: 6,
    total: 6,
    score: 100,
  },
  {
    id: 5,
    channel: "Trouble Free",
    handle: "@troublefree",
    initials: "TF",
    color: "#5B4636",
    unit: "Unit 6",
    topic: "CI/CD pipeline setup for React apps",
    subs: "610K subscribers",
    uploaded: "2 days ago",
    duration: "44 min",
    level: "Intermediate",
    matched: 3,
    total: 6,
    score: 58,
  },
];

export default function TestCp() {
  return (
    <div className="min-h-screen overflow-x-hidden font-nunito" style={{ background: PAPER }}>
      <Sidebar />

      {/* Main Content */}
      <div className="ml-16 flex overflow-x-hidden">
        <div className="flex-1 min-w-0 px-10 py-8">
          <UnitTitleHeader />

          <UnitRail />

          <SearchTopic />

          <YTChannelSelect />

          <SortUnit />

          <YTTopicCard />
        </div>

        {/* Unit Detail Section*/}
        <UnitDetailsCard />

      </div>
    </div>
  );
}