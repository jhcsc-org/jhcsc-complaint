import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
    TableBody
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TableType } from "@/types/dev.types";
import { BaseKey, HistoryType, IResourceItem, MetaDataQuery, useGetIdentity, useList, useNavigation } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { User } from "@supabase/supabase-js";
import { ColumnDef } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import Fuse from 'fuse.js';
import { debounce } from 'lodash';
import { AlertCircle, Briefcase, ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon, DollarSign, Gavel, HashIcon, Home, MoreVerticalIcon, UserIcon } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useVirtual } from "react-virtual";
import { UserProfileDashboard } from "../profile.tsx";

const complaintTypeIcons = {
    "Civil Disputes Between Neighbors and Family Members": <UserIcon className="w-10 h-10" />,
    "Collection of Debts": <DollarSign className="w-10 h-10" />,
    "Issues Not Covered by Law or Public Order": <AlertCircle className="w-10 h-10" />,
    "Disputes Involving Property": <Home className="w-10 h-10" />,
    "Minor Criminal Offenses": <Gavel className="w-10 h-10" />,
    "Conflicts Over Personal Relationships": <UserIcon className="w-10 h-10" />,
};

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

const tableVariants = {
    hidden: { opacity: 0, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            duration: 1,
            ease: "easeInOut",
            staggerChildren: 0.1
        }
    }
};

const rowVariants = {
    hidden: { opacity: 0, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.3, ease: "easeInOut" }
    }
};

const swapAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { type: "tween", stiffness: 300, damping: 30 }
};

interface ComplaintRowProps {
    // biome-ignore lint/suspicious/noExplicitAny: this is fine
    row: any;
    complaintType: string;
    show: (resource: string | IResourceItem, id: BaseKey, type?: HistoryType | undefined, meta?: MetaDataQuery | undefined) => void;
    edit: (resource: string | IResourceItem, id: BaseKey, type?: HistoryType | undefined, meta?: MetaDataQuery | undefined) => void;
}

