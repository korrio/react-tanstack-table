"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  rowsPerPageOptions?: number[];
  className?: string;
}

export function Pagination({
  currentPage,
  totalResults,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100, -1],
  className,
}: PaginationProps) {
  const totalPages =
    rowsPerPage === -1 ? 1 : Math.max(1, Math.ceil(totalResults / rowsPerPage));
  const startResult =
    rowsPerPage === -1 ? 1 : (currentPage - 1) * rowsPerPage + 1;
  const endResult =
    rowsPerPage === -1
      ? totalResults
      : Math.min(currentPage * rowsPerPage, totalResults);

  return (
    <div
      className={cn(
        "flex items-center justify-between px-2 py-2 text-sm",
        className
      )}
    >
      <div className="text-muted-foreground hidden sm:block">
        แสดง {totalResults > 0 ? startResult : 0} - {endResult} จาก{" "}
        {totalResults} รายการ
      </div>

      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
        {onRowsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-muted-foreground">
              แสดง:
            </span>
            <select
              value={rowsPerPage}
              onChange={(e) =>
                onRowsPerPageChange(Number(e.target.value))
              }
              className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option === -1 ? "ทั้งหมด" : option}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 hidden sm:flex"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="flex w-[100px] items-center justify-center text-sm font-medium tabular-nums">
            หน้า {currentPage} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 hidden sm:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
