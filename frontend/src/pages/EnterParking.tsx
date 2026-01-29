import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { enterVehicle } from "@/api/api";
import VehicleSelector from "@/components/VehicleSelector";
import { validateVehicleNumber } from "@/utils/validation";
import { saveTicket, getActiveTicket } from "@/utils/storage";

const EnterParking = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const entryMutation = useMutation({
    mutationFn: enterVehicle,
    onMutate: () => showLoading("Processing Entry..."),
    onSuccess: (data, variables, toastId) => {
      dismissToast(toastId as string);
      showSuccess(`Entry Successful! Ticket: ${data.ticket.ticketNumber}`);

      // Persist session
      saveTicket({
        vehicleNumber: variables.toUpperCase(),
        slot: data.ticket.slotNumber, // Note: saved as 'slot' in storage interface, 'slotNumber' in API
        ticketId: data.ticket.ticketNumber,
        entryTime: new Date().toISOString()
      });

      // Navigate to result page, passing data via state
      navigate("/result", {
        state: {
          vehicleNumber: variables.toUpperCase(),
          slot: data.ticket.slotNumber,
          ticketId: data.ticket.ticketNumber
        }
      });

      // Clear input on success
      setVehicleNumber("");
      setIsAnimating(false); // Ensure animation state is cleared
    },
    onError: (error, variables, toastId) => {
      dismissToast(toastId as string);

      // Provide user-friendly error messages
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes("already currently parked") || errorMessage.includes("duplicate entry")) {
        showError("⚠️ This vehicle is already parked. Please exit first before re-entering.");
      } else if (errorMessage.includes("no slots available")) {
        showError("🅿️ Sorry, parking is full. No slots available at the moment.");
      } else if (errorMessage.includes("invalid vehicle number")) {
        showError("❌ Invalid vehicle number format. Please use format: TN01AB1234");
      } else {
        // Debugging Aid: Show the URL being used
        import("@/api/config").then(({ API_BASE_URL }) => {
          showError(`Entry Failed: ${error.message} (API: ${API_BASE_URL})`);
        });
      }

      setIsAnimating(false);
    }
  });

  // Check for existing session on mount
  // REMOVED: Auto-redirect logic to allow multiple entries
  // useEffect(() => {
  //   const ticket = getActiveTicket();
  //   if (ticket) {
  //     navigate("/result", { ... });
  //   }
  // }, [navigate]);

  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    const validation = validateVehicleNumber(vehicleNumber);
    if (!validation.isValid) {
      setInputError(validation.error || "Invalid format");
      return;
    }

    if (vehicleNumber.trim()) {
      setIsAnimating(true);
      setTimeout(() => {
        const sanitized = vehicleNumber.trim().replace(/\s+/g, "");
        entryMutation.mutate(sanitized);
      }, 2000);
    }
  };

  const handleVehicleChange = (val: string) => {
    setVehicleNumber(val);
    if (inputError) setInputError(null);
  };

  const isLoading = entryMutation.isPending || isAnimating;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-lg shadow-2xl border-0 ring-1 ring-border/50 bg-card/50 backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-t-xl"></div>
          <CardHeader className="text-center pb-2 pt-8">
            <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Car className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">Parking Entry</CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">Enter vehicle number to generate ticket</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {isAnimating || entryMutation.isPending ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-6 animate-in fade-in duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                  <img
                    src="/car-animated.gif"
                    alt="Processing..."
                    className="relative w-48 h-auto mix-blend-multiply dark:mix-blend-normal"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Processsing Entry</h2>
                  <p className="text-primary font-medium animate-pulse">
                    Allocating smart slot for you...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">

                {/* Isometric 3D Illustration */}
                <div className="flex justify-center mb-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-2xl transform rotate-3 scale-105 transition-transform group-hover:rotate-6"></div>
                    <img
                      src="/entry-animation.gif"
                      alt="Smart Parking Gate Animation"
                      className="relative w-full max-w-xs h-auto drop-shadow-xl rounded-xl border border-white/20 dark:border-white/10"
                    />
                  </div>
                </div>

                <form onSubmit={handleEntry} className="space-y-6">
                  <div className="space-y-3">
                    <VehicleSelector
                      value={vehicleNumber}
                      onChange={handleVehicleChange}
                      disabled={isLoading}
                    />
                    {inputError && (
                      <p className="text-sm text-destructive font-semibold animate-in slide-in-from-top-1 bg-destructive/10 p-2 rounded-md flex items-center justify-center">
                        {inputError}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-7 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl relative overflow-hidden group"
                    disabled={isLoading || !vehicleNumber.trim()}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Generating Ticket...
                        </>
                      ) : (
                        "Generate Ticket"
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default EnterParking;