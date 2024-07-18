"use client"

import * as React from "react"
import { Trash } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.getValue() === 'create-account' && (
                        <div>Criação de conta</div>
                      )}
                      {cell.getValue() === 'withdraw-zero-fee' && (
                        <div>Saque taxa zero</div>
                      )}
                      {cell.getValue() === 'withdraw-main-account' && (
                        <div>Saque da conta principal</div>
                      )}
                      {cell.getValue() === 'transfer-between-account' && (
                        <div>Transferência entre contas</div>
                      )}
                      {cell.getValue() === '6.00' && (
                        <div>R$ 6,00</div>
                      )}
                      {cell.getValue() === '10.00' && (
                        <div>R$ 10,00</div>
                      )}
                      {cell.getValue() === '15.00' && (
                        <div>15 %</div>
                      )}
                      {cell.getValue() === '0.01' && (
                        <div>0,1 %</div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
