// Updated DashboardReports component with proper PDF generation and additional features

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
    PrinterIcon,
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
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { toast } from "sonner";

// Import jsPDF and autoTable
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
}> = ({ data, columns, isLoading, sorter, setSorter }) => {
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
          <table className="min-w-full divide-y">
            <thead >
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    {col.sortable ? (
                      <SortableHeader
                        column={col}
                        label={col.label}
                        onSort={handleSort}
                        isSorted={
                          sorter?.field === col.key ? sorter.order : false
                        }
                      />
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((item: any, idx: number) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap"
                    >
                      {item[col.key] !== null && item[col.key] !== undefined
                        ? item[col.key]
                        : "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

// Define chart configurations
const chartConfigs: { [key: string]: ChartConfig } = {
  bar: {
    bar: {
      label: "Bar Chart",
      color: "var(--chart-1)",
    },
  },
  line: {
    line: {
      label: "Line Chart",
      color: "var(--chart-2)",
    },
  },
  area: {
    area: {
      label: "Area Chart",
      color: "var(--chart-3)",
    },
  },
  pie: {
    pie: {
      label: "Pie Chart",
      color: "var(--chart-4)",
    },
  },
  radar: {
    radar: {
      label: "Radar Chart",
      color: "var(--chart-5)",
    },
  },
  radialBar: {
    radialBar: {
      label: "Radial Bar Chart",
      color: "var(--chart-1)",
    },
  },
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
      config={chartConfigs[chartType]}
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
            <Line type="monotone" dataKey={dataKey} stroke="var(--chart-2)" />
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

// Helper function to generate PDF using jsPDF and autoTable
const generatePDF = async (
  data: any[],
  columns: Column[],
  title: string,
  filename: string
) => {
  if (!data || data.length === 0) {
    toast.error("No data available to download.");
    return;
  }

  const doc = new jsPDF("landscape");

  // Set PDF metadata and styling
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Prepare table column headers
  const tableColumn = columns.map((col) => ({
    header: col.label,
    dataKey: col.key,
  }));

  // Prepare table rows
  const tableRows = data.map((item) => {
    const row: any = {};
    columns.forEach((col) => {
      row[col.key] =
        item[col.key] !== null && item[col.key] !== undefined
          ? item[col.key].toString()
          : "N/A";
    });
    return row;
  });

  // Add autoTable to the PDF
  autoTable(doc, {
    startY: 30,
    head: [tableColumn],
    body: tableRows,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    theme: "grid",
  });

  // Save the PDF
  doc.save(`${filename}.pdf`);
};

// Helper function to download JSON data
const downloadJSON = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    toast.error("No data available to download.");
    return;
  }
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  saveAs(blob, `${filename}.json`);
};

// Helper function to print the component
const printComponent = (componentId: string) => {
  const printContents = document.getElementById(componentId)?.innerHTML;
  const originalContents = document.body.innerHTML;

  if (printContents) {
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  } else {
    toast.error("Unable to print the content.");
  }
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
        pageSize: 1000,
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
        pageSize: 1000,
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
        pageSize: 1000,
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
        pageSize: 1000,
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
        pageSize: 1000,
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

  // Summary Metrics
  const totalComplaints = processedSummaryData.reduce(
    (acc, item) => acc + (item.total_complaints || 0),
    0
  );

  const avgResolutionTime = (
    processedSummaryData.reduce(
      (acc, item) => acc + (item.avg_resolution_time_days || 0),
      0
    ) / processedSummaryData.length
  ).toFixed(2);

  return (
    <div className="p-4 space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Total Complaints Handled</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-4xl font-bold">{totalComplaints}</h2>
          </CardContent>
        </Card>
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Average Resolution Time (days)</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-4xl font-bold">{avgResolutionTime}</h2>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Complaint Summary Card */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Complaint Summary</CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={() =>
                  generatePDF(
                    processedSummaryData,
                    summaryColumns,
                    "Complaint Summary Report",
                    "complaint_summary"
                  )
                }
                variant="outline"
                className="flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                onClick={() =>
                  downloadJSON(processedSummaryData, "complaint_summary")
                }
                variant="outline"
                className="flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Download JSON
              </Button>
              <Button
                onClick={() => printComponent("complaint-summary")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PrinterIcon className="w-4 h-4" />
                Print
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div id="complaint-summary">
              <RenderTable
                data={processedSummaryData}
                columns={summaryColumns}
                isLoading={isSummaryLoading}
                sorter={sorter}
                setSorter={setSorter}
              />
            </div>
          </CardContent>
        </Card>

        {/* Complaint Trends Chart */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Complaint Trends (Last 12 Months)</CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={async () => {
                  if (!trendsChartData || trendsChartData.length === 0) {
                    toast.error("No data available to download.");
                    return;
                  }

                  const doc = new jsPDF("landscape");
                  doc.setFontSize(18);
                  doc.text("Complaint Trends (Last 12 Months)", 14, 22);

                  const chartContainer = document.getElementById(
                    "trends-chart"
                  );
                  if (chartContainer) {
                    const canvas = await html2canvas(chartContainer);
                    const imgData = canvas.toDataURL("image/png");
                    doc.addImage(imgData, "PNG", 15, 30, 260, 100);
                    doc.save("complaint_trends.pdf");
                  } else {
                    toast.error("Unable to generate PDF.");
                  }
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                onClick={() =>
                  downloadJSON(trendsChartData, "complaint_trends")
                }
                variant="outline"
                className="flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Download JSON
              </Button>
              <Button
                onClick={() => printComponent("trends-chart")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PrinterIcon className="w-4 h-4" />
                Print
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div id="trends-chart">
              <RenderChart
                data={trendsChartData}
                chartType="line"
                dataKey="complaint_count"
                xAxisKey="month"
                isLoading={isTrendsLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Resolution Times Chart */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Resolution Times</CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={async () => {
                  if (
                    !resolutionChartData ||
                    resolutionChartData.length === 0
                  ) {
                    toast.error("No data available to download.");
                    return;
                  }

                  const doc = new jsPDF("landscape");
                  doc.setFontSize(18);
                  doc.text("Resolution Times", 14, 22);

                  const chartContainer = document.getElementById(
                    "resolution-chart"
                  );
                  if (chartContainer) {
                    const canvas = await html2canvas(chartContainer);
                    const imgData = canvas.toDataURL("image/png");
                    doc.addImage(imgData, "PNG", 15, 30, 260, 100);
                    doc.save("resolution_times.pdf");
                  } else {
                    toast.error("Unable to generate PDF.");
                  }
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                onClick={() =>
                  downloadJSON(resolutionChartData, "resolution_times")
                }
                variant="outline"
                className="flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Download JSON
              </Button>
              <Button
                onClick={() => printComponent("resolution-chart")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PrinterIcon className="w-4 h-4" />
                Print
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div id="resolution-chart">
              <RenderChart
                data={resolutionChartData}
                chartType="area"
                dataKey="resolution_time_days"
                xAxisKey="case_number"
                isLoading={isResolutionTimesLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Participant Details Table */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Participant Details</CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={() =>
                  generatePDF(
                    processedParticipantData,
                    participantColumns,
                    "Participant Details Report",
                    "participant_details"
                  )
                }
                variant="outline"
                className="flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                onClick={() =>
                  downloadJSON(processedParticipantData, "participant_details")
                }
                variant="outline"
                className="flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Download JSON
              </Button>
              <Button
                onClick={() => printComponent("participant-details")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PrinterIcon className="w-4 h-4" />
                Print
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div id="participant-details">
              <RenderTable
                data={processedParticipantData}
                columns={participantColumns}
                isLoading={isParticipantDetailsLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Member Activity Chart */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Lupon Member Activity</CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={async () => {
                  if (
                    !processedMemberActivityData ||
                    processedMemberActivityData.length === 0
                  ) {
                    toast.error("No data available to download.");
                    return;
                  }

                  const doc = new jsPDF("landscape");
                  doc.setFontSize(18);
                  doc.text("Lupon Member Activity", 14, 22);

                  const chartContainer = document.getElementById(
                    "member-activity-chart"
                  );
                  if (chartContainer) {
                    const canvas = await html2canvas(chartContainer);
                    const imgData = canvas.toDataURL("image/png");
                    doc.addImage(imgData, "PNG", 15, 30, 260, 100);
                    doc.save("member_activity.pdf");
                  } else {
                    toast.error("Unable to generate PDF.");
                  }
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                onClick={() =>
                  downloadJSON(
                    processedMemberActivityData,
                    "member_activity"
                  )
                }
                variant="outline"
                className="flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Download JSON
              </Button>
              <Button
                onClick={() => printComponent("member-activity-chart")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PrinterIcon className="w-4 h-4" />
                Print
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div id="member-activity-chart">
              <RenderChart
                data={processedMemberActivityData}
                chartType="radar"
                dataKey="complaints_handled"
                xAxisKey="lupon_member"
                isLoading={isMemberActivityLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Documentation Table */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Documentation</CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={() =>
                  generatePDF(
                    processedDocumentationData,
                    documentationColumns,
                    "Documentation Report",
                    "documentation"
                  )
                }
                variant="outline"
                className="flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                onClick={() =>
                  downloadJSON(processedDocumentationData, "documentation")
                }
                variant="outline"
                className="flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Download JSON
              </Button>
              <Button
                onClick={() => printComponent("documentation-table")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PrinterIcon className="w-4 h-4" />
                Print
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div id="documentation-table">
              <RenderTable
                data={processedDocumentationData}
                columns={documentationColumns}
                isLoading={isDocumentationLoading}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardReports;
