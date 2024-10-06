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
import {
    Table,
    TableBody
} from "@/components/ui/table";
import { TableType } from "@/types/dev.types";
import { useList, useNavigation } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, Briefcase, ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon, DollarSign, Gavel, HashIcon, Home, MoreVerticalIcon, User } from "lucide-react";
import React from "react";

const complaintTypeIcons = {
    "Civil Disputes Between Neighbors and Family Members": <User className="w-10 h-10" />,
    "Collection of Debts": <DollarSign className="w-10 h-10" />,
    "Issues Not Covered by Law or Public Order": <AlertCircle className="w-10 h-10" />,
    "Disputes Involving Property": <Home className="w-10 h-10" />,
    "Minor Criminal Offenses": <Gavel className="w-10 h-10" />,
    "Conflicts Over Personal Relationships": <User className="w-10 h-10" />,
};

export const ComplainList = () => {
    const columns = React.useMemo<ColumnDef<TableType<"complaints">>[]>(
        () => [
            {
                id: "case_number",
                accessorKey: "case_number",
                header: () => <HashIcon className="w-4 h-4" />,
            },
            {
                id: "case_title",
                accessorKey: "case_title",
                header: "Title",
            },
            {
                id: "complaint_type",
                accessorKey: "complaint_type",
                header: "Type",
            },
            {
                id: "description",
                accessorKey: "description",
                header: "Description",
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
                                    <button
                                        type="button"
                                        className="py-1.5 px-2 rounded-sm text-left text-sm hover:bg-muted-foreground/25"
                                        onClick={() => {
                                            edit("complaints", getValue() as string);
                                        }}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    );
                },
            },
        ],
        [],
    );

    const { edit, show, create } = useNavigation();

    const {
        getRowModel,
        setOptions,
        getState,
        setPageIndex,
        getCanPreviousPage,
        getPageCount,
        getCanNextPage,
        nextPage,
        previousPage,
        setPageSize,
    } = useTable({
        columns,
        filterFns: {
            case_title: (row, columnId, filterValue) => {
                return row.original.case_title.toLowerCase().includes(filterValue.toLowerCase());
            },
        },
    });
    setOptions((prev) => ({
        ...prev,
        meta: {
            ...prev.meta,
        },
    }));
    const { data: typeOfComplaint } = useList<TableType<"complaint_types">>({ resource: "complaint_types" });
    return (
        <div className="w-full">
            <div>
                <div className="flex items-center justify-between py-4 border-b">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search complaints..."
                            className="min-w-full"
                        />
                        <Select defaultValue="name">
                            <SelectTrigger className="min-w-[180px] ml-2">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Sort by name</SelectItem>
                                <SelectItem value="date">Sort by date</SelectItem>
                                <SelectItem value="status">Sort by status</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button variant="custom" onClick={() => create("complaints")}>Create complaint</Button>
                </div>
                <div>
                    <Table>
                        <TableBody>
                            {getRowModel().rows.map((row) => {
                                const complaintType = typeOfComplaint?.data.find(type => type.complaint_type_id === row.original.complaint_type_id)?.description;
                                return (
                                    <div className="flex flex-row items-center justify-between gap-6 p-6 border-b border-x-none" key={row.id}>
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
                                            <Badge variant="default" className="text-xs font-medium bg-muted-foreground/25">
                                                {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1).toLowerCase()}
                                            </Badge>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVerticalIcon className="w-4 h-4" />
                                                    </Button>
                                                </PopoverTrigger>
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
                                            </Popover>
                                        </div>
                                    </div>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-between py-4 space-x-2">
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
                </div>
            </div>
        </div>
    );
};