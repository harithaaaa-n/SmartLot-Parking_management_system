import Header from "@/components/Header";
import "@/styles/GlowingCard.css"; // Ensure styles are loaded
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

import QRCode from "react-qr-code";
import { saveTicket, getActiveTicket, clearTicket } from "@/utils/storage";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface ParkingResultState {
  vehicleNumber: string;
  slot: string;
  ticketId: string;
}

const ParkingResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState<ParkingResultState | null>(location.state as ParkingResultState | null);

  useEffect(() => {
    // If state exists (from nav), save it. Else try recover from storage.
    if (location.state) {
      saveTicket(location.state as ParkingResultState);
    } else {
      const stored = getActiveTicket();
      if (stored) {
        setState(stored);
      }
    }
  }, [location.state]);

  if (!state) {
    // Handle case where user navigates directly or state is missing
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center p-8">
            <h1 className="text-2xl font-bold text-destructive">Error</h1>
            <p className="text-muted-foreground mt-2">No parking session data found. Please try entering again.</p>
            <Button asChild className="mt-4">
              <Link to="/">Return Home</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const { vehicleNumber, slot, ticketId } = state;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-2xl border-0 ring-1 ring-border/50 bg-card/80 backdrop-blur top-card-glow">
          <div className="w-full h-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-t-xl"></div>
          <CardHeader className="text-center pb-2 pt-8">
            <div className="mb-4 inline-flex p-4 rounded-full bg-green-50 dark:bg-green-900/20 shadow-inner">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-foreground tracking-tight">Entry Confirmed</CardTitle>
            <CardDescription className="text-lg mt-2">
              Your parking session has started successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-6 md:p-8">

            {/* Isometric 3D Illustration */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/10 blur-2xl rounded-full"></div>
                <img
                  src="/car-safety-edit.gif"
                  alt="Safe Parking Animation"
                  className="relative w-full max-w-[320px] h-auto drop-shadow-xl rounded-xl mix-blend-multiply dark:mix-blend-normal"
                />
              </div>
            </div>

            {/* Digital Ticket Card */}
            <div id="printable-ticket" className="glow-card p-0 overflow-hidden relative group">
              {/* Ticket Top Decoration - Kept inside for structure */}
              <div className="h-1 w-full bg-border border-b border-dashed"></div>
              <div className="absolute -left-3 top-1/2 w-6 h-6 bg-card rounded-full z-10 border border-r-0 border-border/50"></div>
              <div className="absolute -right-3 top-1/2 w-6 h-6 bg-card rounded-full z-10 border border-l-0 border-border/50"></div>

              <div className="card-content p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Digital Ticket
                  </h3>
                  <Button variant="ghost" size="icon" onClick={handlePrint} className="h-8 w-8 text-muted-foreground hover:text-primary" title="Download Ticket">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                {/* Assigned Slot */}
                <div className="text-center py-6 bg-primary/5 rounded-lg border border-primary/10 mb-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Your Assigned Slot</p>
                  <p className="text-6xl font-black text-primary tracking-tighter">{slot}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-3 text-sm pt-4 border-t border-dashed border-border/50">
                  <div className="font-bold text-foreground">Vehicle</div>
                  <div className="font-bold text-right text-foreground">{vehicleNumber}</div>

                  <div className="font-bold text-foreground">Ticket ID</div>
                  <div className="font-bold font-mono text-right text-xs text-foreground">{ticketId}</div>

                  <div className="font-bold text-foreground">Date</div>
                  <div className="font-bold text-right text-foreground">{new Date().toLocaleDateString()}</div>

                  <div className="font-bold text-foreground">Entry Time</div>
                  <div className="font-bold text-right text-foreground">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full py-6 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                <Link to="/exit">Proceed to Exit Terminal</Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                onClick={() => {
                  navigate("/");
                }}
              >
                Back to Dashboard
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="link"
                className="text-xs text-muted-foreground hover:text-primary"
                onClick={() => {
                  clearTicket();
                  navigate("/");
                }}
              >
                Park Another Vehicle
              </Button>
            </div>

          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ParkingResult;