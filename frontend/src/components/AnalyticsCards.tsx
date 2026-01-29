import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, Car, Percent } from "lucide-react";



const AnalyticsCards = ({ stats, detailedStats }: { stats: any, detailedStats: any }) => {
  // Safe defaults
  const totalParkedToday = stats?.todayEntries || 0;
  const peakHour = detailedStats?.peakHour || "Calculating...";
  const utilizationPercentage = detailedStats?.utilizationRate || 0;
  const projectedRevenue = stats?.todayRevenue || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

      {/* Total Vehicles Parked Today */}
      <Card className="shadow-sm border-l-4 border-l-primary bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Vehicles Today</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Car className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalParkedToday}</div>
          <p className="text-xs text-muted-foreground mt-1">Entries tracked today</p>
        </CardContent>
      </Card>

      {/* Peak Parking Hours */}
      <Card className="shadow-sm border-l-4 border-l-accent bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Peak Hour</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Clock className="h-4 w-4 text-accent" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{peakHour}</div>
          <p className="text-xs text-muted-foreground mt-1">Highest occupancy period</p>
        </CardContent>
      </Card>

      {/* Slot Utilization Percentage */}
      <Card className="shadow-sm border-l-4 border-l-blue-500 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Utilization Rate</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Percent className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{utilizationPercentage}%</div>
          <p className="text-xs text-muted-foreground mt-1">Current system utilization</p>
        </CardContent>
      </Card>

      {/* Revenue */}
      <Card className="shadow-sm border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-900/10 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Total Revenue</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">₹{projectedRevenue}</div>
          <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">Generated today</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCards;