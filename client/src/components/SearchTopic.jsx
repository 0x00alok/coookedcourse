import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from 'lucide-react';

export default function SearchTopic() {
  const HAIRLINE = "#E7E8E3";
  const MUTED = "#6E7180";

  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: MUTED }} />
        <Input
          placeholder="Search matched videos..."
          className="h-11 rounded-xl bg-white pl-11 text-sm border"
          style={{ borderColor: HAIRLINE }}
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-11 w-11 shrink-0 rounded-xl bg-white"
        style={{ borderColor: HAIRLINE }}
      >
        <SlidersHorizontal className="w-4 h-4" style={{ color: MUTED }} strokeWidth={1.8} />
      </Button>
    </div>
  )
}
