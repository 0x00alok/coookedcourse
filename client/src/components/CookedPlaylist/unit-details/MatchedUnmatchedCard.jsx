import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, CircleDashed } from "lucide-react";

export default function MatchedUnmatchedCard({
  matchedSyllabusTopics = [],
  unmatchedSyllabusTopics = [],
}) {
  const [tab, setTab] = useState("matched");

  const matchedCount = matchedSyllabusTopics.length;
  const unmatchedCount = unmatchedSyllabusTopics.length;
  const total = matchedCount + unmatchedCount;
  const pct = total ? Math.round((matchedCount / total) * 100) : 0;

  return (
    <Card className="w-full max-w-md bg-white shadow-sm mt-3">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#1c1b17] text-base font-semibold tracking-tight">
            Syllabus Coverage
          </CardTitle>
          <span className="text-xs font-medium text-[#8a8574]">
            {matchedCount}/{total} matched
          </span>
        </div>

        {/* coverage bar */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#eae6d9]">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2 bg-[#f0ecdf]">
            <TabsTrigger
              value="matched"
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-[#1c1b17]"
            >
              Matched ({matchedCount})
            </TabsTrigger>
            <TabsTrigger
              value="unmatched"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white text-[#1c1b17]"
            >
              Unmatched ({unmatchedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matched" className="mt-3">
            <TopicList
              topics={matchedSyllabusTopics}
              icon={<CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />}
              accentClass="border-teal-600/20 bg-teal-600/5"
              emptyLabel="No topics matched yet."
            />
          </TabsContent>

          <TabsContent value="unmatched" className="mt-3">
            <TopicList
              topics={unmatchedSyllabusTopics}
              icon={<CircleDashed className="h-4 w-4 text-amber-500 shrink-0" />}
              accentClass="border-amber-500/20 bg-amber-500/5"
              emptyLabel="Every topic has a match."
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function TopicList({ topics, icon, accentClass, emptyLabel }) {
  if (!topics.length) {
    return (
      <p className="py-6 text-center text-sm text-[#8a8574]">{emptyLabel}</p>
    );
  }

  return (
    <ul className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
      {topics.map((topic, i) => (
        <li
          key={`${topic}-${i}`}
          className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm text-[#1c1b17] ${accentClass}`}
        >
          {icon}
          <span className="leading-snug">{topic}</span>
        </li>
      ))}
    </ul>
  );
}