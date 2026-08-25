import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';

export default function SortUnit() {
  const INK = "#12151B";
  const MUTED = "#6E7180";

  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: MUTED }}>
        Curated for this unit
      </h2>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 text-xs font-medium" style={{ color: INK }}>
            Sort: best match <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Best match</DropdownMenuItem>
          <DropdownMenuItem>Newest upload</DropdownMenuItem>
          <DropdownMenuItem>Most subscribers</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
