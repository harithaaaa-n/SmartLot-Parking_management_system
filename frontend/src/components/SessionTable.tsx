import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock } from "lucide-react";

interface Session {
  vehicleNumber: string;
  slotNumber: string;
  entryTime: string;
  status: 'Active' | 'Closed';
}

// Simulated API call to fetch active sessions
const fetchSessions = async (): Promise<Session[]> => {
  console.log("Fetching active parking sessions...");
  await new Promise(resolve => setTimeout(1000, resolve)); // Simulate network delay

  const now = new Date();
  const sessions: Session[] = [
    { vehicleNumber: "TN01AB1234", slotNumber: "A05", entryTime: new Date(now.getTime() - 3600000).toLocaleTimeString(), status: 'Active' },
    { vehicleNumber: "KA05CD5678", slotNumber: "B12", entryTime: new Date(now.getTime() - 1800000).toLocaleTimeString(), status: 'Active' },
    { vehicleNumber: "MH10EF9012", slotNumber: "A18", entryTime: new Date(now.getTime() - 7200000).toLocaleTimeString(), status: 'Active' },
    { vehicleNumber: "DL03GH3456", slotNumber: "C01", entryTime: new Date(now.getTime() - 300000).toLocaleTimeString(), status: 'Active' },
    { vehicleNumber: "UP14IJ7890", slotNumber: "B03", entryTime: new Date(now.getTime() - 5400000).toLocaleTimeString(), status: 'Active' },
    { vehicleNumber: "RJ27KL2345", slotNumber: "A01", entryTime: new Date(now.getTime() - 10800000).toLocaleTimeString(), status: 'Closed' },
  ].filter(s => s.status === 'Active'); // Only show active sessions

  return sessions;
};

const SessionTable = () => {
  const { data: sessions, isLoading, error } = useQuery<Session[]>({
    queryKey: ['activeSessions'],
    queryFn: fetchSessions,
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-3 text-lg text-muted-foreground">Loading active sessions...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Error loading session data.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle Number</TableHead>
            <TableHead>Slot</TableHead>
            <TableHead>Entry Time</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions && sessions.length > 0 ? (
            sessions.map((session, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{session.vehicleNumber}</TableCell>
                <TableCell className="font-bold text-primary">{session.slotNumber}</TableCell>
                <TableCell className="text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {session.entryTime}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {session.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No active parking sessions currently.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionTable;