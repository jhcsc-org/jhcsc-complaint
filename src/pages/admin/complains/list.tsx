import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TableType } from "@/types/dev.types";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    closestCorners,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useList, useUpdate } from "@refinedev/core";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ComplaintItem } from "./ComplaintItem";
import { SortableComplaint } from "./SortableComplaint";

// Define the possible complaint statuses
type ComplaintStatus = "PENDING" | "IN_PROCESS" | "RESOLVED" | "DISMISSED";

// Define the order and labels of status columns
const statusColumns: ComplaintStatus[] = [
    "PENDING",
    "IN_PROCESS",
    "RESOLVED",
    "DISMISSED",
];

// Map statuses to their corresponding colors
const statusColors: Record<ComplaintStatus, string> = {
    PENDING: "bg-yellow-600",
    IN_PROCESS: "bg-blue-600",
    RESOLVED: "bg-green-600",
    DISMISSED: "bg-gray-600",
};

// Skeleton component displayed while data is loading
const KanbanSkeleton: React.FC = () => (
    <div className="flex gap-4 p-4 overflow-x-auto flex-nowrap">
        {statusColumns.map((status) => (
            <div key={status} className="flex-shrink-0 w-full sm:w-80">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <Skeleton className="w-24 h-6" />
                            <Skeleton className="w-8 h-6" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="mb-2">
                                <CardContent className="p-4">
                                    <Skeleton className="w-full h-16" />
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>
        ))}
    </div>
);

// Main component for displaying filed complaints in a kanban board
export const FiledComplaints: React.FC = () => {
    // Fetch complaints data
    const { data, isLoading } = useList<TableType<"complaints">>({
        resource: "complaints",
        pagination: { mode: "off" }
    });

    // Mutation hook for updating a complaint
    const { mutate: updateComplaint } = useUpdate();

    // State to track the currently dragged item's ID
    const [activeId, setActiveId] = useState<string | null>(null);

    // Initialize sensors for drag-and-drop functionality
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // State to hold complaints grouped by status
    const [complaintsByStatus, setComplaintsByStatus] = useState<
        Record<ComplaintStatus, TableType<"complaints">[]>
    >(() => {
        // Initialize with empty arrays for each status
        const initialState = {} as Record<ComplaintStatus, TableType<"complaints">[]>;
        for (const status of statusColumns) {
            initialState[status] = [];
        }
        return initialState;
    });

    // Update complaintsByStatus whenever the data changes
    useEffect(() => {
        if (data?.data) {
            // Group the complaints by their status
            const grouped = statusColumns.reduce((acc, status) => {
                acc[status] = data.data.filter(
                    (complaint) => complaint.status === status
                );
                return acc;
            }, {} as Record<ComplaintStatus, TableType<"complaints">[]>);
            setComplaintsByStatus(grouped);
        }
    }, [data]);

    // Helper function to find the container (status column) of a given ID
    const findContainer = (id: string): ComplaintStatus | null => {
        if (statusColumns.includes(id as ComplaintStatus)) {
            return id as ComplaintStatus;
        }

        for (const status of statusColumns) {
            const containerItems = complaintsByStatus[status];
            if (containerItems.some((item) => item.id === id)) {
                return status;
            }
        }

        return null;
    };

    // Handler for when dragging starts
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
    };

    // Handler for when dragging ends
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(over.id as string);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setComplaintsByStatus((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.findIndex((item) => item.id === active.id);
            const overIndex = overItems.length;

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item) => item.id !== active.id),
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, overIndex),
                    activeItems[activeIndex],
                    ...prev[overContainer].slice(overIndex),
                ],
            };
        });

        // Update the complaint in the database
        updateComplaint(
            {
                resource: "complaints",
                id: active.id as string,
                values: { status: overContainer },
                mutationMode: "optimistic",
            },
            {
                onError: (error) => {
                    toast.error('Failed to update complaint.', {
                        description: error.message,
                    });
                    // Revert the state update if the database update fails
                    setComplaintsByStatus((prev) => {
                        const revertedActiveItems = [...prev[activeContainer],
                        // biome-ignore lint/style/noNonNullAssertion: <explanation>
                        prev[overContainer].find((item) => item.id === active.id)!
                        ];
                        const revertedOverItems = prev[overContainer]
                            .filter((item) => item.id !== active.id);

                        return {
                            ...prev,
                            [activeContainer]: revertedActiveItems,
                            [overContainer]: revertedOverItems,
                        };
                    });
                },
                onSuccess: (data) => {
                    toast.success(`Case ${data.data.case_number} status updated successfully.`, {
                        description: data.data.case_title,
                    });
                },
            }
        );
    };

    return (
        <div className="h-full overflow-hidden">
            {isLoading ? (
                <KanbanSkeleton />
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-4 p-4 overflow-x-auto flex-nowrap">
                        {statusColumns.map((status) => (
                            <DroppableColumn
                                key={status}
                                id={status}
                                status={status}
                                complaintsByStatus={complaintsByStatus}
                            >
                                <SortableContext
                                    items={complaintsByStatus[status]?.map((c) => c.id) || []}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {complaintsByStatus[status]?.map((complaint) => (
                                        <SortableComplaint
                                            key={complaint.id}
                                            complaint={complaint}
                                        />
                                    ))}
                                </SortableContext>
                            </DroppableColumn>
                        ))}
                    </div>
                    <DragOverlay>
                        {activeId ? (
                            <ComplaintItem
                                complaint={
                                    data?.data.find(
                                        (c) => c.id === activeId
                                    ) as TableType<"complaints">
                                }
                                statusColor={
                                    statusColors[
                                    data?.data.find((c) => c.id === activeId)
                                        ?.status as ComplaintStatus
                                    ]
                                }
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}
        </div>
    );
};

interface DroppableColumnProps {
    id: string;
    status: ComplaintStatus;
    children: React.ReactNode;
    complaintsByStatus: Record<ComplaintStatus, TableType<"complaints">[]>;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, status, children, complaintsByStatus }) => {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <div ref={setNodeRef} className="flex-shrink-0 w-full sm:w-80">
            <div className="border rounded-lg bg-background/25 border-border/20">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="text-lg">{status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")}</span>
                        <Badge variant="outline">
                            {complaintsByStatus[status]?.length || 0}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100vh-240px)] overflow-y-auto">
                    {children}
                    {React.Children.count(children) === 0 && (
                        <div className="flex items-center justify-center h-16 border-2 border-gray-300 border-dashed rounded-lg">
                            Drop here
                        </div>
                    )}
                </CardContent>
            </div>
        </div>
    );
};

export default FiledComplaints;