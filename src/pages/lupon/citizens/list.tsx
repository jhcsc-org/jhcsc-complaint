import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useGetIdentity, useOne } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { User } from "@supabase/supabase-js";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import Fuse from "fuse.js";
import { debounce } from "lodash";
import {
    ArrowUpDown,
    ChevronFirstIcon,
    ChevronLastIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const fadeInVariants = {
    hidden: { opacity: 0, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
        opacity: 0,
        filter: "blur(4px)",
        transition: { duration: 0.2, ease: "easeInOut" },
    },
};

export const BarangayCitizenList: React.FC = () => {
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [searchValue, setSearchValue] = useState("");
    const [fuse, setFuse] = useState<Fuse<any> | null>(null);

    const toggleViewMode = useCallback(() => {
        setViewMode((prev) => (prev === "table" ? "grid" : "table"));
    }, []);

    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                id: "full_name",
                accessorFn: (row) =>
                    `${row.first_name} ${row.middle_name} ${row.last_name}`.trim(),
                header: ({ column }) => (
                    <div className="w-full">
                        <SortableHeader column={column} label="Full Name" />
                    </div>
                ),
                cell: ({ row }) => {
                    const fullName = `${row.original.first_name} ${row.original.middle_name || ''} ${row.original.last_name}`.trim();
                    return <div className="w-full">{fullName}</div>;
                },
            },
            {
                id: "email",
                accessorKey: "email",
                header: ({ column }) => (
                    <SortableHeader column={column} label="Email" />
                ),
                cell: ({ getValue }) => {
                    const email = getValue() as string;
                    return (
                        <a
                            href={`mailto:${email}`}
                            className="text-blue-600 truncate hover:underline w-60"
                        >
                            {email}
                        </a>
                    );
                },
            },
            {
                id: "address",
                accessorKey: "address",
                header: ({ column }) => (
                    <SortableHeader column={column} label="Address" />
                ),
                cell: ({ getValue }) => {
                    const address = getValue() as string;
                    return <div className="truncate w-60">{address}</div>;
                },
            },
            {
                id: "created_at",
                accessorKey: "created_at",
                header: ({ column }) => (
                    <SortableHeader column={column} label="Registered Date" />
                ),
                cell: ({ getValue }) => {
                    const date = getValue() as string | number | Date;
                    return (
                        <div className="w-40">
                            {new Date(date).toLocaleDateString(undefined, {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </div>
                    );
                },
            },
        ],
        []
    );

    const { data: user } = useGetIdentity<User>();
    const userId = user?.id;

    const { data: barangayName } = useOne({
        id: userId,
        resource: "user_profile",
        meta: {
            fields: ["barangay_name"],
        },
    });

    const {
        getHeaderGroups,
        getRowModel,
        setOptions,
        getState,
        refineCore: {
            tableQueryResult: { data: tableData, isLoading },
        },
        getCanPreviousPage,
        getPageCount,
        getCanNextPage,
        setPageIndex,
        setPageSize,
    } = useTable({
        columns,
        refineCoreProps: {
            resource: "user_profile",
            pagination: {
                mode: "server",
            },
            filters: {
                permanent: [
                    {
                        field: "barangay_name",
                        operator: "eq",
                        value: barangayName?.data.barangay_name as string,
                    },
                ],
            },
            sorters: {
                mode: "server",
                initial: [{ field: "created_at", order: "desc" }],
            },
        },
    });

    useEffect(() => {
        if (tableData?.data) {
            const fuseInstance = new Fuse(tableData.data, {
                keys: ["first_name", "middle_name", "last_name", "email", "address"],
                threshold: 0.3,
            });
            setFuse(fuseInstance);
        }
    }, [tableData]);

    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                setSearchValue(value);
            }, 300),
        []
    );

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            debouncedSearch(e.target.value);
        },
        [debouncedSearch]
    );

    const filteredData = useMemo(() => {
        if (!searchValue || !fuse) return tableData?.data || [];
        return fuse.search(searchValue).map((result) => result.item);
    }, [searchValue, fuse, tableData]);

    const renderTable = () => (
        <motion.div variants={fadeInVariants} initial="hidden" animate="visible" exit="exit">
            <Table>
                <TableHeader>
                    {getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length}>
                                <div className="space-y-2">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <Skeleton
                                            key={`skeleton-${index}`}
                                            className="w-full h-12 rounded"
                                        />
                                    ))}
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : filteredData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length}>
                                <div className="flex items-center justify-center py-10">
                                    <p className="text-lg text-muted-foreground">
                                        No citizens found
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        <AnimatePresence>
                            {filteredData.map((row) => (
                                <TableRow key={row.id}>
                                    {columns.map((column) => (
                                        <TableCell key={column.id}>
                                            {flexRender(column.cell, {
                                                getValue: () =>
                                                    row[column.id as keyof typeof row],
                                                row: { original: row },
                                            })}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </AnimatePresence>
                    )}
                </TableBody>
            </Table>
        </motion.div>
    );

    const renderGrid = () => (
        <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                      <Skeleton
                          key={`skeleton-${index}`}
                          className="w-full h-40 rounded-xl"
                      />
                  ))
                : filteredData.length === 0
                ? (
                      <div className="flex items-center justify-center py-10 col-span-full">
                          <p className="text-lg text-muted-foreground">
                              No citizens found
                          </p>
                      </div>
                  )
                : filteredData.map((row) => (
                      <motion.div
                          key={row.id}
                          layout
                          variants={fadeInVariants}
                          className="p-4 border rounded-lg shadow bg-muted-foreground/5"
                      >
                          <div className="mb-2">
                              <strong>Name:</strong>{" "}
                              {`${row.first_name} ${row.middle_name} ${row.last_name}`
                                  .replace(/\b\w/g, (char) => char.toUpperCase())
                                  .trim()}
                          </div>
                          <div className="mb-2">
                              <strong>Email:</strong>{" "}
                              <a
                                  href={`mailto:${row.email}`}
                                  className="text-foreground hover:underline"
                              >
                                  {row.email}
                              </a>
                          </div>
                          <div className="mb-2">
                              <strong>Address:</strong> {row.address}
                          </div>
                          <div>
                              <strong>Registered Date:</strong>{" "}
                              {new Date(row.created_at).toLocaleDateString(undefined, {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                              })}
                          </div>
                      </motion.div>
                  ))}
        </motion.div>
    );

    return (
        <div className="p-4 mx-auto">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInVariants}
                className="space-y-6"
            >
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <Input
                        placeholder="Search..."
                        onChange={handleSearchChange}
                        className="w-full sm:w-1/2"
                        aria-label="Search citizens"
                    />
                    <Button onClick={toggleViewMode} className="w-full sm:w-auto">
                        {viewMode === "table" ? "Grid View" : "Table View"}
                    </Button>
                </div>
                {viewMode === "table" ? renderTable() : renderGrid()}
                <motion.div
                    className="flex flex-col items-center justify-between gap-4 sm:flex-row"
                    variants={fadeInVariants}
                >
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">
                            Page {getState().pagination.pageIndex + 1} of{" "}
                            {getPageCount()}
                        </p>
                        <Input
                            type="number"
                            min={1}
                            max={getPageCount()}
                            defaultValue={getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value
                                    ? Math.min(
                                          Math.max(Number(e.target.value) - 1, 0),
                                          getPageCount() - 1
                                      )
                                    : 0;
                                setPageIndex(page);
                            }}
                            className="w-16 h-8"
                            aria-label="Page number"
                        />
                        <Select
                            value={getState().pagination.pageSize.toString()}
                            onValueChange={(value) => setPageSize(Number(value))}
                            aria-label="Select page size"
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={getState().pagination.pageSize.toString()} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPageIndex(0)}
                            disabled={!getCanPreviousPage()}
                            aria-label="First Page"
                        >
                            <ChevronFirstIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPageIndex((prev) => prev - 1)}
                            disabled={!getCanPreviousPage()}
                            aria-label="Previous Page"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPageIndex((prev) => prev + 1)}
                            disabled={!getCanNextPage()}
                            aria-label="Next Page"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPageIndex(getPageCount() - 1)}
                            disabled={!getCanNextPage()}
                            aria-label="Last Page"
                        >
                            <ChevronLastIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

interface SortableHeaderProps {
    column: any;
    label: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = React.memo(({ column, label }) => {
    const isSorted = column.getIsSorted();
    const toggleSorting = () => {
        column.toggleSorting(isSorted === "asc" ? "desc" : "asc");
    };

    return (
        <Button
            variant="ghost"
            onClick={toggleSorting}
            className="flex items-center justify-between w-full text-left"
            aria-label={`Sort by ${label}`}
        >
            {label}
            <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
    );
});

export default BarangayCitizenList;
