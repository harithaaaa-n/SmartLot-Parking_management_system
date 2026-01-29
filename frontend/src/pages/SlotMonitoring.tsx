import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import ParkingSlot from "@/components/ParkingSlot";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CheckCircle, XCircle, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { fetchSlots, Slot } from "@/api/api";

interface DashboardData {
  slots: Slot[];
  activeSessionsCount: number; // Keeping this for consistency, though not strictly needed here
}

// Fetches slots from backend
const getDashboardData = async () => {
  const slots = await fetchSlots();
  return { slots };
};

const SlotMonitoring = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['slotMonitoringData'],
    queryFn: getDashboardData,
    refetchInterval: 2000, // Refresh every 2 seconds for real-time feel
  });

  const slots = data?.slots || [];

  const availableCount = slots.filter(s => s.status === 'available').length;
  const occupiedCount = slots.filter(s => s.status === 'occupied').length;
  const totalCount = slots.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <SectionWrapper id="slot-monitoring" title="Slot Monitoring" className="bg-gray-50 dark:bg-gray-900">
          <p className="text-center text-lg text-muted-foreground mb-8">
            Real-time parking slot status. View-only access to ensure system automation integrity.
          </p>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="text-center p-4 shadow-lg">
              <p className="text-sm text-muted-foreground">Total Slots</p>
              <p className="text-4xl font-extrabold text-primary mt-1">{totalCount}</p>
            </Card>
            <Card className="text-center p-4 shadow-lg bg-green-500/10 border-green-500">
              <p className="text-sm text-muted-foreground">Available Slots</p>
              <p className="text-4xl font-extrabold text-green-600 dark:text-green-400 mt-1">{availableCount}</p>
            </Card>
            <Card className="text-center p-4 shadow-lg bg-red-500/10 border-red-500">
              <p className="text-sm text-muted-foreground">Occupied Slots</p>
              <p className="text-4xl font-extrabold text-red-600 dark:text-red-400 mt-1">{occupiedCount}</p>
            </Card>
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-8 mb-6 text-sm font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span>Occupied</span>
            </div>
          </div>

          {/* Slot Grid */}
          <Card className="p-6 shadow-xl max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-muted-foreground flex items-center space-x-2">
                <Car className="h-5 w-5" />
                <span>Parking Lot Layout (Total: {totalCount})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-lg text-muted-foreground">Loading real-time slot data...</span>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-4">
                  Error loading data. Please check the connection.
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                  {slots.map((slot) => (
                    <ParkingSlot key={slot._id} id={slot.slotNumber} status={slot.status} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Data updates automatically every 10 seconds.
          </p>
        </SectionWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default SlotMonitoring;