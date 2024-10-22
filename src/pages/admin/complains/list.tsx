import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
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
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { CrudFilter, useList, useUpdate } from "@refinedev/core";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDownIcon, CalendarIcon, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
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
    <motion.div
        className="flex gap-4 p-4 overflow-x-auto flex-nowrap"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(10px)" }}
        transition={{ duration: 0.5 }}
    >
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
    </motion.div>
);

type SortOrder = "asc" | "desc" | "none";

// Add new type for date selection
type DateRange = {
    from: Date | undefined;
    to?: Date | undefined;
};

// Main component for displaying filed complaints in a kanban board
export const FiledComplaints: React.FC = () => {
    // Fetch barangays data
    const { data: barangaysData } = useList<TableType<"barangays">>({
        resource: "barangays",
    });
    const barangaysList = barangaysData?.data || [];

    // State for selected barangay and date
    const [barangayId, setBarangayId] = useState<string>("all");
    const [date, setDate] = useState<DateRange | undefined>();

    // Fetch complaints data with filters
    const filters: CrudFilter[] = [];

    if (barangayId && barangayId !== "all") {
        filters.push({
            field: "barangay_id",
            operator: "eq",
            value: barangayId,
        });
    }

    if (date?.from) {
        const fromDate = format(date.from, "yyyy-MM-dd");
        filters.push({
            field: "date_filed",
            operator: "gte",
            value: `${fromDate}T00:00:00.000Z`,
        });

        if (date.to) {
            const toDate = format(date.to, "yyyy-MM-dd");
            filters.push({
                field: "date_filed",
                operator: "lte",
                value: `${toDate}T23:59:59.999Z`,
            });
        }
    }

    const { data, isLoading } = useList<TableType<"complaints">>({
        resource: "complaints",
        filters: filters,
        pagination: { mode: "off" },
        liveMode: "auto",
    });

    // Mutation hook for updating a complaint
    const { mutate: updateComplaint } = useUpdate();

    // State to track the currently dragged item's ID
    const [activeId, setActiveId] = useState<string | null>(null);
    // State to track the open state of the alert dialog
    const [open, setOpen] = useState(false);

    // Initialize sensors for drag-and-drop functionality
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // State to hold complaints grouped by status
    const complaintsByStatus = useMemo(() => {
        if (!data?.data) {
            return statusColumns.reduce((acc, status) => {
                acc[status] = [];
                return acc;
            }, {} as Record<ComplaintStatus, TableType<"complaints">[]>);
        }

        return statusColumns.reduce((acc, status) => {
            acc[status] = data.data.filter(
                (complaint) => complaint.status === status
            );
            return acc;
        }, {} as Record<ComplaintStatus, TableType<"complaints">[]>);
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

    // New state for storing the drag event details
    const [dragEventDetails, setDragEventDetails] = useState<DragEndEvent | null>(null);

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

        // Only open the dialog if transferring to DISMISSED status
        if (overContainer === "DISMISSED") {
            setDragEventDetails(event);
            setTimeout(() => {
                setOpen(true);
            }, 250);
        } else {
            // If not transferring to DISMISSED, update immediately
            handleStatusUpdate(active.id as string, overContainer);
        }
    };

    // Function to handle the status update
    const handleStatusUpdate = (id: string, toStatus: ComplaintStatus) => {
        // Update the complaint in the database
        updateComplaint(
            {
                resource: "complaints",
                id: id,
                values: { status: toStatus },
                mutationMode: "optimistic",
            },
            {
                onError: (error) => {
                    toast.error("Failed to update complaint.", {
                        description: error.message,
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

    // Function to handle the confirmation and update the complaint
    const handleConfirmUpdate = () => {
        if (!dragEventDetails) return;

        const { active, over } = dragEventDetails || {};
        if (!active || !over) return;

        const overContainer = findContainer(over.id as string);
        if (!overContainer) return;

        handleStatusUpdate(active.id as string, overContainer);

        // Reset the dragEventDetails and close the dialog
        setDragEventDetails(null);
        setOpen(false);
    };

    const [sortOrders, setSortOrders] = useState<Record<ComplaintStatus, SortOrder>>(() => {
        const initialSortOrders = {} as Record<ComplaintStatus, SortOrder>;
        for (const status of statusColumns) {
            initialSortOrders[status] = "none";
        }
        return initialSortOrders;
    });

    const handleSortChange = (status: ComplaintStatus) => {
        setSortOrders((prev) => {
            const currentOrder = prev[status];
            const newOrder: SortOrder = currentOrder === "none" ? "asc" : currentOrder === "asc" ? "desc" : "none";
            return { ...prev, [status]: newOrder };
        });
    };

    const getSortedComplaints = (status: ComplaintStatus) => {
        const complaints = complaintsByStatus[status] || [];
        const sortOrder = sortOrders[status];

        if (sortOrder === "none") return complaints;

        return [...complaints].sort((a, b) => {
            if (sortOrder === "asc") {
                return (a.case_number ?? "").localeCompare(b.case_number ?? "");
            }
            return (b.case_number ?? "").localeCompare(a.case_number ?? "");
        });
    };

    // Helper function to format date range display
    const formatDateRange = (range: DateRange | undefined) => {
        if (!range?.from) return "Pick a date";
        if (!range.to) return format(range.from, "PPP");
        return `${format(range.from, "PPP")} - ${format(range.to, "PPP")}`;
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                {/* Barangay Filter */}
                <div className="w-full sm:w-1/3">
                    <Select
                        value={barangayId}
                        onValueChange={(value) => setBarangayId(value)}
                    >
                        <SelectTrigger id="barangay-id-input" className="w-full">
                            <SelectValue placeholder="Select Barangay" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem key="all" value="all">
                                All Barangays
                            </SelectItem>
                            {barangaysList.map((barangay) => (
                                <SelectItem key={barangay.id} value={barangay.id}>
                                    {barangay.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Updated Date Filter */}
                <div className="w-full sm:w-1/3">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date?.from && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                {date?.from ? (
                                    <span className="flex items-center gap-2">
                                        {formatDateRange(date)}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-4 h-4 ml-auto"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDate(undefined);
                                            }}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </span>
                                ) : (
                                    "Pick a date"
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                            <div className="p-3 border-t border-border">
                                <Button
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => setDate(undefined)}
                                >
                                    Clear Date
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="select-none">
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Dismissal</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to dismiss this complaint?
                                This action can be undone later if needed.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmUpdate}>
                                Confirm
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <KanbanSkeleton key="skeleton" />
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 0.5 }}
                        >
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCorners}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                                    {statusColumns.map((status) => (
                                        <DroppableColumn
                                            key={status}
                                            id={status}
                                            status={status}
                                            complaintsByStatus={complaintsByStatus}
                                            sortOrder={sortOrders[status]}
                                            onSortChange={() => handleSortChange(status)}
                                        >
                                            <SortableContext
                                                items={getSortedComplaints(status).map((c) => c.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <AnimatePresence>
                                                    {getSortedComplaints(status).map((complaint) => (
                                                        <SortableComplaint
                                                            key={complaint.id}
                                                            complaint={complaint}
                                                        />
                                                    ))}
                                                </AnimatePresence>
                                            </SortableContext>
                                        </DroppableColumn>
                                    ))}
                                </div>

                                {createPortal(
                                    <DragOverlay adjustScale={false} dropAnimation={null}>
                                        {activeId ? (
                                            <motion.div
                                                initial={{ scale: 1, filter: "blur(0px)" }}
                                                animate={{ scale: 1.05, filter: "blur(0px)" }}
                                                transition={{ duration: 0.2 }}
                                                style={{
                                                    transformOrigin: "0 0",
                                                    touchAction: "none",
                                                }}
                                            >
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
                                            </motion.div>
                                        ) : null}
                                    </DragOverlay>,
                                    document.body
                                )}
                            </DndContext>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

interface DroppableColumnProps {
    id: string;
    status: ComplaintStatus;
    children: React.ReactNode;
    complaintsByStatus: Record<ComplaintStatus, TableType<"complaints">[]>;
    sortOrder: SortOrder;
    onSortChange: () => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
    id,
    status,
    children,
    complaintsByStatus,
    sortOrder,
    onSortChange,
}) => {
    const { setNodeRef } = useDroppable({ id });

    const getSortIcon = () => {
        switch (sortOrder) {
            case "asc":
                return (
                    <ArrowUpIcon className="w-4 h-4 transition-all duration-300 text-muted-foreground hover:text-foreground" />
                );
            case "desc":
                return (
                    <ArrowDownIcon className="w-4 h-4 transition-all duration-300 text-muted-foreground hover:text-foreground" />
                );
            default:
                return (
                    <ArrowUpDownIcon className="w-4 h-4 transition-all duration-300 text-muted-foreground hover:text-foreground" />
                );
        }
    };

    return (
        <div ref={setNodeRef} className="w-full">
            <div className="flex flex-col h-full border rounded-lg bg-card">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">
                                {status
                                    .split("_")
                                    .map(
                                        (word) =>
                                            word.charAt(0).toUpperCase() +
                                            word.slice(1).toLowerCase()
                                    )
                                    .join(" ")}
                            </span>
                            <AnimatePresence mode="wait">
                                <motion.button
                                    key={sortOrder}
                                    initial={{ opacity: 0, y: 1 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -1 }}
                                    transition={{
                                        type: "tween",
                                        stiffness: 300,
                                        damping: 20,
                                    }}
                                    type="button"
                                    className="flex items-center justify-center w-8 h-6 rounded-lg outline-none hover:bg-muted-foreground/15 hover:border hover:border-border/25 focus:outline-none"
                                    onClick={onSortChange}
                                >
                                    {getSortIcon()}
                                </motion.button>
                            </AnimatePresence>
                        </div>
                        <Badge
                            variant="outline"
                            className="flex items-center justify-center w-8 h-6"
                        >
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={complaintsByStatus[status]?.length || 0}
                                    initial={{
                                        opacity: 0,
                                        y: 2.5,
                                        filter: "blur(1px)",
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        filter: "blur(0px)",
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -2.5,
                                        filter: "blur(1px)",
                                    }}
                                    transition={{
                                        type: "tween",
                                        stiffness: 100,
                                        damping: 30,
                                        mass: 1,
                                    }}
                                    className="absolute"
                                >
                                    {complaintsByStatus[status]?.length || 0}
                                </motion.span>
                            </AnimatePresence>
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
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
