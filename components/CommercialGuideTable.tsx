import type { ReactNode } from "react";

export interface CommercialGuideTableColumn {
  key: string;
  label: string;
  className?: string;
}

export interface CommercialGuideTableRow {
  key: string;
  cells: Record<string, ReactNode>;
}

interface CommercialGuideTableProps {
  caption: string;
  columns: readonly CommercialGuideTableColumn[];
  rows: readonly CommercialGuideTableRow[];
  minWidthClassName?: string;
}

export default function CommercialGuideTable({
  caption,
  columns,
  rows,
  minWidthClassName = "min-w-[860px]",
}: CommercialGuideTableProps) {
  return (
    <div className="max-w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className={`w-full text-left text-sm ${minWidthClassName}`}>
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-[#001a4e] text-white">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-sky-100 ${column.className ?? ""}`.trim()}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row) => (
            <tr key={row.key} className="align-top even:bg-slate-50/70">
              {columns.map((column, index) => (
                <td
                  key={column.key}
                  className={`px-5 py-5 leading-6 text-slate-600 ${index === 0 ? "font-semibold text-[#001a4e]" : ""} ${column.className ?? ""}`.trim()}
                >
                  {row.cells[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
