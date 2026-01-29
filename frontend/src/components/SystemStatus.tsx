import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, ShieldCheck, Ban } from "lucide-react";

const SystemStatus = () => {
  return (
    <Card className="shadow-lg border-l-4 border-primary">
      <CardHeader>
        <CardTitle className="text-xl flex items-center space-x-2">
          <Zap className="h-6 w-6 text-primary" />
          <span>System Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex justify-between items-center border-b pb-2">
          <p className="text-sm font-medium text-muted-foreground">System Health:</p>
          <span className="font-semibold text-green-600 dark:text-green-400 flex items-center">
            <ShieldCheck className="h-4 w-4 mr-1" /> Running
          </span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <p className="text-sm font-medium text-muted-foreground">Automation Mode:</p>
          <span className="font-semibold text-primary flex items-center">
            <Zap className="h-4 w-4 mr-1" /> Enabled
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-muted-foreground">Manual Intervention:</p>
          <span className="font-semibold text-red-600 dark:text-red-400 flex items-center">
            <Ban className="h-4 w-4 mr-1" /> Disabled
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;