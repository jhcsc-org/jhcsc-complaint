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
import Fuse from 'fuse.js';
import { debounce } from "lodash";
import { ArrowUpDown, ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const fadeInVariants = {
    hidden: { opacity: 0, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.3, ease: "easeInOut" }
    },
    exit: {
        opacity: 0,
        filter: "blur(4px)",
        transition: { duration: 0.2, ease: "easeInOut" }
    }
};

export const BarangayCitizenList = () => {
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [searchValue, setSearchValue] = useState("");
    const [fuse, setFuse] = useState<Fuse<any> | null>(null);

    const toggleViewMode = () => {
        setViewMode((prev) => (prev === "table" ? "grid" : "table"));
    };

    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                id: "first_name",
                accessorKey: "first_name",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            First Name
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const { first_name, middle_name, last_name } = row.original;
                    const fullName = `${first_name} ${middle_name} ${last_name}`.trim();
                    return <div className="w-40">{fullName}</div>;
                }
            },
            {
                id: "email",
                accessorKey: "email",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Email
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    )
                },
                cell: function render({ getValue }) {
                    return (
                        <a href={"mailto:" + getValue<any>()} className="text-blue-600 hover:underline w-60">
                            {getValue<any>()}
                        </a>
                    );
                },
            },
            {
                id: "address",
                accessorKey: "address",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Address
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    )
                },
                cell: ({ getValue }) => <div className="w-60">{getValue<string>()}</div>,
            },
            {
                id: "created_at",
                accessorKey: "created_at",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Created At
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    )
                },
                cell: function render({ getValue }) {
                    return (
                        <div className="w-40">
                            {new Date(getValue<any>()).toLocaleString(undefined, {
                                timeZone: "UTC",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </div>
                    );
                },
            },
        ],
        [],
    );

    const { data: user } = useGetIdentity<User>();
    const userId = user?.id;

    const { data: barangayName } = useOne({
        id: userId,
        resource: "user_profile",
        meta: {
            fields: ["barangay_name"]
        }
    })

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
        getColumn,
    } = useTable({
        columns,
        refineCoreProps: {
            resource: "user_profile",
            pagination: {
                mode: "server",
            },
            filters: {
                permanent: [{
                    field: "barangay_name",
                    operator: "eq",
                    value: barangayName?.data.barangay_name as string,
                }],
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
                keys: ['first_name', 'middle_name', 'last_name', 'email', 'address'],
                threshold: 0.3,
            });
            setFuse(fuseInstance);
        }
    }, [tableData]);

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setSearchValue(value);
        }, 300),
        []
    );

    const filteredData = useMemo(() => {
        if (!searchValue || !fuse) return tableData?.data || [];
        return fuse.search(searchValue).map(result => result.item);
    }, [searchValue, fuse, tableData]);

    return (
        <div className="mx-auto">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInVariants}
            >
                <div className="flex items-center justify-between py-4">
                    <Input
                        placeholder="Search..."
                        onChange={(e) => debouncedSearch(e.target.value)}
                        className="w-1/2"
                    />
                    <Button onClick={toggleViewMode} className="ml-4">
                        {viewMode === "table" ? "Grid View" : "Table View"}
                    </Button>
                </div>
                {viewMode === "table" ? (
                    <motion.div variants={fadeInVariants}>
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
                                            <motion.div variants={fadeInVariants}>
                                                {Array.from({ length: 3 }).map((_, index) => (
                                                    <Skeleton key={`skeleton-${index}`} className="h-[125px] w-full rounded-xl my-2" />
                                                ))}
                                            </motion.div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length}>
                                            <motion.div
                                                className="flex flex-col items-center justify-center py-10"
                                                key="no-citizens"
                                                variants={fadeInVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                            >
                                                <p className="mt-4 text-lg font-medium text-muted-foreground">No citizens found</p>
                                            </motion.div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <AnimatePresence mode="wait">
                                        {filteredData.map((row) => (
                                            <TableRow key={row.id}>
                                                {columns.map((column) => (
                                                    <TableCell key={column.id}>
                                                        {flexRender(column.cell, {
                                                            getValue: () => row[column.id as keyof typeof row],
                                                            // @ts-ignore
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
                ) : (
                    <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={fadeInVariants}>
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <Skeleton key={`skeleton-${index}`} className="w-full h-40 rounded-xl" />
                            ))
                        ) : (
                            filteredData.length === 0 ? (
                                <motion.div
                                    className="flex flex-col items-center justify-center py-10"
                                    key="no-citizens"
                                    variants={fadeInVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <p className="mt-4 text-lg font-medium text-muted-foreground">No citizens found</p>
                                </motion.div>
                            ) : (
                                filteredData.map((row) => (
                                    <motion.div
                                        key={row.id}
                                        layout
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={fadeInVariants}
                                        className="p-4 border rounded-lg shadow bg-muted-foreground/5"
                                    >
                                        <div className="mb-2">
                                            <strong>Name:</strong> {`${row.first_name} ${row.middle_name} ${row.last_name}`.replace(/\b\w/g, char => char.toUpperCase())}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Email:</strong>{" "}
                                            <a href={`mailto:${row.email}`} className="text-foreground hover:underline">
                                                {row.email}
                                            </a>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Address:</strong> {row.address}
                                        </div>
                                        <div>
                                            <strong>Registered Date:</strong>{" "}
                                            {new Date(row.created_at).toLocaleString(undefined, {
                                                timeZone: "UTC",
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </motion.div>
                                ))
                            )
                        )}
                    </motion.div>
                )}
                <motion.div className="flex items-center justify-between py-4 space-x-2" variants={fadeInVariants}>
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">
                            Page {getState().pagination.pageIndex + 1} of {getPageCount()}
                        </p>
                        <Input
                            type="number"
                            defaultValue={getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                setPageIndex(page);
                            }}
                            className="w-12 h-8"
                        />
                        <Select
                            value={getState().pagination.pageSize.toString()}
                            onValueChange={(value) => setPageSize(Number(value))}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={pageSize.toString()}>
                                        {pageSize}
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
                        >
                            <ChevronFirstIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPageIndex(prev => prev - 1)}
                            disabled={!getCanPreviousPage()}
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPageIndex(prev => prev + 1)}
                            disabled={!getCanNextPage()}
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPageIndex(getPageCount() - 1)}
                            disabled={!getCanNextPage()}
                        >
                            <ChevronLastIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};
