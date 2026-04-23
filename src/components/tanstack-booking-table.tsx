"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  X,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchShortcut } from "@/hooks/use-search-shortcut";
import { useBookingStore } from "@/stores/booking-store";
import type { Booking } from "@/stores/booking-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { TableNoData } from "@/components/table-no-data";
import {
  getHeaderAlignClass,
  getCellAlignClass,
} from "@/lib/table-styles";

const statusConfig = {
  confirmed: {
    label: "ยืนยันแล้ว",
    variant: "default" as const,
    className: "bg-black text-white hover:bg-black/80",
  },
  pending: {
    label: "รออนุมัติ",
    variant: "outline" as const,
    className: "border-black text-black",
  },
  cancelled: {
    label: "ยกเลิก",
    variant: "secondary" as const,
    className: "bg-neutral-200 text-neutral-600",
  },
};

export function TanstackBookingTable() {
  // -- Zustand store --
  const bookings = useBookingStore((s) => s.bookings);
  const loading = useBookingStore((s) => s.loading);
  const updatingId = useBookingStore((s) => s.updatingId);
  const error = useBookingStore((s) => s.error);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const confirmBookingAction = useBookingStore((s) => s.confirmBooking);
  const cancelBookingAction = useBookingStore((s) => s.cancelBooking);

  // -- Refs --
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const bodyContainerRef = React.useRef<HTMLDivElement>(null);
  const headerWrapperRef = React.useRef<HTMLDivElement>(null);

  // -- Local UI state --
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isFocused, setIsFocused] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [searchShortcut, setSearchShortcut] = React.useState("Alt+K");

  // -- Detect platform for keyboard shortcut label (client-only) --
  React.useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.platform.toUpperCase().includes("MAC")) {
      setSearchShortcut("⌘K");
    }
  }, []);

  // -- Fetch on mount --
  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // -- Debounced search --
  const debouncedFilter = useDebounce(globalFilter, 300);

  // -- Search shortcut --
  useSearchShortcut(searchInputRef);

  // -- Column definitions (learned from gist: buildColumnDefs pattern) --
  const columns = React.useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "#",
        size: 60,
        enableSorting: true,
        meta: { align: "center" },
      },
      {
        id: "customer",
        accessorKey: "customer",
        header: "ลูกค้า",
        size: 180,
        enableSorting: true,
        meta: { align: "left" },
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate">{row.original.customer}</span>
          </div>
        ),
      },
      {
        id: "court",
        accessorKey: "court",
        header: "สนาม",
        size: 180,
        enableSorting: true,
        meta: { align: "left" },
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate">{row.original.court}</span>
          </div>
        ),
      },
      {
        id: "date",
        accessorKey: "date",
        header: "วันที่",
        size: 140,
        enableSorting: true,
        meta: { align: "left" },
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            {row.original.date}
          </div>
        ),
      },
      {
        id: "time",
        accessorKey: "time",
        header: "เวลา",
        size: 140,
        enableSorting: false,
        meta: { align: "left" },
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            {row.original.time}
          </div>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "สถานะ",
        size: 120,
        enableSorting: true,
        meta: { align: "center" },
        cell: ({ row }) => {
          const cfg = statusConfig[row.original.status];
          const isUpdating = updatingId === row.original.id;
          return (
            <Badge variant={cfg.variant} className={cn(cfg.className, isUpdating && "opacity-60")}>
              {isUpdating && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
              {cfg.label}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "จัดการ",
        size: 140,
        enableSorting: false,
        meta: { align: "center" },
        cell: ({ row }) => {
          const status = row.original.status;
          const isUpdating = updatingId === row.original.id;
          return (
            <div className="flex items-center justify-end gap-2">
              {status === "pending" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs border-black hover:bg-black hover:text-white"
                  onClick={() => confirmBookingAction(row.original.id)}
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : "อนุมัติ"}
                </Button>
              )}
              {status !== "cancelled" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-black"
                  onClick={() => cancelBookingAction(row.original.id)}
                  disabled={isUpdating}
                >
                  ยกเลิก
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [updatingId, confirmBookingAction, cancelBookingAction]
  );

  // -- TanStack Table instance (learned from gist) --
  const table = useReactTable({
    data: bookings,
    columns,
    state: {
      sorting,
      pagination,
      globalFilter: debouncedFilter,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const values = [
        String(row.original.customer),
        String(row.original.court),
        String(row.original.date),
        String(row.original.time),
        statusConfig[row.original.status].label,
      ];
      return values.some((v) => v.toLowerCase().includes(search));
    },
    getRowId: (row) => String(row.id),
  });

  const rows = table.getRowModel().rows;
  const flatRows = table.getFilteredRowModel().rows;

  // -- Virtual scrolling (learned from gist: useVirtualizer) --
  const enableVirtual = rows.length > 10;
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => bodyContainerRef.current,
    estimateSize: () => 52,
    overscan: 5,
    getItemKey: (index) => rows[index]?.id ?? `row-${index}`,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalVirtualSize = rowVirtualizer.getTotalSize();
  const virtualPaddingTop =
    virtualItems.length > 0 ? virtualItems[0].start : 0;
  const virtualPaddingBottom =
    virtualItems.length > 0
      ? totalVirtualSize - virtualItems[virtualItems.length - 1].end
      : 0;

  // -- Scroll sync (learned from gist: handleBodyScroll with RAF) --
  const scrollRafRef = React.useRef<number | null>(null);

  const handleBodyScroll = React.useCallback(() => {
    if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    scrollRafRef.current = requestAnimationFrame(() => {
      const scrollLeft = bodyContainerRef.current?.scrollLeft ?? 0;
      if (headerWrapperRef.current) {
        headerWrapperRef.current.scrollLeft = scrollLeft;
      }
      scrollRafRef.current = null;
    });
  }, []);

  React.useEffect(() => {
    return () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  // -- Resize observer for table (learned from gist) --
  React.useEffect(() => {
    if (!tableContainerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (enableVirtual) rowVirtualizer.measure();
    });
    ro.observe(tableContainerRef.current);
    return () => ro.disconnect();
  }, [enableVirtual, rowVirtualizer]);

  // -- Re-measure on data change --
  React.useEffect(() => {
    if (enableVirtual) rowVirtualizer.measure();
  }, [rows.length, enableVirtual, rowVirtualizer]);

  // -- Summary values (learned from gist) --
  const summaryValues = React.useMemo(() => {
    const confirmed = bookings.filter((d) => d.status === "confirmed").length;
    const pending = bookings.filter((d) => d.status === "pending").length;
    const cancelled = bookings.filter((d) => d.status === "cancelled").length;
    return { confirmed, pending, cancelled };
  }, [bookings]);

  const clearSearch = () => {
    setGlobalFilter("");
    searchInputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "w-full space-y-4 transition-all duration-300",
        expanded && "fixed inset-0 z-50 bg-background p-4 sm:p-6"
      )}
    >
      {/* Toolbar (learned from gist: menuSearchFilter pattern) */}
      <div
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
          expanded && "pb-4"
        )}
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            รายการจองสนาม
          </h2>
          <p className="text-sm text-muted-foreground">
            จัดการรายการจองสนามกีฬาทั้งหมด
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search input (learned from gist: animated-search-container) */}
          <div className="relative w-full sm:w-72">
            <button
              type="button"
              disabled
              className="absolute top-1/2 -translate-y-1/2 left-0"
            >
              <Search
                className={cn(
                  "h-4 w-4 ml-3 transition-colors duration-300",
                  isFocused || globalFilter
                    ? "text-foreground"
                    : "text-muted-foreground/40"
                )}
              />
            </button>
            <Input
              ref={searchInputRef}
              placeholder="ค้นหาลูกค้า หรือสนาม..."
              className="pl-9 pr-16"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {!isFocused && !globalFilter && (
              <kbd className="absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none px-2 py-0.5 text-[10px] font-semibold text-muted-foreground bg-muted border rounded-md">
                <span className="hidden sm:inline">{searchShortcut}</span>
              </kbd>
            )}
            {globalFilter && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute top-1/2 -translate-y-1/2 right-2 z-20"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Expand button (learned from gist: expandTableInsight) */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0"
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? "ย่อตาราง" : "ขยายตาราง"}
          >
            {expanded ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading skeleton (learned from gist: loading-table) */}
      {loading && (
        <div className="w-full space-y-2 animate-pulse">
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
        </div>
      )}

      {/* Table container (learned from gist: add-border rounded-lg overflow-clip) */}
      <div
        ref={tableContainerRef}
        className={cn(
          "rounded-lg border border-border bg-background overflow-hidden flex flex-col",
          expanded && "flex-1"
        )}
      >
        {/* Sticky header wrapper (learned from gist: headerWrapper) */}
        <div
          ref={headerWrapperRef}
          className="overflow-hidden bg-background border-b z-[61]"
        >
          <table className="w-full table-fixed caption-bottom text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as
                      | { align?: string }
                      | undefined;
                    const canSort = header.column.getCanSort();
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className={cn(
                          "h-10 px-2 text-left align-middle font-medium text-muted-foreground whitespace-nowrap",
                          canSort && "cursor-pointer select-none"
                        )}
                        style={{
                          width: header.getSize(),
                          minWidth: header.getSize(),
                        }}
                        onClick={
                          canSort
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        <div
                          className={cn(
                            "flex w-full items-center gap-2",
                            getHeaderAlignClass(meta)
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {canSort && (
                            <span className="ml-auto flex flex-col -space-y-1 shrink-0">
                              <ChevronUp
                                className={cn(
                                  "h-3 w-3",
                                  header.column.getIsSorted() === "asc"
                                    ? "text-foreground"
                                    : "text-muted-foreground/40"
                                )}
                              />
                              <ChevronDown
                                className={cn(
                                  "h-3 w-3",
                                  header.column.getIsSorted() === "desc"
                                    ? "text-foreground"
                                    : "text-muted-foreground/40"
                                )}
                              />
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
          </table>
        </div>

        {/* Body wrapper (learned from gist: bodyWrapper with scroll) */}
        <div
          ref={bodyContainerRef}
          className={cn(
            "relative w-full overflow-auto overscroll-contain",
            expanded ? "flex-1" : "max-h-[380px]"
          )}
          onScroll={handleBodyScroll}
        >
          {rows.length === 0 ? (
            <TableNoData text="ไม่พบรายการจอง" height="240px" />
          ) : (
            <table className="w-full table-fixed caption-bottom text-sm">
              <tbody className="[&_tr:last-child]:border-0">
                {enableVirtual ? (
                  <>
                    {/* Virtual padding top (learned from gist) */}
                    {virtualPaddingTop > 0 && (
                      <tr aria-hidden="true">
                        <td
                          colSpan={columns.length}
                          style={{ height: `${virtualPaddingTop}px` }}
                          className="p-0 border-0"
                        />
                      </tr>
                    )}

                    {/* Virtual rows */}
                    {virtualItems.map((virtualRow) => {
                      const row = rows[virtualRow.index];
                      if (!row) return null;
                      return (
                        <tr
                          key={row.id}
                          data-index={virtualRow.index}
                          ref={rowVirtualizer.measureElement}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          {row.getVisibleCells().map((cell) => {
                            const meta = cell.column.columnDef.meta as
                              | { align?: string }
                              | undefined;
                            return (
                              <td
                                key={cell.id}
                                className="p-2 align-middle"
                                style={{
                                  width: cell.column.getSize(),
                                  minWidth: cell.column.getSize(),
                                }}
                              >
                                <div
                                  className={cn(
                                    "flex items-center",
                                    getCellAlignClass(meta)
                                  )}
                                >
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}

                    {/* Virtual padding bottom (learned from gist) */}
                    {virtualPaddingBottom > 0 && (
                      <tr aria-hidden="true">
                        <td
                          colSpan={columns.length}
                          style={{ height: `${virtualPaddingBottom}px` }}
                          className="p-0 border-0"
                        />
                      </tr>
                    )}
                  </>
                ) : (
                  // Non-virtual rows
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => {
                        const meta = cell.column.columnDef.meta as
                          | { align?: string }
                          | undefined;
                        return (
                          <td
                            key={cell.id}
                            className="p-2 align-middle"
                            style={{
                              width: cell.column.getSize(),
                              minWidth: cell.column.getSize(),
                            }}
                          >
                            <div
                              className={cn(
                                "flex items-center",
                                getCellAlignClass(meta)
                              )}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary footer (learned from gist: isSummary + summaryValues) */}
        <div className="overflow-hidden bg-background border-t">
          <table className="w-full table-fixed caption-bottom text-sm">
            <tfoot>
              <tr className="border-t">
                <td className="p-2 align-middle text-sm font-medium">
                  สรุป
                </td>
                <td
                  colSpan={4}
                  className="p-2 align-middle text-sm text-muted-foreground"
                >
                  ยืนยัน {summaryValues.confirmed} / รออนุมัติ{" "}
                  {summaryValues.pending} / ยกเลิก {summaryValues.cancelled}
                </td>
                <td className="p-2 align-middle text-center">
                  <Badge variant="default" className="bg-black text-white">
                    {flatRows.length} รายการ
                  </Badge>
                </td>
                <td className="p-2 align-middle" />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Pagination (learned from gist: Pagination component) */}
      <Pagination
        currentPage={pagination.pageIndex + 1}
        totalResults={flatRows.length}
        rowsPerPage={pagination.pageSize}
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))
        }
        onRowsPerPageChange={(size) =>
          setPagination((prev) => ({
            ...prev,
            pageSize: size,
            pageIndex: 0,
          }))
        }
      />

      {/* Expand backdrop close */}
      {expanded && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-[60]"
          onClick={() => setExpanded(false)}
        >
          <Minimize2 className="h-4 w-4 mr-1" />
          ย่อตาราง
        </Button>
      )}
    </div>
  );
}
