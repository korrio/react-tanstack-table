/**
 * Centralized Tailwind CSS classes for DataTable components
 *
 * All table styling follows shadcn/ui patterns with pure Tailwind CSS.
 */
export const tableStyles = {
  // Container
  wrapper: "rounded-md border bg-background",
  container: "flex flex-col gap-4",
  // Table scroll wrapper
  scrollWrapper: "relative w-full overflow-x-auto",
  // Table base - table-fixed ensures consistent column widths across header/body/footer
  table: "w-full table-fixed caption-bottom text-sm",
  // Header
  thead: "[&_tr]:border-b",
  th: "text-muted-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  headerWrapper: "overflow-hidden bg-background",
  headerSticky: "sticky top-14 z-20",
  // Body
  tbody: "[&_tr:last-child]:border-0",
  tr: "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
  td: "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  // Sticky columns (z-index hierarchy: header > cell)
  stickyHeader: "sticky z-30 bg-background",
  stickyCell: "sticky z-20 bg-background",
  stickyFooter: "sticky z-20 bg-background",
  // States
  empty: "h-24 text-center",
  // Footer
  footerWrapper: "overflow-hidden bg-background border-t",
  // Body wrapper with scroll
  bodyWrapper: "relative w-full overflow-auto overscroll-contain",
} as const;

/**
 * Toolbar styles for table header area
 */
export const toolbarStyles = {
  container: "space-y-2",
  filterRow:
    "flex flex-col justify-between sm:flex-row sm:items-center gap-4",
  searchInput: "h-9 w-full sm:w-[250px]",
  title: "text-2xl font-semibold tracking-tight",
} as const;

/**
 * Alignment utilities for table cells (header, body, footer)
 */
export const alignMap: Record<string, string> = {
  left: "text-left justify-start",
  center: "text-center justify-center",
  right: "text-right justify-end",
} as const;

export type AlignType = "left" | "center" | "right";

export interface HeaderDef {
  headerAlign?: AlignType;
  cellAlign?: AlignType;
  footerAlign?: AlignType;
  align?: AlignType;
  [key: string]: any;
}

export const getHeaderAlignClass = (header: HeaderDef | any): string => {
  const align = header?.headerAlign || header?.align || "left";
  return alignMap[align] || alignMap.left;
};

export const getCellAlignClass = (header: HeaderDef | any): string => {
  const align = header?.cellAlign || header?.align || "left";
  return alignMap[align] || alignMap.left;
};

export const getFooterAlignClass = (header: HeaderDef | any): string => {
  const align = header?.footerAlign || header?.align || "left";
  return alignMap[align] || alignMap.left;
};
