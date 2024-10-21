import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegendContent,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useList } from "@refinedev/core";
import { saveAs } from "file-saver";
import {
    ArrowDownIcon,
    ArrowUpDownIcon,
    ArrowUpIcon,
    DownloadIcon,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer, // Import ResponsiveContainer
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { toast } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface Sorter {
  field: string;
  order: "asc" | "desc";
}

// Define columns for the complaint summary table
const summaryColumns: Column[] = [
  { key: "lupon_member", label: "Lupon Member", sortable: true },
  { key: "total_complaints", label: "Total Complaints", sortable: true },
  { key: "pending_complaints", label: "Pending", sortable: true },
  { key: "in_process_complaints", label: "In Process", sortable: true },
  { key: "resolved_complaints", label: "Resolved", sortable: true },
  { key: "dismissed_complaints", label: "Dismissed", sortable: true },
  {
    key: "avg_resolution_time_days",
    label: "Avg Resolution Time (days)",
    sortable: true,
  },
];

// SortableHeader component
const SortableHeader: React.FC<{
  column: Column;
  label: string;
  onSort: (column: Column) => void;
  isSorted: "asc" | "desc" | false;
}> = ({ column, label, onSort, isSorted }) => {
  const toggleSorting = () => {
    onSort(column);
  };

  const renderSortIcon = () => {
    if (isSorted === "asc") {
      return <ArrowUpIcon className="w-4 h-4 ml-1" />;
    }
    if (isSorted === "desc") {
      return <ArrowDownIcon className="w-4 h-4 ml-1" />;
    }
    return <ArrowUpDownIcon className="w-4 h-4 ml-1" />;
  };

  return (
    <button
      onClick={toggleSorting}
      className="flex flex-row items-center justify-between w-full font-medium text-left"
      aria-label={`Sort by ${label}`}
    >
      <span>{label}</span>
      {renderSortIcon()}
    </button>
  );
};

// RenderTable component
const RenderTable: React.FC<{
  data: any[];
  columns: Column[];
  isLoading: boolean;
  sorter?: Sorter;
  setSorter?: React.Dispatch<React.SetStateAction<Sorter>>;
}> = ({ data, isLoading, sorter, setSorter }) => {
  const handleSort = (column: Column) => {
    if (!setSorter || !sorter) return;
    const isAsc = sorter.field === column.key && sorter.order === "asc";
    const order = isAsc ? "desc" : "asc";
    setSorter({ field: column.key, order });
  };

  return (
    <>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-10 rounded" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={data} />
        </div>
      )}
    </>
  );
};

