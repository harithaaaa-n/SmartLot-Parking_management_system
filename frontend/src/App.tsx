import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import EnterParking from "./pages/EnterParking";
import ExitParking from "./pages/ExitParking";
import ParkingResult from "./pages/ParkingResult";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import SlotManagement from "./pages/SlotManagement";
import UpiPayment from "./pages/UpiPayment";
import CardPayment from "./pages/CardPayment";
import CashPayment from "./pages/CashPayment";
import SlotMonitoring from "./pages/SlotMonitoring";
import AdminAnalytics from "./pages/AdminAnalytics";
import DesignAgencyDemo from "./pages/DesignAgencyDemo"; // Import new demo page
import FeaturesDemo from "./pages/FeaturesDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import ParkingHistory from "./pages/ParkingHistory";
import History from "./pages/History"; // Public History Page
import GateDisplay from "./pages/GateDisplay";
import { useState, useEffect } from "react";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <img
          src="/car-animated.gif"
          alt="Loading..."
          className="w-64 h-auto"
        />
        <h2 className="text-3xl font-bold text-primary mt-4">SmartLot</h2>
        <p className="text-xl font-semibold text-primary animate-pulse mt-2">
          Starting System...
        </p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/entry" element={<EnterParking />} />
              <Route path="/exit" element={<ExitParking />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/payment/upi" element={<UpiPayment />} />
              <Route path="/payment/card" element={<CardPayment />} />
              <Route path="/payment/cash" element={<CashPayment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/result" element={<ParkingResult />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/design-demo" element={<DesignAgencyDemo />} /> {/* New Demo Route */}
              <Route path="/features-demo" element={<FeaturesDemo />} />
              <Route path="/live-slots" element={<SlotMonitoring />} />
              <Route path="/history" element={<History />} />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
              />
              <Route
                path="/admin/slots"
                element={<ProtectedRoute><SlotManagement /></ProtectedRoute>}
              />
              <Route
                path="/admin/history"
                element={<ProtectedRoute><ParkingHistory /></ProtectedRoute>}
              />
              <Route
                path="/admin/analytics"
                element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>}
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              {/* Gate Display Route (Public/Kiosk) */}
              <Route path="/gate-display" element={<GateDisplay />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;