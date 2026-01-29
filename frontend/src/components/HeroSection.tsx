import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Scan, X, Camera } from "lucide-react";
import { useState } from "react";

const HeroSection = () => {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-background text-foreground">
      {/* QR Scanner Overlay */}
      {showScanner && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <div className="relative w-full max-w-md p-6 flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-4 text-white hover:bg-white/20"
              onClick={() => setShowScanner(false)}
            >
              <X className="w-8 h-8" />
            </Button>

            <h2 className="text-white text-2xl font-bold mb-8 tracking-wider">Scan Entry QR</h2>

            <div className="relative w-80 h-80 border-2 border-white/20 rounded-3xl overflow-hidden bg-black/50 shadow-2xl shadow-indigo-500/20">
              {/* Corner Markers */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-cyan-400 rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-cyan-400 rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-cyan-400 rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-cyan-400 rounded-br-3xl"></div>

              {/* Scan Line Animation */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_20px_2px_rgba(99,102,241,0.5)] animate-scan-y"></div>

              {/* Placeholder Camera View */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Camera className="w-16 h-16 text-white/10 animate-pulse" />
              </div>
            </div>

            <p className="text-gray-400 mt-8 text-center max-w-xs">
              Align the QR code within the frame to scan automatically.
            </p>
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50 dark:bg-slate-950"></div>
        {/* VIBRANT Hero Background Blob 1 (Top Left - Violet/Indigo) */}
        <div className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-violet-500/20 via-indigo-500/20 to-purple-500/20 blur-[100px] animate-pulse-slow"></div>
        {/* VIBRANT Hero Background Blob 2 (Center Right - Cyan/Teal) */}
        <div className="absolute top-[20%] -right-[20%] w-[70%] h-[80%] rounded-full bg-gradient-to-l from-cyan-400/20 via-teal-400/20 to-emerald-400/20 blur-[100px] animate-pulse-slow delay-1000"></div>
        {/* VIBRANT Hero Background Blob 3 (Bottom Center - Pink/Rose Accent) */}
        <div className="absolute -bottom-[40%] left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-t from-rose-500/10 to-pink-500/10 blur-[120px] animate-pulse-slow delay-2000"></div>
      </div>

      <div className="container relative z-10 px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text Content */}
        <div className="text-center md:text-left space-y-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/40 dark:to-violet-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-bold tracking-wide mb-4 shadow-lg shadow-indigo-500/10 animate-in fade-in slide-in-from-bottom-4 duration-700 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 mr-2 animate-ping"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 mr-2"></span>
            Smart Parking Management System
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 drop-shadow-sm">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 via-pink-500 to-cyan-500 animate-gradient-x bg-[length:200%_auto] drop-shadow-2xl">
              Smart Parking
            </span> <br />
            is Here.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl md:mx-0 mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Effortless entry, real-time slot tracking, and seamless automated payments. Experience the next generation of urban mobility optimization.
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <Button asChild size="lg" className="h-14 px-8 text-lg btn-premium shadow-xl shadow-indigo-500/20">
              <Link to="/entry">Enter Parking</Link>
            </Button>

            <div className="flex gap-4">
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all rounded-xl">
                <Link to="/exit">Exit Parking</Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-14 w-14 p-0 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:text-cyan-500 transition-all"
                title="Open QR Scanner"
                onClick={() => setShowScanner(true)}
              >
                <Scan className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="pt-10 flex items-center justify-center md:justify-start gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500">
            <div className="flex items-center gap-2 group">
              <div className="h-2 w-2 rounded-full bg-cyan-500 group-hover:scale-150 transition-transform"></div>
              Real-time Tracking
            </div>
            <div className="flex items-center gap-2 group">
              <div className="h-2 w-2 rounded-full bg-indigo-600 group-hover:scale-150 transition-transform"></div>
              Secure Payments
            </div>
            <div className="flex items-center gap-2 group">
              <div className="h-2 w-2 rounded-full bg-violet-600 group-hover:scale-150 transition-transform"></div>
              Instant Access
            </div>
          </div>
        </div>

        {/* Right Column: Illustration Placeholder */}
        <div className="relative flex justify-center md:justify-end animate-in fade-in zoom-in duration-1000 delay-300">
          <div className="relative w-full max-w-lg z-10 group perspective-1000">
            {/* Abstract Decor behind Image */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-3xl opacity-20 group-hover:opacity-60 blur-2xl transition-all duration-700 group-hover:blur-3xl"></div>
            <img
              src="/smart-parking-hero.png"
              alt="Smart Parking System Illustration"
              className="relative w-full h-auto drop-shadow-2xl rounded-2xl border border-white/20 shadow-2xl transition-transform duration-700 ease-out group-hover:rotate-y-2 group-hover:scale-[1.02]"
            />

            {/* Floating Badge 1 */}
            <div className="absolute -top-6 -right-6 glass-card p-4 animate-bounce-slow hidden md:block">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Slots Available</span>
              </div>
            </div>
            {/* Floating Badge 2 */}
            <div className="absolute -bottom-8 -left-6 glass-card p-4 animate-bounce-slow delay-1000 hidden md:block">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚡</span>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Fast Entry</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;