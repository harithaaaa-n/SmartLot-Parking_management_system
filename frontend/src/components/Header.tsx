import { Car, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileNav from "./MobileNav";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle"; // Import ThemeToggle

const Header = () => {
  const { isAdmin, logout } = useAuth(); // Removed loginAdmin from destructuring

  const PublicNav = (
    <>
      <nav className="flex items-center space-x-4">
        <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
          Home
        </Link>
        <Link to="/live-slots" className="text-sm font-medium hover:text-primary transition-colors">
          Live Slots
        </Link>
        <Link to="/history" className="text-sm font-medium hover:text-primary transition-colors">
          History
        </Link>
      </nav>

      <div className="flex items-center space-x-3">
        <ThemeToggle className="hidden sm:flex" /> {/* Added ThemeToggle */}
        <Button asChild size="sm" className="hidden lg:inline-flex">
          <Link to="/entry">Enter Parking</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="hidden lg:inline-flex border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
          <Link to="/exit">Exit Parking</Link>
        </Button>

        <Button asChild size="sm" variant="outline" className="flex items-center space-x-1">
          <Link to="/admin/login">
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Admin Login</span>
          </Link>
        </Button>
      </div>
    </>
  );

  const AdminNav = (
    <>
      <nav className="flex items-center space-x-4">
        <Link to="/admin/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
          Dashboard
        </Link>
        <Link to="/admin/slots" className="text-sm font-medium hover:text-primary transition-colors">
          Slots Monitoring
        </Link>
      </nav>
      <div className="flex items-center space-x-3">
        <ThemeToggle className="hidden sm:flex" /> {/* Added ThemeToggle */}
        <Button size="sm" variant="destructive" onClick={logout} className="flex items-center space-x-1">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 shadow-sm transition-all duration-300">
      {/* Professional Top Highlight Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>
      <div className="container flex h-auto py-1 items-center justify-between px-4 md:px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-start overflow-hidden h-14 w-40">
            <img
              src="/SMART%20lot.gif"
              alt="SmartLot"
              className="h-[200%] w-auto max-w-none object-cover object-left-top -mt-3"
            />
          </Link>
          <div className="hidden sm:flex flex-col justify-center">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
              SMART PARKING
            </h1>
            <p className="text-[0.65rem] font-bold text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase mt-0.5">
              Management System
            </p>
          </div>
        </div>

        {/* Desktop Navigation and CTA */}
        <div className="hidden md:flex items-center space-x-6">
          {isAdmin ? AdminNav : PublicNav}
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden flex items-center space-x-3">
          <ThemeToggle className="flex sm:hidden" /> {/* ThemeToggle for mobile */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;