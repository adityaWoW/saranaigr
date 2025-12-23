"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DatePicker } from "./date-picker"
import { BSTS, BSTSDR } from "@/lib/definition"

export function DataTableBSTS({
  data,
  isLoading,
  handleClick,
  onDateChange
}: {
  data: BSTS[],
  isLoading: boolean,
  handleClick: (data: BSTS) => void,
  onDateChange: (date: Date | undefined) => void
}) {

  const columns: ColumnDef<BSTS>[] = [
  {
    accessorKey: "no_bsts",
    header: ({ column }) => {
      return (
        <div className="flex">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. BSTS
          <ArrowUpDown />
        </Button>
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize mx-4">{row.getValue("no_bsts")}</div>
    ),
  },
  {
    accessorKey: "jumlah_bronjong",
    header: () => {
      return <div className="flex justify-center">Jumlah Bronjong</div>
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("jumlah_bronjong")}</div>
    ),
  },
  {
    accessorKey: "jumlah_dolly",
    header: () => {
      return <div className="flex justify-center">Jumlah Dolly</div>
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("jumlah_dolly")}</div>
    ),
  },
  {
    accessorKey: "action",
    header: () => {
      return <div className="flex justify-center">Action</div>
    },
    cell: (data) => {
      return (
        <div className="text-center">
        <Button variant="default" onClick={() => handleClick(data.row.original)}>Download</Button>
        </div>
      )
    }
  }
];

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari Nomor BSTS..."
          value={(table.getColumn("no_bsts")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("no_bsts")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="gap-2 flex ml-auto">
          <DatePicker label="Dari Tanggal" onDateChange={onDateChange}/>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ): table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Menampilkan {table.getFilteredRowModel().rows.length} baris dari {" "}
          {table.getRowCount()} baris.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DataTableBSTSDR({
  data,
  isLoading,
  handleClick,
  onDateChange
}: {
  data: BSTSDR[],
  isLoading: boolean,
  handleClick: (data: BSTSDR) => void,
  onDateChange: (date: Date | undefined) => void
}) {

  const columns: ColumnDef<BSTSDR>[] = [
  {
    accessorKey: "no_bsts",
    header: ({ column }) => {
      return (
        <div className="flex">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. BSTS
          <ArrowUpDown />
        </Button>
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize mx-4">{row.getValue("no_bsts")}</div>
    ),
  },
  {
    accessorKey: "jumlah_bronjong_kirim",
    header: () => {
      return <div className="flex justify-center">Jumlah Bronjong Dikirim</div>
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("jumlah_bronjong_kirim")}</div>
    ),
  },
  {
    accessorKey: "jumlah_dolly_kirim",
    header: () => {
      return <div className="flex justify-center">Jumlah Dolly Dikirim</div>
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("jumlah_dolly_kirim")}</div>
    ),
  },
  {
    accessorKey: "jumlah_bronjong_kembali",
    header: () => {
      return <div className="flex justify-center">Jumlah Bronjong Kembali</div>
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("jumlah_bronjong_kembali")}</div>
    ),
  },
  {
    accessorKey: "jumlah_dolly_kembali",
    header: () => {
      return <div className="flex justify-center">Jumlah Dolly Kembali</div>
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("jumlah_dolly_kembali")}</div>
    ),
  },
  {
    accessorKey: "action",
    header: () => {
      return <div className="flex justify-end">Action</div>
    },
    cell: (data) => {
      return (
        <div className="text-center">
        <Button variant="default" onClick={() => handleClick(data.row.original)}>Download</Button>
        </div>
      )
    }
  }
];

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari Nomor BSTS..."
          value={(table.getColumn("no_bsts")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("no_bsts")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="gap-2 flex ml-auto">
          <DatePicker label="Dari Tanggal" onDateChange={onDateChange}/>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead key="no_bsts" rowSpan={2}>No. BSTS</TableHead>
              <TableHead colSpan={2} className="text-center">
                Dikirim
              </TableHead>
              <TableHead colSpan={2} className="text-center">
                Kembali
              </TableHead>
              <TableHead rowSpan={2} className="text-center">Action</TableHead>
            </TableRow>

            <TableRow>
              <TableHead className="text-center">Bronjong</TableHead>
              <TableHead className="text-center">Dolly</TableHead>
              <TableHead className="text-center">Bronjong</TableHead>
              <TableHead className="text-center">Dolly</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ): table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Menampilkan {table.getFilteredRowModel().rows.length} baris dari {" "}
          {table.getRowCount()} baris.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
