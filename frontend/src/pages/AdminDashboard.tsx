import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import ParkingSlot from "@/components/ParkingSlot";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Car, Banknote, History, Zap, Lock, Unlock, AlertTriangle, QrCode, LogOut, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { fetchSlots, fetchActiveSessions, fetchDashboardStats } from "@/api/api";

import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { useState } from "react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [qrType, setQrType] = useState<'entry' | 'exit' | null>(null);

  const getQrUrl = (type: 'entry' | 'exit') => {
    // Hardcoded production URLs as requested
    if (type === 'entry') return "https://smart-lot-parking-management-system-amber.vercel.app/entry";
    if (type === 'exit') return "https://smart-lot-parking-management-system-amber.vercel.app/exit";
    return window.location.origin;
  };
  // 1. Live Slot Status
  const { data: slots = [], isLoading: isLoadingSlots } = useQuery({
    queryKey: ['adminSlots'],
    queryFn: fetchSlots,
    refetchInterval: 5000,
  });

  // 2. Dashboard Stats (Today Analytics & Payments)
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 10000,
  });

  // 3. Current Vehicles (Active Sessions)
  const { data: sessions = [], isLoading: isLoadingSessions } = useQuery({
    queryKey: ['adminSessions'],
    queryFn: fetchActiveSessions,
    refetchInterval: 5000,
  });

  const handleControlAction = (action: string) => {
    alert(`Control Action Triggered: ${action}`);
    // Future: Call backend control API
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 md:p-8 container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of parking status and recent activities.</p>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <Button onClick={() => navigate("/admin/analytics")} variant="outline" className="gap-2 shadow-sm">
              <History className="h-4 w-4" /> Analytics
            </Button>
            <Button onClick={() => navigate("/admin/history")} variant="outline" className="gap-2 shadow-sm">
              <History className="h-4 w-4" /> History
            </Button>
            <Button onClick={() => navigate("/admin/slots")} className="gap-2 shadow-sm">
              <Zap className="h-4 w-4" /> Manage Slots
            </Button>
          </div>
        </div>

        {/* =======================
            1. TODAY ANALYTICS & PAYMENTS
           ======================= */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-sm border-l-4 border-l-primary">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Vehicles Entered Today</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-bold">{stats?.todayEntries || 0}</div></CardContent>
            </Card>
            <Card className="shadow-sm border-l-4 border-l-accent">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Vehicles Exited Today</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-bold">{stats?.todayExits || 0}</div></CardContent>
            </Card>
            <Card className="shadow-sm border-l-4 border-l-blue-500">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Current Occupancy</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.currentActive || 0}</div></CardContent>
            </Card>
            <Card className="shadow-sm border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-900/10">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center"><Banknote className="mr-2 h-4 w-4" /> Revenue Today</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-bold text-green-700 dark:text-green-300">₹{stats?.todayRevenue || 0}</div></CardContent>
            </Card>
          </div>
        </section>

        {/* =======================
            2. LIVE SLOT STATUS
           ======================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center"><Zap className="mr-2 h-5 w-5 text-primary" /> Live Slot Status</h2>
            <Badge variant="outline" className="px-3 py-1">Auto-refreshing</Badge>
          </div>
          <Card className="p-6 shadow-md border-border/60">
            {isLoadingSlots ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {slots.map((slot) => (
                  <ParkingSlot key={slot._id} id={slot.slotNumber} status={slot.status} />
                ))}
              </div>
            )}
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* =======================
                3. CURRENT VEHICLES (Active Sessions)
               ======================= */}
          <section className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold flex items-center"><Car className="mr-2 h-5 w-5 text-primary" /> Current Vehicles</h2>
            <Card className="overflow-hidden shadow-md border-border/60">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Vehicle No.</TableHead>
                      <TableHead>Slot</TableHead>
                      <TableHead>Entry Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.length > 0 ? sessions.map((s: any) => (
                      <TableRow key={s.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono font-bold text-foreground">{s.vehicleNumber}</TableCell>
                        <TableCell><Badge variant="secondary">{s.slotNumber}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{new Date(s.entryTime).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: true })}</TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">Parked</Badge></TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Car className="h-8 w-8 opacity-20" />
                            <p>No vehicles currently parked.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </section>

          {/* =======================
                4. ALERTS & CONTROLS
               ======================= */}
          <div className="space-y-8 lg:col-span-1">
            {/* ALERTS */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center text-amber-600 dark:text-amber-500"><AlertTriangle className="mr-2 h-5 w-5" /> Recent Alerts</h2>
              <Card className="space-y-0 border-l-4 border-l-amber-500 shadow-md">
                <CardHeader className="pb-3 pt-4 px-4 bg-amber-50/50 dark:bg-amber-900/10">
                  <CardDescription>Compliance violations.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                  {stats?.recentAlerts && stats.recentAlerts.length > 0 ? (
                    stats.recentAlerts.map((alert: any) => (
                      <div key={alert.id} className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-sm border border-amber-100 dark:border-amber-800/50">
                        <div className="flex justify-between font-bold text-amber-800 dark:text-amber-500">
                          <span>{alert.vehicleNumber}</span>
                          <span className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="text-xs mt-1 text-muted-foreground">
                          Assigned <span className="font-mono font-semibold">{alert.assignedSlot}</span> but used <span className="font-mono font-semibold text-destructive">{alert.usedSlot}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm flex flex-col items-center">
                      <CheckCircle className="h-8 w-8 text-green-500/20 mb-2" />
                      All clear. No recent alerts.
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* CONTROLS */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center"><Zap className="mr-2 h-5 w-5 text-primary" /> Quick Actions</h2>
              <Card className="p-4 space-y-4 shadow-md bg-secondary/20">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-4 bg-background hover:bg-muted border-primary/20 hover:border-primary/50 group"
                  onClick={() => setQrType('entry')}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-foreground">Entry Terminal</span>
                      <span className="text-xs text-muted-foreground">Show QR / Launch Kiosk</span>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-4 bg-background hover:bg-muted border-green-500/20 hover:border-green-500/50 group"
                  onClick={() => setQrType('exit')}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-foreground">Exit Terminal</span>
                      <span className="text-xs text-muted-foreground">Show QR / Launch Kiosk</span>
                    </div>
                  </div>
                </Button>

                <div className="pt-2">
                  <div className="bg-primary/5 p-3 rounded-md text-sm border border-primary/10 flex items-center justify-between">
                    <span className="font-semibold text-primary">System Status</span>
                    <Badge className="bg-green-500 hover:bg-green-600">ONLINE</Badge>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </div>

        {/* QR Code Dialog */}
        <Dialog open={!!qrType} onOpenChange={(open) => !open && setQrType(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                {qrType === 'entry' ? 'Entry Terminal QR' : 'Exit Terminal QR'}
              </DialogTitle>
              <CardDescription>
                Scan this code to launch the {qrType} terminal on a mobile device or kiosk.
              </CardDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-6 space-y-6">
              <div className="p-4 bg-white rounded-xl shadow-lg border border-border">
                {qrType && (
                  <QRCode
                    value={getQrUrl(qrType)}
                    size={200}
                    level="H"
                  />
                )}
              </div>
              <div className="w-full space-y-2 text-center">
                <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded break-all">
                  {qrType && getQrUrl(qrType)}
                </p>
                <Button
                  className="w-full"
                  onClick={() => qrType && window.open(getQrUrl(qrType), '_blank')}
                >
                  <Zap className="mr-2 h-4 w-4" /> Open in New Tab
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>


      </main >
      <Footer />
    </div >
  );
};

export default AdminDashboard;