const ComplaintRow: React.FC<ComplaintRowProps> = React.memo(({ row, complaintType, show, edit }) => {
    return (
        <motion.div
            className="flex flex-row items-center justify-between gap-6 p-6 border-b border-x-none"
            layout
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="flex flex-row items-center justify-start gap-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-muted-foreground/5">
                    {complaintTypeIcons[complaintType as keyof typeof complaintTypeIcons] || <Briefcase className="w-10 h-10" />}
                </div>
                <div className="flex flex-col items-start justify-between space-y-2">
                    <h1 className="text-sm font-medium">{row.original.case_title}</h1>
                    <p className="text-xs font-medium">{complaintType}</p>
                    <p className="text-xs ">{row.original.description}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Badge
                    variant="default"
                    className={cn(
                        "text-xs font-medium",
                        {
                            "bg-yellow-800 hover:bg-yellow-700": row.original.status === "PENDING",
                            "bg-blue-800 hover:bg-blue-700": row.original.status === "IN_PROCESS",
                            "bg-green-800 hover:bg-green-700": row.original.status === "RESOLVED",
                            "bg-muted-foreground/25 text-muted-foreground": row.original.status === "DISMISSED",
                        }
                    )}
                >
                    {row.original.status.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                </Badge>
                <Badge variant="outline">
                    {new Date(row.original.date_filed).toLocaleString("en-US", {
                        timeZone: "UTC",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </Badge>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreVerticalIcon className="w-4 h-4" />
                        </Button>
                    </PopoverTrigger>
                    <AnimatePresence>
                        <motion.div
                            variants={fadeInVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <PopoverContent className="w-20 p-1.5">
                                <div className="flex flex-col">
                                    <button
                                        type="button"
                                        className="py-1.5 px-2 rounded-sm text-left text-sm hover:bg-muted-foreground/25"
                                        onClick={() => {
                                            show("complaints", row.original.id);
                                        }}
                                    >
                                        View
                                    </button>
                                    <button
                                        type="button"
                                        className="py-1.5 px-2 rounded-sm text-left text-sm hover:bg-muted-foreground/25"
                                        onClick={() => {
                                            edit("complaints", row.original.id);
                                        }}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </PopoverContent>
                        </motion.div>
                    </AnimatePresence>
                </Popover>
            </div>
        </motion.div>
    );
});

export const ComplainList = () => {
    const columns = useMemo<ColumnDef<TableType<"complaints">>[]>(
        () => [
            {
                id: "case_number",
                accessorKey: "case_number",
                header: () => <HashIcon className="w-4 h-4" />,
                enableColumnFilter: true,
            },
            {
                id: "case_title",
                accessorKey: "case_title",
                header: "Title",
                meta: {
                    filterOperator: "contains",
                },
            },
            {
                id: "complaint_type",
                accessorKey: "complaint_type",
                header: "Type",
                meta: {
                    filterOperator: "contains",
                },
            },
            {
                id: "description",
                accessorKey: "description",
                header: "Description",
                meta: {
                    filterOperator: "contains",
                },
            },
            {
                id: "status",
                accessorKey: "status",
                header: "Status",
                cell: function render({ getValue }) {
                    return <Badge variant="outline">{getValue<string>().charAt(0).toUpperCase() + getValue<string>().slice(1).toLowerCase()}</Badge>
                },
            },
            {
                id: "date_filed",
                accessorKey: "date_filed",
                header: "Date Filed",
                cell: function render({ getValue }) {
                    return <Badge variant="outline">{new Date(getValue<string>()).toLocaleString(undefined, {
                        timeZone: "UTC",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}</Badge>
                },
            },
            {
                id: "actions",
                accessorKey: "id",
                header: "Actions",
                cell: function render({ getValue }) {
                    return (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreVerticalIcon className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    variants={fadeInVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <PopoverContent className="w-20 p-1.5">
                                        <div className="flex flex-col">
                                            <button
                                                type="button"
                                                className="py-1.5 px-2 rounded-sm text-left text-sm hover:bg-muted-foreground/25"
                                                onClick={() => {
                                                    show("complaints", getValue() as string);
                                                }}
                                            >
                                                View
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </motion.div>
                            </AnimatePresence>
                        </Popover>
                    );
                },
            },
        ],
        [],
    );

    const { edit, show, create } = useNavigation();
    const { data: userData } = useGetIdentity<User>();
    const userId = userData?.id;

    const {
        getRowModel,
        setOptions,
        getState,
        refineCore: {
            filters,
            sorters,
            setSorters,
            tableQuery: { isLoading },
        },
        setPageIndex,
        getCanPreviousPage,
        getPageCount,
        getCanNextPage,
        nextPage,
        previousPage,
        setPageSize,
        setColumnFilters,
    } = useTable({
        columns,
        filterFns: {
            case_title: (row, filterValue) => {
                const fuse = new Fuse([row.original], {
                    keys: ['case_title'],
                    threshold: 0.5,
                });
                return fuse.search(filterValue).length > 0;
            },
            user_filter: (row) => {
                return row.original.user_id === userId;
            },
        },
        refineCoreProps: {
            pagination: {
                pageSize: 5,
            },
            filters: {
                permanent: [
                    {
                        field: "filed_by",
                        value: userId,
                        operator: "eq"
                    }
                ]
            },
            sorters: {
                initial: [
                    {
                        field: "date_filed",
                        order: "desc"
                    }
                ]
            },
            queryOptions: {
                enabled: !!userId
            },
            syncWithLocation: false,
        }
    });

    const [searchValue, setSearchValue] = useState("");
    const [sortField, setSortField] = useState("date_filed");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setColumnFilters([{ id: 'case_title', value }]);
        }, 300),
        []
    );

    useEffect(() => {
        debouncedSearch(searchValue);
    }, [searchValue, debouncedSearch]);

    const { data: typeOfComplaint } = useList<TableType<"complaint_types">>({ resource: "complaint_types" });

    const parentRef = React.useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtual({
        size: getRowModel().rows.length,
        parentRef,
        estimateSize: useCallback(() => 125, []),
        overscan: 5,
    });

    // biome-ignore lint/correctness/useExhaustiveDependencies: this is necessary
    const memoizedRowContent = useMemo(() => {
        return getRowModel().rows.map((row) => {
            const complaintType = typeOfComplaint?.data.find(type => type.complaint_type_id === row.original.complaint_type_id)?.description;
            return (
                <ComplaintRow
                    key={row.id}
                    row={row}
                    complaintType={complaintType || ""}
                    show={show}
                    edit={edit}
                />
            );
        });
    }, [getRowModel().rows, typeOfComplaint?.data, show, edit]);

    const handleSortChange = (value: string) => {
        const [field, order] = value.split('-');
        setSortField(field);
        setSortOrder(order as "asc" | "desc");
        setSorters([{ field, order: order as "asc" | "desc" }]);
    };

    return (
        <div className="max-w-4xl p-4 mx-auto">
            <UserProfileDashboard/>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInVariants}
            >
                <div className="flex items-center justify-between py-4 border-b">
                    <div className="grid w-full grid-cols-12 gap-4">
                        <Input
                            placeholder="Search case title..."
                            className="col-span-8"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <Select
                            value={`${sortField}-${sortOrder}`}
                            onValueChange={handleSortChange}
                        >
                            <SelectTrigger className="col-span-4">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="case_title-asc">Sort by name (A-Z)</SelectItem>
                                <SelectItem value="case_title-desc">Sort by name (Z-A)</SelectItem>
                                <SelectItem value="date_filed-asc">Sort by date (Oldest first)</SelectItem>
                                <SelectItem value="date_filed-desc">Sort by date (Newest first)</SelectItem>
                                <SelectItem value="status-asc">Sort by status (A-Z)</SelectItem>
                                <SelectItem value="status-desc">Sort by status (Z-A)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <motion.div
                    style={{ overflowY: 'hidden' }}
                    variants={tableVariants}
                >
                    <Table className="overflow-y-hidden">
                        <TableBody className="overflow-y-hidden">
                            {isLoading ? (
                                <motion.div variants={fadeInVariants}>
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <motion.div
                                            className="flex flex-col mt-2 space-y-3"
                                            // biome-ignore lint/suspicious/noArrayIndexKey: not really that bad
                                            key={`skeleton-${index}`}
                                            variants={rowVariants}
                                        >
                                            <Skeleton className="h-[125px] w-full rounded-xl" />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    {getRowModel().rows.length === 0 ? (
                                        <motion.div
                                            className="flex flex-col items-center justify-center py-10"
                                            key="no-complaints"
                                            variants={fadeInVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            <AlertCircle className="w-16 h-16 text-muted-foreground" />
                                            <p className="mt-4 text-lg font-medium text-muted-foreground">No complaints found</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div>
                                            <AnimatePresence initial={false}>
                                                {memoizedRowContent.map((row) => (
                                                    <motion.div
                                                        key={row.key}
                                                        layout
                                                        initial="initial"
                                                        animate="animate"
                                                        exit="exit"
                                                        variants={swapAnimation}
                                                    >
                                                        {row}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </TableBody>
                    </Table>
                </motion.div>
                <motion.div
                    className="flex items-center justify-between py-4 space-x-2"
                    variants={fadeInVariants}
                >
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">
                            Page {getState().pagination.pageIndex + 1} of {getPageCount()}
                        </p>
                        <div className="flex items-center space-x-1">
                            <p className="text-sm font-medium">Go to page</p>
                            <Input
                                type="number"
                                defaultValue={getState().pagination.pageIndex + 1}
                                onChange={(e) => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    setPageIndex(page);
                                }}
                                className="w-12 h-8"
                            />
                        </div>
                        <Select
                            value={getState().pagination.pageSize.toString()}
                            onValueChange={(value) => setPageSize(Number(value))}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
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
                            onClick={() => previousPage()}
                            disabled={!getCanPreviousPage()}
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => nextPage()}
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