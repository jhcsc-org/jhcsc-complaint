import { TableType } from "@/types/dev.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { ComplaintItem } from "./ComplaintItem";

// Props for the SortableComplaint component
interface SortableComplaintProps {
  complaint: TableType<"complaints">;
}

// Component to make complaints sortable within their columns
export const SortableComplaint: React.FC<SortableComplaintProps> = ({
  complaint,
}) => {
  // Hook to make the item sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: complaint.id });

  // Style adjustments for the dragging state
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined, // Reduce opacity when dragging
    zIndex: isDragging ? 1000 : undefined,  // Bring the dragging item to the front
    cursor: isDragging ? 'grabbing' : 'grab', // Change cursor during drag
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ComplaintItem
        complaint={complaint}
        statusColor={getStatusColor(complaint.status)}
      />
    </div>
  );
};

// Function to get the color associated with a status
function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-800",
    IN_PROCESS: "bg-blue-800",
    RESOLVED: "bg-green-800",
    DISMISSED: "bg-gray-800",
  };
  return statusColors[status] || "bg-gray-800";
}