// Define chart configurations
const barChartConfig = {
  bar: {
    label: "Bar Chart",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const lineChartConfig = {
  line: {
    label: "Line Chart",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const areaChartConfig = {
  area: {
    label: "Area Chart",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const pieChartConfig = {
  pie: {
    label: "Pie Chart",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const radarChartConfig = {
  radar: {
    label: "Radar Chart",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const radialBarChartConfig = {
  radialBar: {
    label: "Radial Bar Chart",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// Helper function to get chart config
const getChartConfig = (chartType: string) => {
  switch (chartType) {
    case "bar":
      return barChartConfig;
    case "line":
      return lineChartConfig;
    case "area":
      return areaChartConfig;
    case "pie":
      return pieChartConfig;
    case "radar":
      return radarChartConfig;
    case "radialBar":
      return radialBarChartConfig;
    default:
      return {};
  }
};

// RenderChart component
const RenderChart: React.FC<{
  data: any[];
  chartType: string;
  dataKey: string;
  isLoading: boolean;
  xAxisKey: string;
}> = ({ data, chartType, dataKey, isLoading, xAxisKey }) => {
  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <ChartContainer
      config={getChartConfig(chartType)}
      className="min-h-[300px] w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "bar" && (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Bar dataKey={dataKey} fill="var(--chart-1)" />
          </BarChart>
        )}
        {chartType === "line" && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="var(--chart-2)"
            />
          </LineChart>
        )}
        {chartType === "area" && (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="var(--chart-3)"
              fillOpacity={1}
              fill="url(#colorArea)"
            />
          </AreaChart>
        )}
        {chartType === "pie" && (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={xAxisKey}
              fill="var(--chart-4)"
              label
            />
            <Tooltip content={<ChartTooltipContent />} />
          </PieChart>
        )}
        {chartType === "radar" && (
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey={xAxisKey} />
            <PolarRadiusAxis />
            <Radar
              name={dataKey}
              dataKey={dataKey}
              stroke="var(--chart-5)"
              fill="var(--chart-5)"
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        )}
        {chartType === "radialBar" && (
          <RadialBarChart
            data={data}
            innerRadius="10%"
            outerRadius="80%"
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              label={{ position: "insideStart", fill: "#fff" }}
              background
              dataKey={dataKey}
            />
            <Legend
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </RadialBarChart>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Main DashboardReports component
const DashboardReports: React.FC = () => {
  const [sorter, setSorter] = useState<Sorter>({
    field: "lupon_member",
    order: "asc",
  });

  // Fetch Complaint Summary Data
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
  } = useList({
    resource: "report_lupon_complaint_summary",
    config: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Fetch Complaint Trends Data
  const {
    data: trendsData,
    isLoading: isTrendsLoading,
  } = useList({
    resource: "report_lupon_complaint_trends",
    config: {
      pagination: {
        pageSize: 12,
      },
    },
  });

  // Fetch Resolution Times Data
  const {
    data: resolutionTimesData,
    isLoading: isResolutionTimesLoading,
  } = useList({
    resource: "report_lupon_resolution_times",
    config: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Fetch Participant Details Data
  const {
    data: participantDetailsData,
    isLoading: isParticipantDetailsLoading,
  } = useList({
    resource: "report_lupon_participant_details",
    config: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Fetch Documentation Data
  const {
    data: documentationData,
    isLoading: isDocumentationLoading,
  } = useList({
    resource: "report_lupon_documentation",
    config: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Fetch Member Activity Data
  const {
    data: memberActivityData,
    isLoading: isMemberActivityLoading,
  } = useList({
    resource: "report_lupon_member_activity",
    config: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Processed Summary Data
  const processedSummaryData = useMemo(() => {
    if (!summaryData?.data) return [];
    return summaryData.data.map((item: any) => ({
      ...item,
      lupon_member: `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim(),
    }));
  }, [summaryData]);

  // Processed Participant Details Data
  const processedParticipantData = useMemo(() => {
    if (!participantDetailsData?.data) return [];
    return participantDetailsData.data.map((item: any) => ({
      ...item,
      participant_name: item.participant_name ?? "N/A",
    }));
  }, [participantDetailsData]);

  // Processed Documentation Data
  const processedDocumentationData = useMemo(() => {
    if (!documentationData?.data) return [];
    return documentationData.data;
  }, [documentationData]);

  // Processed Member Activity Data
  const processedMemberActivityData = useMemo(() => {
    if (!memberActivityData?.data) return [];
    return memberActivityData.data.map((item: any) => ({
      ...item,
      lupon_member: `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim(),
    }));
  }, [memberActivityData]);

  // Handle Download
  const handleDownload = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast.error("No data available to download.");
      return;
    }
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    saveAs(blob, `${filename}.json`);
  };

  // Prepare Trends Chart Data
  const trendsChartData = useMemo(() => {
    if (!trendsData?.data) return [];
    return trendsData.data.map((item: any) => ({
      month: item.month ?? "N/A",
      complaint_count: item.complaint_count ?? 0,
    }));
  }, [trendsData]);

  // Prepare Resolution Times Chart Data
  const resolutionChartData = useMemo(() => {
    if (!resolutionTimesData?.data) return [];
    return resolutionTimesData.data.map((item: any) => ({
      case_number: item.case_number ?? "N/A",
      resolution_time_days: item.resolution_time_days ?? 0,
    }));
  }, [resolutionTimesData]);

  // Define columns for Participant Details
  const participantColumns: Column[] = [
    { key: "complaint_id", label: "Complaint ID", sortable: false },
    { key: "participant_name", label: "Participant Name", sortable: false },
    { key: "role", label: "Role", sortable: false },
    { key: "contact_info", label: "Contact Info", sortable: false },
  ];

  // Define columns for Documentation
  const documentationColumns: Column[] = [
    { key: "complaint_id", label: "Complaint ID", sortable: false },
    { key: "file_name", label: "File Name", sortable: false },
    { key: "uploaded_at", label: "Uploaded At", sortable: false },
    { key: "uploaded_by", label: "Uploaded By", sortable: false },
  ];

  // Define columns for Member Activity
  const memberActivityColumns: Column[] = [
    { key: "lupon_member", label: "Lupon Member", sortable: false },
    {
      key: "complaints_handled",
      label: "Complaints Handled",
      sortable: false,
    },
    {
      key: "resolved_complaints",
      label: "Resolved Complaints",
      sortable: false,
    },
    {
      key: "avg_resolution_time_days",
      label: "Avg Resolution Time (days)",
      sortable: false,
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Complaint Summary Card */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Complaint Summary</CardTitle>
            <Button
              onClick={() =>
                handleDownload(processedSummaryData, "complaint_summary")
              }
              variant="outline"
              className="flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            <RenderTable
              data={processedSummaryData}
              columns={summaryColumns}
              isLoading={isSummaryLoading}
              sorter={sorter}
              setSorter={setSorter}
            />
          </CardContent>
        </Card>

        {/* Complaint Trends Chart */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Complaint Trends (Last 12 Months)</CardTitle>
            <Button
              onClick={() =>
                handleDownload(trendsData?.data || [], "complaint_trends")
              }
              variant="outline"
              className="flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            <RenderChart
              data={trendsChartData}
              chartType="line"
              dataKey="complaint_count"
              xAxisKey="month"
              isLoading={isTrendsLoading}
            />
          </CardContent>
        </Card>

        {/* Resolution Times Chart */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Resolution Times</CardTitle>
            <Button
              onClick={() =>
                handleDownload(
                  resolutionTimesData?.data || [],
                  "resolution_times"
                )
              }
              variant="outline"
              className="flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            <RenderChart
              data={resolutionChartData}
              chartType="area"
              dataKey="resolution_time_days"
              xAxisKey="case_number"
              isLoading={isResolutionTimesLoading}
            />
          </CardContent>
        </Card>

        {/* Participant Details Table */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Participant Details</CardTitle>
            <Button
              onClick={() =>
                handleDownload(
                  processedParticipantData,
                  "participant_details"
                )
              }
              variant="outline"
              className="flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            <RenderTable
              data={processedParticipantData}
              columns={participantColumns}
              isLoading={isParticipantDetailsLoading}
            />
          </CardContent>
        </Card>

        {/* Member Activity Chart */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Lupon Member Activity</CardTitle>
            <Button
              onClick={() =>
                handleDownload(
                  processedMemberActivityData,
                  "member_activity"
                )
              }
              variant="outline"
              className="flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            <RenderChart
              data={processedMemberActivityData}
              chartType="radar"
              dataKey="complaints_handled"
              xAxisKey="lupon_member"
              isLoading={isMemberActivityLoading}
            />
          </CardContent>
        </Card>

        {/* Documentation Table */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Documentation</CardTitle>
            <Button
              onClick={() =>
                handleDownload(
                  processedDocumentationData,
                  "documentation"
                )
              }
              variant="outline"
              className="flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            <RenderTable
              data={processedDocumentationData}
              columns={documentationColumns}
              isLoading={isDocumentationLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardReports;
