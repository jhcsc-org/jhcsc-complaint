import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useNavigation } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

export const CitizenProfileList = () => {
    const columns = React.useMemo<ColumnDef<any>[]>(
        () => [
            {
                id: "full_name",
                accessorKey: "full_name",
                header: "Full Name",
            },
            {
                id: "purok",
                accessorKey: "purok",
                header: "Purok",
            },
            {
                id: "street",
                accessorKey: "street",
                header: "Street",
            },
            {
                id: "block_number",
                accessorKey: "block_number",
                header: "Block Number",
            },
            {
                id: "house_number",
                accessorKey: "house_number",
                header: "House Number",
            },
            {
                id: "created_at",
                accessorKey: "created_at",
                header: "Created At",
                cell: function render({ getValue }) {
                    return new Date(getValue<any>()).toLocaleString(undefined, {
                        timeZone: "UTC",
                    });
                },
            },
            {
                id: "updated_at",
                accessorKey: "updated_at",
                header: "Updated At",
                cell: function render({ getValue }) {
                    return new Date(getValue<any>()).toLocaleString(undefined, {
                        timeZone: "UTC",
                    });
                },
            },
            {
                id: "actions",
                accessorKey: "id",
                header: "Actions",
                cell: function render({ getValue }) {
                    return (
                        <div className="flex justify-center flex-row flex-wrap gap-2">
                            <Button
                                onClick={() => {
                                    show("citizen_profiles", getValue() as string);
                                }}
                            >
                                Show
                            </Button>
                            <Button
                                onClick={() => {
                                    edit("citizen_profiles", getValue() as string);
                                }}
                            >
                                Edit
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [],
    );

    const { edit, show, create } = useNavigation();

    const {
        refineCore: {
            tableQueryResult: { data: tableData },
        },
        getCanPreviousPage,
        getCanNextPage,
        nextPage,
        previousPage,
        setPageIndex,
        getPageCount,
        getState,
        setPageSize,
    } = useTable({
        columns,
    });

    return (
        <div className="">
            <h1 className="flex justify-center items-center">Citizen Profiles</h1>
            <div style={{ maxWidth: "100%", overflowY: "scroll", display: "flex", justifyContent: "center" }}>
                <DataTable columns={columns} data={tableData?.data || []} />
            </div>
            <div className="mt-3 flex flex-col justify-center items-center gap-2">
                <div className="flex justify-evenly gap-2">
                    <Button
                        onClick={() => setPageIndex(0)}
                        disabled={!getCanPreviousPage()}
                    >
                        {"<<"}
                    </Button>
                    <Button onClick={() => previousPage()} disabled={!getCanPreviousPage()}>
                        {"<"}
                    </Button>
                    <Button onClick={() => nextPage()} disabled={!getCanNextPage()}>
                        {">"}
                    </Button>
                    <Button
                        onClick={() => setPageIndex(getPageCount() - 1)}
                        disabled={!getCanNextPage()}
                    >
                        {">>"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
