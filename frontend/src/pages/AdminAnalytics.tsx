import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import AnalyticsCards from "@/components/AnalyticsCards";
import VehiclesPerHourChart from "@/components/VehiclesPerHourChart";
import SlotUsagePieChart from "@/components/SlotUsagePieChart";
import { Separator } from "@/components/ui/separator";
import { BarChart } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, fetchDetailedAnalytics } from "@/api/api";
import { Loader2, Download, FileText, FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";

const AdminAnalytics = () => {
  // Fetch basic stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 10000,
  });

  // Fetch detailed analytics (charts)
  const { data: detailedAnalytics, isLoading: isLoadingDetailed } = useQuery({
    queryKey: ['adminDetailedAnalytics'],
    queryFn: fetchDetailedAnalytics,
    refetchInterval: 15000,
  });

  const isLoading = isLoadingStats || isLoadingDetailed;

  // CSV Download Handler
  const downloadCSV = () => {
    if (!detailedAnalytics?.hourlyData) return;

    // Convert Hourly Data to CSV
    const headers = ["Hour", "Vehicles Entered"];
    const rows = detailedAnalytics.hourlyData.map((item: any) => [item.hour, item.vehicles]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map((e: any[]) => e.join(",")).join("\n");

    // Add Summary Stats
    if (stats) {
      csvContent += "\n\nSUMMARY STATS\n";
      csvContent += `Total Entries Today,${stats.todayEntries}\n`;
      csvContent += `Total Exits Today,${stats.todayExits}\n`;
      csvContent += `Revenue Today,${stats.todayRevenue}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `parking_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Download Handler
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Smart Parking Management System", 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Daily Analytics Report - ${new Date().toLocaleDateString()}`, 14, 30);

    // 1. Key Metrics Table
    if (stats) {
      autoTable(doc, {
        startY: 40,
        head: [['Metric', 'Value']],
        body: [
          ['Vehicles Entered Today', stats.todayEntries],
          ['Vehicles Exited Today', stats.todayExits],
          ['Current Active Vehicles', stats.currentActive],
          ['Total Revenue Today', `Rs. ${stats.todayRevenue}`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [66, 139, 202] },
      });
    }

    // 2. Hourly Data Table
    if (detailedAnalytics?.hourlyData) {
      const finalY = (doc as any).lastAutoTable.finalY || 40;
      doc.text("Hourly Entry Traffic", 14, finalY + 10);

      autoTable(doc, {
        startY: finalY + 15,
        head: [['Time Interval', 'Vehicles Entered']],
        body: detailedAnalytics.hourlyData.map((item: any) => [item.hour, item.vehicles]),
        theme: 'striped',
      });
    }

    doc.save(`smartlot_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <SectionWrapper id="admin-analytics" title="Parking Analytics" className="bg-transparent">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Gain real-time insights into parking trends, revenue generation, and slot utilization to optimize your operations.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* 1. Key Metrics Cards */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-2xl font-semibold">Key Performance Indicators</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={downloadCSV} className="gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="default" size="sm" onClick={downloadPDF} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <FileText className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
              <AnalyticsCards stats={stats} detailedStats={detailedAnalytics} />

              <Separator className="my-10" />

              {/* 2. Charts Section */}
              <h3 className="text-2xl font-semibold mb-6 flex items-center space-x-2">
                <BarChart className="h-6 w-6 text-primary" />
                <span>Detailed Usage Charts</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VehiclesPerHourChart data={detailedAnalytics?.hourlyData} />
                <SlotUsagePieChart data={detailedAnalytics?.slotDistribution} />
              </div>

              <Separator className="my-10" />

              {/* 3. Data Notes */}
              <div className="text-center p-6 bg-white dark:bg-card rounded-lg shadow-inner">
                <p className="text-sm text-muted-foreground">
                  Note: All analytics data is automatically generated by the SmartLot system sensors and ticketing logs.
                  This information is crucial for optimizing slot allocation, predicting peak congestion, and ensuring maximum operational efficiency.
                </p>
              </div>
            </>
          )}

        </SectionWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default AdminAnalytics;