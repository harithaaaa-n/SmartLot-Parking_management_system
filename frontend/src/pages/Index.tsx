import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemStatement from "@/components/ProblemStatement";
import SolutionOverview from "@/components/SolutionOverview";
import HowItWorks from "@/components/HowItWorks";
import CallToAction from "@/components/CallToAction";
import MobileEntrySection from "@/components/MobileEntrySection";
import Footer from "@/components/Footer";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveTicket } from "@/utils/storage";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const ticket = getActiveTicket();
    if (ticket) {
      navigate("/result", {
        state: {
          vehicleNumber: ticket.vehicleNumber,
          slot: ticket.slot,
          ticketId: ticket.ticketId,
          isRestored: true
        }
      });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <ProblemStatement />
        <SolutionOverview />
        <HowItWorks />
        <MobileEntrySection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;