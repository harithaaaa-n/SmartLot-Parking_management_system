import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, ChevronRight, Sparkles, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  scrollY: number;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

// Animation variants (copied locally for modularity)
const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const HeaderComponent: React.FC<HeaderProps> = ({ scrollY, isMenuOpen, toggleMenu }) => {
  const navItems = ["Services", "Work", "About", "Clients", "Contact"];
  
  const HashLink: React.FC<{ href: string, children: React.ReactNode, className?: string, onClick?: () => void }> = ({ href, children, className, onClick }) => (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${scrollY > 50 ? "shadow-md" : ""}`}
    >
      <div className="container flex h-16 items-center justify-between border-x border-muted">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="h-10 w-10 rounded-3xl bg-primary flex items-center justify-center"
            >
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <span className="font-bold text-xl">Studio</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-3">
          {navItems.map(item => (
            <HashLink key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium transition-colors hover:text-primary">
              {item}
            </HashLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-3xl">
            Log In
          </Button>
          <Button size="sm" className="rounded-3xl">
            Get Started
          </Button>
        </div>
        <button className="flex md:hidden" onClick={toggleMenu}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background md:hidden"
        >
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-3xl bg-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">Studio</span>
              </Link>
            </div>
            <button onClick={toggleMenu}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <motion.nav
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="container grid gap-3 pb-8 pt-6"
          >
            {navItems.map((item, index) => (
              <motion.div key={index} variants={itemFadeIn}>
                <HashLink
                  href={`#${item.toLowerCase()}`}
                  className="flex items-center justify-between rounded-3xl px-3 py-2 text-lg font-medium hover:bg-accent"
                  onClick={toggleMenu}
                >
                  {item}
                  <ChevronRight className="h-4 w-4" />
                </HashLink>
              </motion.div>
            ))}
            <motion.div variants={itemFadeIn} className="flex flex-col gap-3 pt-4">
              <Button variant="outline" className="w-full rounded-3xl">
                Log In
              </Button>
              <Button className="w-full rounded-3xl">Get Started</Button>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default HeaderComponent;