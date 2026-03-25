"use client";

import { Input } from "@/components/ui/input";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import DataTableRowActions from "./DataTableRowActions";
import { useTranslation } from "react-i18next";

interface DataTableProps {
    columns: any[];
    data: any[];
    pagination: {
        current_page: number;
        total_pages: number;
        has_prev: boolean;
        has_next: boolean;
    };
    onPageChange: (page: number) => void;
    onSearch: (value: string) => void;
    onRoleFilter: (value: string) => void;
    onDetails: (data: any) => void;
}

export function DataTable({
    columns,
    data,
    pagination,
    onPageChange,
    onSearch,
    onDetails
}: DataTableProps) {
    const { t } = useTranslation();
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="w-full">
            {/* Search and Filters */}
            <div className="py-3 flex flex-col sm:flex-row gap-3">
                <Input
                    placeholder={t('users.table.searchPlaceholder')}
                    onChange={(e) => onSearch(e.target.value)}
                    className="max-w-sm"
                />
                {/* <Select onValueChange={onRoleFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('users.table.roleFilter')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">{t('users.roles.admin')}</SelectItem>
                        <SelectItem value="1">{t('users.roles.staff')}</SelectItem>
                    </SelectContent>
                </Select> */}
            </div>

            {/* Table for medium+ screens */}
            <div className="hidden md:block">
                <table className="w-full border rounded">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b">
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="p-2 text-center align-middle">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}
                                className="border-b hover:bg-primary/10 transition-colors duration-200 cursor-pointer"
                                onDoubleClick={() => onDetails(row.original)}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="p-2 align-middle">
                                        {/* {flexRender(cell.column.columnDef.cell, cell.getContext())} */}
                                        <div className="flex justify-center items-center">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cards for small screens */}
            <div className="block md:hidden space-y-3">
                {data.map((row: any) => (
                    <div key={row.id} className="rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-200">
                        {/* Data fields - compact layout */}
                        <div className="space-y-3">
                            {columns
                                .filter(col => col.id !== "actions")
                                .map((col: any) => {
                                    const value = row[col.accessorKey];
                                    if (!value) return null;
                                    return (
                                        <div key={col.id || col.accessorKey} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                            <span className="text-sm font-medium">
                                                {typeof col.header === "string"
                                                    ? col.header
                                                    : typeof col.header === "function"
                                                        ? col.header()
                                                        : col.header}
                                            </span>
                                            <span className="text-sm  text-right max-w-[60%] truncate">
                                                {value}
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                            <DataTableRowActions
                                data={row}
                                onDelete={() => {/* pass from parent */ }}
                                onDetails={() => {/* pass from parent */ }}
                                onEdit={() => {/* pass from parent */ }}
                                onEditPer={() => {/* pass from parent */ }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* No data message */}
            {data.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    {t('users.table.noData')}
                </div>
            )}

            {/* Pagination */}
            {pagination.total_pages > 1 && (
                <div className="flex justify-center py-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => pagination.has_prev && onPageChange(pagination.current_page - 1)}
                                    className={!pagination.has_prev ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationLink isActive>
                                    {pagination.current_page} / {pagination.total_pages}
                                </PaginationLink>
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => pagination.has_next && onPageChange(pagination.current_page + 1)}
                                    className={!pagination.has_next ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}