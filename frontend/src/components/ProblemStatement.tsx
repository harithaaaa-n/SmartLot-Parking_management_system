import { XCircle, Clock, Users } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const problems = [
  {
    icon: Clock,
    title: "Time Wastage",
    description: "Drivers spend excessive time searching for available parking spots, leading to frustration and traffic congestion.",
  },
  {
    icon: XCircle,
    title: "Inaccurate Data",
    description: "Manual tracking often results in incorrect occupancy data, leading to inefficient resource allocation and revenue loss.",
  },
  {
    icon: Users,
    title: "High Manpower Costs",
    description: "Traditional systems rely heavily on human attendants for ticketing and guidance, increasing operational expenses.",
  },
];

import "@/styles/GlowingCard.css"; // Import the custom CSS

const ProblemStatement = () => {
  return (
    <SectionWrapper id="problem" title="The Challenge">
      <div className="grid gap-8 md:grid-cols-3">
        {problems.map((problem, index) => (
          // Applied the .glow-card class. Note: The Card component itself might yield a div, 
          // but sticking to a div wrapper or replacing Card with div.glow-card might be safer if Card has default styles.
          // However, user said "add this for cards". I'll use a div with the class to ensure pure CSS application.
          <div key={index} className="glow-card p-6">
            <div className="card-content flex flex-col h-full">
              <div className="flex flex-row items-center space-x-4 pb-4 pt-2">
                <div className={`p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110 icon-wrapper`}>
                  <problem.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">{problem.title}</h3>
              </div>
              <div className="relative z-10">
                <p className="leading-relaxed text-base">{problem.description}</p>
              </div>
            </div>
          </div>
        ))
        }
      </div>
    </SectionWrapper >
  );
};
export default ProblemStatement;