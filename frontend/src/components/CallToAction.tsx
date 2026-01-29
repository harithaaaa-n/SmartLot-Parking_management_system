import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden bg-slate-900 text-white">
      {/* Refined Enterprise Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 z-0"></div>

      {/* Subtle, Deep Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 animate-pulse-slow delay-700"></div>

      <div className="container px-4 md:px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-tight text-white animate-in fade-in slide-in-from-bottom-6 duration-700">
          Ready to Upgrade Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 animate-gradient-x">Parking Experience?</span>
        </h2>
        <p className="text-xl md:text-2xl mb-12 text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          Join thousands of satisfied users. Experience the seamless, automated future of parking today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-in fade-in zoom-in duration-700 delay-300">
          <Button asChild size="lg" className="h-16 px-12 text-xl btn-premium w-full sm:w-auto">
            <Link to="/entry">Get Started Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-16 px-12 text-xl font-bold bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-800 dark:hover:text-indigo-200 hover:scale-[1.02] transition-all rounded-xl w-full sm:w-auto shadow-sm">
            <Link to="/exit">Check Out</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;