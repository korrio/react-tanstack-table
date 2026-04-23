import { SearchX } from "lucide-react";

interface TableNoDataProps {
  text?: string;
  height?: string;
}

export function TableNoData({
  text = "ไม่พบข้อมูล",
  height = "360px",
}: TableNoDataProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-muted-foreground"
      style={{ height }}
    >
      <SearchX className="h-10 w-10 mb-2 opacity-40" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
