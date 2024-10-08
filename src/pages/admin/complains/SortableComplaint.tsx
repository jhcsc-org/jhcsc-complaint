import { TableType } from '@/types/dev.types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import React from 'react';
import { ComplaintItem } from './ComplaintItem';

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
    zIndex: isDragging ? 1000 : undefined,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ scale: 1.01, boxShadow: "0px 3px 10px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: "tween",
        stiffness: 500,
        damping: 30,
        layout: { duration: 0.3 }
      }}
      className="mb-4"
    >
      <ComplaintItem
        complaint={complaint}
        statusColor={getStatusColor(complaint.status)}
      />
    </motion.div>
  );
};

// Function to get the color associated with a status
function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-700/65",
    IN_PROCESS: "bg-blue-700/65",
    RESOLVED: "bg-green-700/65",
    DISMISSED: "bg-gray-700/65",
  };
  return statusColors[status] || "bg-gray-600";
}

