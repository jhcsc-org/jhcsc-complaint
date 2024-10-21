"use client"

import { ColumnDef } from "@tanstack/react-table"

export type ComplaintSummary = {
  lupon_member: string
  total_complaints: number
  pending_complaints: number
  in_process_complaints: number
  resolved_complaints: number
  dismissed_complaints: number
  avg_resolution_time_days: number | null
}

export const columns: ColumnDef<ComplaintSummary>[] = [
  {
    accessorKey: "lupon_member",
    header: "Lupon Member",
  },
  {
    accessorKey: "total_complaints",
    header: "Total Complaints",
  },
  {
    accessorKey: "pending_complaints",
    header: "Pending",
  },
  {
    accessorKey: "in_process_complaints",
    header: "In Process",
  },
  {
    accessorKey: "resolved_complaints",
    header: "Resolved",
  },
  {
    accessorKey: "dismissed_complaints",
    header: "Dismissed",
  },
  {
    accessorKey: "avg_resolution_time_days",
    header: "Avg Resolution Time (days)",
    cell: ({ row }) => {
      const value = row.getValue("avg_resolution_time_days")
      return value != null ? (value as number).toFixed(2) : "N/A"
    },
  },
]
