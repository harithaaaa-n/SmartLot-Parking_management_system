import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Car, LogIn, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block w-full py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-accent dark:hover:bg-accent/50 rounded-md transition-colors text-left px-4"
  >
    {children}
  </Link>
);

const MobileNav = () => {
  const [open, setOpen] = React.useState(false);
  const { isAdmin, logout } = useAuth(); // Removed loginAdmin from destructuring

  const closeSheet = () => setOpen(false);

  const handleLogout = () => {
    closeSheet();
    logout();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center space-x-2 text-xl font-bold text-primary mb-6">
            <Car className="h-6 w-6" />
            <span>SmartLot</span>
          </div>

          <nav className="flex flex-col space-y-1 flex-grow">
            <NavLink to="/" onClick={closeSheet}>Home</NavLink>

            {isAdmin ? (
              <>
                <NavLink to="/admin/dashboard" onClick={closeSheet}>Dashboard</NavLink>
                <NavLink to="/admin/slots" onClick={closeSheet}>Slots Monitoring</NavLink>
                <NavLink to="/admin/analytics" onClick={closeSheet}>Analytics</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/entry" onClick={closeSheet}>Entry</NavLink>
                <NavLink to="/exit" onClick={closeSheet}>Exit</NavLink>
                <NavLink to="/live-slots" onClick={closeSheet}>Live Slots</NavLink>
              </>
            )}
          </nav>

          <Separator className="my-4" />

          {isAdmin ? (
            <Button
              size="lg"
              variant="destructive"
              className="w-full py-3 flex items-center space-x-2"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="w-full py-3 mb-2">
                <Link to="/entry" onClick={closeSheet}>Enter Parking</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full py-3 flex items-center space-x-2"
              >
                <Link to="/admin/login" onClick={closeSheet}>
                  <LogIn className="h-5 w-5" />
                  <span>Admin Login</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;