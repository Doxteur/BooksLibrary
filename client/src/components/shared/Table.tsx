import React, { useState, useMemo } from "react";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";
import TablePagination from "@/components/shared/TablePagination";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'select';
  filterOptions?: { value: string; label: string }[];
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  highlightRow?: (item: T) => boolean;
  onRowClick?: (item: T) => void;
  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (newPage: number) => void;
  isLoading?: boolean;
}

function Table<T>({
  data,
  columns,
  highlightRow,
  onRowClick,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  isLoading,
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (accessor: keyof T, value: string) => {
    setFilters(prev => ({ ...prev, [accessor]: value }));
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item =>
          String(item[key as keyof T]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortColumn, sortDirection]);

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4">
        {columns.map(column => {
          if (column.filterable) {
            if (column.filterType === 'select' && column.filterOptions) {
              return (
                <Select
                  key={String(column.accessor)}
                  value={filters[column.accessor as string] || undefined}
                  onValueChange={(value) => handleFilterChange(column.accessor, value)}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    {column.filterOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            } else {
              return (
                <Input
                  key={String(column.accessor)}
                  placeholder={`Filtrer par ${column.header.toLowerCase()}`}
                  value={filters[column.accessor as string] || ''}
                  onChange={(e) => handleFilterChange(column.accessor, e.target.value)}
                  className="max-w-xs"
                />
              );
            }
          }
          return null;
        })}
      </div>
      <UITable>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={`${column.className} ${
                  column.sortable ? "cursor-pointer" : ""
                }`}
                onClick={() => column.sortable && handleSort(column.accessor)}
              >
                {column.header}
                {column.sortable &&
                  sortColumn === column.accessor &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline ml-1" />
                  ) : (
                    <ChevronDown className="inline ml-1" />
                  ))}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex space-x-2 justify-center items-center bg-white">
                  <span className="sr-only">Loading...</span>
                  <div className="h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-4 w-4 bg-black rounded-full animate-bounce"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredAndSortedData.map((item, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={`${
                  highlightRow && highlightRow(item) ? "bg-accent" : ""
                } ${onRowClick ? "cursor-pointer hover:bg-muted" : ""}`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column, cellIndex) => (
                  <TableCell key={cellIndex} className={column.className}>
                    {column.cell
                      ? column.cell(item)
                      : String(item[column.accessor])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </UITable>
      {onPageChange && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}

export default Table;
