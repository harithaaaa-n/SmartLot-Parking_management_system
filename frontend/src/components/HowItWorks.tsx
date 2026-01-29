import { StepForward, CheckCircle, DollarSign } from "lucide-react";
import SectionWrapper from "./SectionWrapper";

const steps = [
  {
    number: 1,
    icon: StepForward,
    title: "Entry & QR Scan",
    description: "The driver scans a unique QR code at the entry gate to register their vehicle and receive a digital ticket.",
  },
  {
    number: 2,
    icon: CheckCircle,
    title: "Automatic Assignment",
    description: "The system instantly assigns the best available parking slot and displays navigation guidance.",
  },
  {
    number: 3,
    icon: DollarSign,
    title: "Exit & Payment",
    description: "Upon exit, the driver scans their QR code, calculates the fee automatically, and completes the digital payment.",
  },
];

const HowItWorks = () => {
  return (
    <SectionWrapper id="how-it-works" title="Seamless Flow">
      <div className="relative flex flex-col md:flex-row justify-between items-start space-y-16 md:space-y-0 md:space-x-8 px-4">
        {/* Timeline Line (Hidden on mobile, visible on desktop) */}
        <div className="hidden md:block absolute top-12 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 dark:from-indigo-800 dark:to-cyan-800 mx-16 rounded-full shadow-lg shadow-indigo-500/20"></div>

        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center md:w-1/3 relative group">

            {/* Step Indicator */}
            <div className={`absolute -top-6 md:relative md:top-0 h-20 w-20 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border-4 shadow-2xl z-20 mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${index === 0 ? 'border-indigo-100 shadow-indigo-500/30' : index === 1 ? 'border-purple-100 shadow-purple-500/30' : 'border-cyan-100 shadow-cyan-500/30'
              }`}>
              <span className={`text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br ${index === 0 ? 'from-indigo-600 to-indigo-400' : index === 1 ? 'from-purple-600 to-purple-400' : 'from-cyan-600 to-cyan-400'
                }`}>{step.number}</span>
            </div>

            <div className="w-full mt-12 md:mt-8 p-8 rounded-3xl glass-card border border-white/40 dark:border-white/10 hover:-translate-y-2 relative overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
              {/* Decorative background blob */}
              <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -mr-20 -mt-20 transition-all opacity-40 group-hover:opacity-60 ${index === 0 ? 'bg-indigo-500' : index === 1 ? 'bg-purple-500' : 'bg-cyan-500'
                }`}></div>

              <div className={`mb-6 inline-flex p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110 shadow-inner ${index === 0 ? 'bg-indigo-50 text-indigo-700' : index === 1 ? 'bg-purple-50 text-purple-700' : 'bg-cyan-50 text-cyan-700'
                } dark:bg-white/5`}>
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">{step.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default HowItWorks;