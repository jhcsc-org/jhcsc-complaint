import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { TableType } from "@/types/dev.types";
import React from "react";

// Props for the ComplaintItem component
interface ComplaintItemProps {
  complaint: TableType<"complaints">;
  statusColor: string;
}

// Component to display individual complaint details
export const ComplaintItem: React.FC<ComplaintItemProps> = ({
  complaint,
  statusColor,
}) => {
  return (
    <div className="mb-2 border rounded-md border-border/35 bg-card">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold">{complaint.case_title}</h3>
        <p className="text-xs text-gray-500">Case #: {complaint.case_number}</p>
        <p className="mt-2 text-xs truncate text-muted-foreground">{complaint.description}</p>
        <div className="flex items-center justify-between mt-2">
          <Badge className={statusColor}><span className="text-xs">{complaint.status.replace("_", " ")}</span></Badge>
          <span className="text-sm text-gray-500">
            {new Date(complaint.date_filed).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </div>
  );
};
