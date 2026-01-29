import { QrCode, Car, Ticket, Zap } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const solutions = [
  {
    icon: QrCode,
    title: "QR-Based Entry/Exit",
    description: "Fast, secure, and touchless entry and exit using unique QR codes generated upon arrival.",
  },
  {
    icon: Car,
    title: "Automatic Slot Assignment",
    description: "Real-time sensor data guides drivers directly to the nearest available spot, eliminating search time.",
  },
  {
    icon: Ticket,
    title: "Digital Ticketing & Payment",
    description: "Paperless operations with digital tickets and integrated payment options for a smooth checkout.",
  },
  {
    icon: Zap,
    title: "Reduced Manpower",
    description: "Automation minimizes the need for human intervention, drastically cutting down operational costs.",
  },
];

import "@/styles/GlowingCard.css"; // Import the custom CSS

const SolutionOverview = () => {
  return (
    <SectionWrapper id="solution" title="Our Smart Solution" className="bg-transparent"> {/* Changed bg to transparent to let glow cards shine */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {solutions.map((solution, index) => (
          <div key={index} className="glow-card p-6">
            <div className="card-content flex flex-col h-full">
              {/* Visual Accent from CSS pseudo-elements handles the border glow */}

              <div className="mb-6 h-16 w-16 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 icon-wrapper">
                <solution.icon className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-bold mb-2">{solution.title}</h3>
              <div className="relative z-10">
                <p className="text-sm leading-relaxed">{solution.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default SolutionOverview;