"use client";

import { useState, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  Row,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Save,
  X,
  Wand2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DataTableProps {
  data: any[];
  onDataChange?: (newData: any[]) => void;
}

export function DataTable({ data: initialData, onDataChange }: DataTableProps) {
  const [data, setData] = useState(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const { toast } = useToast();

  const updateData = (newData: any[]) => {
    setData(newData);
    onDataChange?.(newData);
  };

  const columns = useMemo(() => {
    if (!data.length) return [];

    return Object.keys(data[0]).map((key) => ({
      accessorKey: key,
      header: ({ column }: any) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center"
          >
            {key}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row, column, getValue }: any) => {
        const isEditing = 
          editingCell?.rowIndex === row.index && 
          editingCell?.columnId === column.id;
        const value = getValue();
        const isEmpty = value === null || value === undefined || value === "";

        if (isEditing) {
          return (
            <div className="flex items-center space-x-2">
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-8 px-2 border rounded"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const newData = [...data];
                  newData[row.index][column.id] = editValue;
                  updateData(newData);
                  setEditingCell(null);
                  toast({
                    title: "Cell Updated",
                    description: "The cell value has been updated successfully.",
                  });
                }}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingCell(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        }

        return (
          <div
            className={`cursor-pointer hover:bg-muted/50 p-2 rounded ${
              isEmpty ? "text-red-500 italic" : ""
            }`}
            onClick={() => {
              setEditingCell({ rowIndex: row.index, columnId: column.id });
              setEditValue(value?.toString() ?? "");
            }}
          >
            {isEmpty ? "Empty" : value}
          </div>
        );
      },
    })) as ColumnDef<any>[];
  }, [data, editingCell, editValue, toast, onDataChange]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  const handleDeleteRow = (row: Row<any>) => {
    const newData = data.filter((_, index) => index !== row.index);
    updateData(newData);
    toast({
      title: "Row Deleted",
      description: "The row has been removed from the dataset.",
    });
  };

  const handleDeleteColumn = (columnId: string) => {
    const newData = data.map(row => {
      const { [columnId]: removed, ...rest } = row;
      return rest;
    });
    updateData(newData);
    toast({
      title: "Column Deleted",
      description: `The column "${columnId}" has been removed from the dataset.`,
    });
  };

  const handleCleanColumn = (columnId: string) => {
    const columnValues = data.map(row => row[columnId]).filter(val => val !== null && val !== undefined && val !== "");
    let cleaningMethod: string;
    let newData = [...data];

    // Detect if the column contains numeric values
    const isNumeric = columnValues.every(val => !isNaN(Number(val)));

    if (isNumeric) {
      // For numeric columns, use mean
      const sum = columnValues.reduce((acc, val) => acc + Number(val), 0);
      const mean = sum / columnValues.length;
      newData = data.map(row => ({
        ...row,
        [columnId]: row[columnId] || mean.toFixed(2)
      }));
      cleaningMethod = "mean value";
    } else {
      // For non-numeric columns, use mode (most frequent value)
      const frequency: { [key: string]: number } = {};
      columnValues.forEach(val => {
        frequency[val] = (frequency[val] || 0) + 1;
      });
      const mode = Object.entries(frequency).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      newData = data.map(row => ({
        ...row,
        [columnId]: row[columnId] || mode
      }));
      cleaningMethod = "most frequent value";
    }

    updateData(newData);
    toast({
      title: "Column Cleaned",
      description: `Empty values in "${columnId}" have been filled with the ${cleaningMethod}.`,
    });
  };

  if (!data.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table.getAllColumns().map((column) => (
                <DropdownMenuItem key={column.id}>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={(e) => column.toggleVisibility(e.target.checked)}
                    />
                    <span>{column.id}</span>
                  </label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead>Actions</TableHead>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center justify-between">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleCleanColumn(header.column.id)}
                            >
                              <Wand2 className="mr-2 h-4 w-4" />
                              Clean Empty Values
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteColumn(header.column.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Column
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleDeleteRow(row)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Row
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}