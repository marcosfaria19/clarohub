import React, { useEffect, useState } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "modules/shared/components/ui/table";
import { Button } from "modules/shared/components/ui/button";
import {
  DropdownMenuCheckboxItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  SearchIcon,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "modules/shared/components/ui/pagination";
import { Input } from "modules/shared/components/ui/input";
import { toast } from "sonner";
import { Skeleton } from "modules/shared/components/ui/skeleton";

export function TabelaPadrao({
  columns,
  data,
  actions,
  onEdit,
  onDelete,
  onCopy = false,
  onView = false,
  filterInput = true,
  columnFilter = true,
  pagination = true,
  isLoading = false,
  pageSize = 10,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Se actions for passado, adiciona a coluna de ações
  const columnsWithActions = React.useMemo(() => {
    if (actions) {
      return [
        ...columns,
        {
          id: "actions",
          header: "Ações",
          enableHiding: false,
          cell: ({ row }) => {
            const data = row.original;

            const copyDataToClipboard = () => {
              const values = columns
                .filter((column) => column.accessorKey)
                .map((column) => {
                  const keys = column.accessorKey.split(".");
                  const value = keys.reduce(
                    (acc, key) => (acc ? acc[key] : undefined),
                    data,
                  );
                  return `${column.header || column.accessorKey}: ${value || ""}`;
                })
                .join("\n");

              navigator.clipboard.writeText(values);
              toast.success("Item copiado com sucesso", { duration: 2000 });
            };

            return (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" disablePortal>
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  {onCopy && (
                    <DropdownMenuItem onClick={copyDataToClipboard}>
                      Copiar dados
                    </DropdownMenuItem>
                  )}
                  {onView && (
                    <DropdownMenuItem onClick={() => onView(data)}>
                      Exibir
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />

                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(data)}>
                      Editar
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem onClick={() => onDelete(data)}>
                      Excluir
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        },
      ];
    }
    return columns;
  }, [columns, actions, onEdit, onDelete, onCopy, onView]);

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const getValue = (obj, path) => {
        const keys = path.split(".");
        return keys.reduce(
          (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
          obj,
        );
      };

      const searchableValue = columnsWithActions
        .filter((column) => column.accessorKey)
        .map((column) => {
          const value = getValue(row.original, column.accessorKey);
          return value !== undefined ? String(value) : "";
        })
        .join(" ")
        .toLowerCase();

      console.log("🔍 Filtro:", {
        filterValue,
        searchableValue,
        rowOriginal: row.original,
      });

      return searchableValue.includes(filterValue.toLowerCase());
    },
  });

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        {columnsWithActions.map((column, cellIndex) => (
          <TableCell key={cellIndex}>
            <Skeleton className="h-6 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <>
      {/* Filtro */}
      <div>
        {filterInput && (
          <div className="mb-4 flex w-full justify-between">
            <div className="relative">
              <Input
                placeholder="Filtrar..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="w-full border-border bg-card pl-10 text-foreground placeholder-foreground/60 focus:border-accent focus:ring-accent"
                disabled={isLoading}
              />
              <SearchIcon
                className="absolute bottom-2.5 left-3 text-foreground/50 hover:opacity-80"
                size={20}
              />
            </div>
          </div>
        )}

        {/*Botão para ocultar colunas */}
        <div className="flex w-1/2 justify-end">
          {columnFilter && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="ml-auto"
                  disabled={isLoading}
                >
                  Colunas <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.columnDef.header}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          {header.column.columnDef.sorted ? (
                            <Button
                              className="flex text-menu-foreground"
                              variant="ghost"
                              onClick={() =>
                                header.column.toggleSorting(
                                  header.column.getIsSorted() === "asc",
                                )
                              }
                              disabled={isLoading}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )
                          )}
                        </>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderSkeletonRows()
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsWithActions.length}
                  className="h-24 text-center"
                >
                  Nenhum dado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <Pagination className="justify-between py-4">
          <PaginationContent>
            <span className="ml-2 text-sm">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>
          </PaginationContent>
          <PaginationContent>
            {table.getState().pagination.pageIndex > 0 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  disabled={isLoading}
                />
              </PaginationItem>
            )}

            {table.getState().pagination.pageIndex <
              table.getPageCount() - 1 && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  disabled={isLoading}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
