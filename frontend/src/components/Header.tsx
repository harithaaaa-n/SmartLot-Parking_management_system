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
        <Link to="/admin/analytics" className="text-sm font-medium hover:text-primary transition-colors">
          Analytics
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
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center space-x-2 font-bold text-lg group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500/40 blur transition duration-500"></div>
            <img src="/car-animated.gif" alt="Logo" className="relative h-9 w-auto rounded-full object-cover ring-2 ring-white dark:ring-slate-800" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">SmartLot</span>
        </Link>

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