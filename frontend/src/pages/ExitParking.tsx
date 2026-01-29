import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogOut, Smartphone, CreditCard, Star, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { calculateExit, ExitPreview, exitVehicle, submitFeedback } from "@/api/api";
import { useNavigate } from "react-router-dom";

import VehicleSelector from "@/components/VehicleSelector";
import { validateVehicleNumber } from "@/utils/validation";
import { API_BASE_URL } from "@/api/config";
import axios from "axios";
import { clearTicket } from "@/utils/storage";

import { getActiveTicket } from "@/utils/storage";

const ExitParking = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [previewData, setPreviewData] = useState<ExitPreview | null>(null);

  const [showSlotInput, setShowSlotInput] = useState(false);
  const [actualSlot, setActualSlot] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMode, setPaymentMode] = useState("UPI"); // Default to UPI
  const navigate = useNavigate();

  // Feedback State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false); // New state for Thank You screen

  // Auto-fill vehicle number if session exists
  useEffect(() => {
    const ticket = getActiveTicket();
    if (ticket) {
      setVehicleNumber(ticket.vehicleNumber);
    }
  }, []);



  // Mutation to calculate bill
  const calculateMutation = useMutation({
    mutationFn: calculateExit,
    onMutate: () => showLoading("Fetching bill details..."),
    onSuccess: (data, variables, toastId) => {
      dismissToast(toastId as string);
      setPreviewData(data);
      // Clear error on success if any left
      setInputError(null);
    },
    onError: (error, variables, toastId) => {
      dismissToast(toastId as string);

      // Provide user-friendly error messages
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes("no active parking session")) {
        showError("❌ Vehicle not found. Please check the vehicle number or ticket number.");
      } else if (errorMessage.includes("already exited") || errorMessage.includes("session is closed")) {
        showError("⚠️ This vehicle has already exited. The parking session is closed.");
      } else if (errorMessage.includes("not found")) {
        showError("❌ No parking record found for this vehicle. Please verify the number.");
      } else {
        showError(`Error: ${error.message}`);
      }
    }
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);
    const trimmed = vehicleNumber.trim();

    if (!trimmed) return;

    // Validation: Allow 'TICKET-' OR standard vehicle format
    if (!trimmed.toUpperCase().startsWith("TICKET-")) {
      const validation = validateVehicleNumber(trimmed);
      if (!validation.isValid) {
        setInputError(validation.error || "Invalid format");
        return;
      }
    }

    const sanitized = trimmed.replace(/\s+/g, "");
    calculateMutation.mutate(sanitized);
  };

  const handleVehicleChange = (val: string) => {
    setVehicleNumber(val);
    if (inputError) setInputError(null);
  };

  /* Constant for frontend display - match with backend */
  const WRONG_SLOT_PENALTY = 50;
  const finalAmount = previewData
    ? (showSlotInput ? previewData.amount + WRONG_SLOT_PENALTY : previewData.amount)
    : 0;

  // DIRECT EXIT (No Payment Gateway)
  const exitMutation = useMutation({
    mutationFn: (data: { id: string; slot?: string; paymentMode?: string }) => exitVehicle(data.id, data.slot, data.paymentMode),
    onSuccess: (data) => {
      dismissToast("");
      showSuccess("Vehicle Exited Successfully!");
      clearTicket();
      // navigate("/"); -> REMOVED: Stay on page to show success screen
      setStep('success');
    },
    onError: (error) => {
      dismissToast("");
      showError(`Exit Failed: ${error.message}`);
    }
  });

  const handleExit = () => {
    if (!previewData) return;
    showLoading("Processing Exit...");
    // Use ticketNumber or vehicleNumber as identifier
    exitMutation.mutate({
      id: previewData.ticketNumber || previewData.vehicleNumber,
      slot: showSlotInput ? actualSlot : undefined,
      paymentMode: paymentMode
    });
  };


  const isLoading = calculateMutation.isPending || isProcessingPayment;

  const [step, setStep] = useState<'preview' | 'payment' | 'success'>('preview');

  // Prevent going back after success
  useEffect(() => {
    if (step === 'success') {
      // Push a new state to the history stack
      window.history.pushState(null, "", window.location.href);

      const handlePopState = () => {
        // If user tries to go back, force them to home or stay on success
        navigate('/', { replace: true });
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [step, navigate]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiApp, setUpiApp] = useState("GPay");

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handleBackToPreview = () => {
    setStep('preview');
  };

  const handleFinalExit = () => {
    if (!previewData) return;
    showLoading("Processing Payment...");

    // Construct simplified mode string
    let mode = paymentMethod;
    if (paymentMethod === 'UPI') mode = `UPI-${upiApp}`;

    exitMutation.mutate({
      id: previewData.ticketNumber || previewData.vehicleNumber,
      slot: showSlotInput ? actualSlot : undefined,
      paymentMode: mode
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-lg shadow-2xl border-0 ring-1 ring-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary rounded-t-xl"></div>
          <CardHeader className="text-center pt-8">
            {/* Dynamic Header based on step */}
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              {step === 'preview' ? "Parking Exit" : step === 'payment' ? "Select Payment" : "Payment Successful"}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              {step === 'preview'
                ? (previewData ? "Review bill before payment." : "Enter Vehicle Number or Scan QR.")
                : "Choose your preferred payment method."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">

            {/* SEARCH FORM (Only if no previewData) */}
            {!previewData && (
              <>
                <form onSubmit={handleCalculate} className="space-y-6">
                  <div>
                    <VehicleSelector
                      value={vehicleNumber}
                      onChange={handleVehicleChange}
                      disabled={isLoading}
                    />
                    {inputError && (
                      <p className="text-sm text-red-500 font-medium animate-in slide-in-from-top-1">
                        {inputError}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full py-6 text-lg" disabled={isLoading || !vehicleNumber.trim()}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fetching Details...
                      </>
                    ) : "Check Bill"}
                  </Button>
                </form>
                {/* ... OR Divider and QR ... */}

              </>
            )}

            {/* STEP 1: PREVIEW */}
            {previewData && step === 'preview' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                {/* Bill Details */}
                <div className="bg-muted/50 p-6 rounded-xl border border-border/50 space-y-3 text-sm shadow-sm">
                  <div className="flex justify-between items-center"><span className="text-muted-foreground font-medium">Ticket ID</span><span className="font-mono font-bold bg-background px-2 py-1 rounded border overflow-hidden text-ellipsis max-w-[150px]">{previewData.ticketNumber || "N/A"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground font-medium">Vehicle</span><span className="font-bold text-foreground">{previewData.vehicleNumber}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground font-medium">Date</span><span>{new Date(previewData.entryTime).toLocaleDateString()}</span></div>

                  <div className="border-t border-dashed border-border my-3"></div>

                  <div className="flex justify-between"><span className="text-muted-foreground">Entry Time</span><span className="text-foreground">{new Date(previewData.entryTime).toLocaleTimeString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Exit Time</span><span className="text-foreground">{new Date(previewData.exitTime || Date.now()).toLocaleTimeString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="text-foreground font-semibold">{previewData.durationMinutes} mins</span></div>

                  {showSlotInput && (
                    <div className="flex justify-between text-destructive font-bold bg-destructive/5 p-2 rounded"><span>Penalty (Wrong Slot)</span><span>+₹{WRONG_SLOT_PENALTY}</span></div>
                  )}
                  <div className="flex justify-between text-xl font-extrabold text-primary border-t border-border pt-4 mt-2 items-end">
                    <span>Total Amount</span>
                    <span className="text-2xl">₹{finalAmount}</span>
                  </div>
                </div>

                {/* Wrong Slot Input */}
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="check" checked={showSlotInput} onChange={e => setShowSlotInput(e.target.checked)} className="h-5 w-5 text-primary rounded ring-offset-background focus:ring-primary" />
                    <Label htmlFor="check" className="text-sm font-medium cursor-pointer select-none">I parked in a different slot</Label>
                  </div>
                  {showSlotInput && (
                    <div className="mt-3 space-y-2 animate-in slide-in-from-top-1">
                      <Input
                        placeholder="Enter Actual Slot (e.g. A5)"
                        value={actualSlot}
                        onChange={e => setActualSlot(e.target.value.toUpperCase())}
                        className="bg-background border-amber-200 dark:border-amber-800"
                      />
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center">
                        <span className="mr-1 text-lg">⚠️</span> Additional ₹{WRONG_SLOT_PENALTY} penalty applied.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button variant="outline" className="flex-1 w-full sm:w-auto h-12 rounded-xl border-border hover:bg-muted font-semibold" onClick={() => setPreviewData(null)}>Cancel</Button>
                  <Button className="flex-1 w-full sm:w-auto h-12 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all bg-primary text-primary-foreground" onClick={handleProceedToPayment}>
                    Proceed to Pay <CreditCard className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {previewData && step === 'payment' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                <div className="text-center mb-4">
                  <p className="text-muted-foreground">Amount to Pay</p>
                  <h1 className="text-4xl font-extrabold text-primary">₹{finalAmount}</h1>
                </div>

                <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  {['UPI', 'Card', 'Cash'].map(m => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 text-sm font-semibold rounded-md transition-all ${paymentMethod === m ? 'bg-white shadow text-primary dark:bg-gray-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div className="min-h-[150px]">
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-3">
                      <Label>Select UPI App</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {['GPay', 'PhonePe', 'Paytm', 'WhatsApp'].map(app => (
                          <div key={app} onClick={() => setUpiApp(app)} className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all ${upiApp === app ? 'border-primary ring-1 ring-primary bg-primary/5' : ''}`}>
                            <span className="font-medium">{app}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Card' && (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>POS Terminal Ready. Please swipe your card.</p>
                    </div>
                  )}

                  {paymentMethod === 'Cash' && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">💵</div>
                      <p>Please pay cash at the exit counter.</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" onClick={handleBackToPreview} className="w-full sm:w-auto order-2 sm:order-1">Back</Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 w-full sm:w-auto order-1 sm:order-2 py-6 text-lg" onClick={handleFinalExit} disabled={exitMutation.isPending}>
                    {exitMutation.isPending ? <Loader2 className="animate-spin" /> : `Pay ₹${finalAmount} & Exit`}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS & FEEDBACK */}
            {previewData && step === 'success' && !showThankYou && (
              <div className="space-y-6 animate-in fade-in zoom-in duration-500 text-center">
                <div className="flex justify-center">
                  <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="h-14 w-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Payment Successful!</h2>
                  <p className="text-muted-foreground text-sm">Thank you for visiting SmartLot.</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Vehicle Number</span><span className="font-bold">{previewData.vehicleNumber}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Entry ID</span><span className="font-mono">{previewData.ticketNumber || "N/A"}</span></div>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    <div className="flex justify-between"><span className="text-gray-500">Transaction ID</span><span className="font-mono">{`TXN-${Date.now().toString().slice(-8)}`}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{new Date().toLocaleDateString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Amount Paid</span><span className="font-extrabold text-green-600">₹{finalAmount}</span></div>
                  </div>
                </div>

                {/* FEEDBACK SECTION */}
                <div className="pt-4 animate-in slide-in-from-bottom-2 duration-700 delay-100">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">How was your experience?</h3>
                  <div className="flex justify-center flex-wrap gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-2 transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          className={`w-10 h-10 sm:w-12 sm:h-12 ${(hoverRating || rating) >= star
                            ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                            : "text-gray-300 dark:text-gray-600"
                            }`}
                        />
                      </button>
                    ))}
                  </div>

                  {rating > 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                      <textarea
                        className="w-full p-4 rounded-xl border bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none shadow-sm transition-all"
                        rows={3}
                        placeholder="Tell us what you liked or how we can improve... (Optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Button
                        className="w-full md:w-auto md:min-w-[200px] bg-primary hover:bg-primary/90 text-lg py-6 shadow-lg btn-glow rounded-full"
                        onClick={() => {
                          if (!previewData?.ticketNumber) return;
                          setIsFeedbackSubmitting(true);
                          submitFeedback(previewData.ticketNumber, rating, comment)
                            .then(() => {
                              setShowThankYou(true);
                              setTimeout(() => navigate('/'), 8000); // 8s auto redirect to allow reading
                            })
                            .catch(err => showError("Failed to submit feedback"))
                            .finally(() => setIsFeedbackSubmitting(false));
                        }}
                        disabled={isFeedbackSubmitting}
                      >
                        {isFeedbackSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Submit Feedback"}
                      </Button>
                    </div>
                  )}

                  {rating === 0 && (
                    <Button variant="ghost" className="mt-4 text-muted-foreground hover:text-primary w-full sm:w-auto" onClick={() => navigate('/')}>
                      Skip & Return to Home
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: THANK YOU CARD */}
            {showThankYou && (
              <div className="py-12 md:py-16 text-center space-y-8 animate-in fade-in zoom-in duration-700">
                {rating === 5 && <div className="absolute inset-0 pointer-events-none overflow-hidden footer-confetti"></div>}

                <div className="inline-flex p-6 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 mb-2 shadow-inner">
                  <div className="text-5xl animate-bounce">
                    {rating >= 4 ? "🌟" : rating === 3 ? "👍" : "🙏"}
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white tracking-tight">Thank You!</h2>

                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-sm mx-auto leading-relaxed font-medium">
                  {rating >= 4
                    ? "Thank you for trusting us! We’re happy you had a great experience."
                    : rating === 3
                      ? "Thanks for your feedback! We’re constantly improving."
                      : "Thank you for your honest feedback. We’ll work to serve you better."}
                </p>

                <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Thank you for visiting again.</p>
                  <p className="text-base text-muted-foreground mb-6">Drive safe and see you soon!</p>

                  <Button variant="outline" className="w-full md:w-auto min-w-[200px] border-primary text-primary hover:bg-primary/5" onClick={() => navigate('/')}>
                    Back to Home Now
                  </Button>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ExitParking;
