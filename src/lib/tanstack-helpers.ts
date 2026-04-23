import type { ColumnDef, Header } from "@tanstack/react-table";

type LegacyColumn = {
  label: string;
  property: string;
  sortable: boolean;
  index: number;
  prop?: string;
  value?: string;
  [key: string]: any;
};

export const toLegacyColumn = (headerDef: any, index: number): LegacyColumn => {
  if (!headerDef) {
    return { label: "", property: "", sortable: false, index };
  }
  const label = headerDef.label ?? headerDef.text ?? headerDef.title ?? "";
  const property =
    headerDef.property ?? headerDef.prop ?? headerDef.value ?? headerDef.key ?? "";
  return {
    ...headerDef,
    label,
    property,
    prop: headerDef.prop ?? property,
    value: headerDef.value ?? property,
    sortable: Boolean(headerDef.sortable),
    index,
  };
};

export const getLegacyColumn = (header: Header<any, unknown>): LegacyColumn => {
  const meta = header.column.columnDef.meta as
    | { headerDef?: any; index?: number }
    | undefined;
  return toLegacyColumn(meta?.headerDef, meta?.index ?? 0);
};

export const buildColumnDefs = <TData = any>(
  headers: any[],
  resolveColumnSize?: (index: number, header: any) => number | undefined
): ColumnDef<TData>[] => {
  return (headers ?? []).map((header, index) => {
    const size = resolveColumnSize ? resolveColumnSize(index, header) : undefined;
    return {
      id: header.value ?? `col_${index}`,
      accessorKey: header.value,
      header: header.text,
      cell: (info) => info.getValue(),
      enableSorting: Boolean(header.sortable),
      size,
      minSize: typeof header.minWidth === "number" ? header.minWidth : undefined,
      meta: {
        headerDef: header,
        index,
        size,
      },
    };
  });
};
