import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Animation variants (copied locally for modularity)
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const FooterComponent: React.FC = () => {
  return (
    <footer className="w-full border-t">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container grid gap-3 px-4 py-10 md:px-6 lg:grid-cols-4 border-x border-muted"
      >
        <div className="space-y-3">
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
          <p className="text-sm text-muted-foreground">
            We create beautiful, functional designs that help businesses grow and connect with their audience.
          </p>
          <div className="flex space-x-3">
            {[
              { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
              { icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
              { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" },
              { icon: <Github className="h-5 w-5" />, label: "GitHub" },
            ].map((social, index) => (
              <motion.div key={index} whileHover={{ y: -5, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  {social.icon}
                  <span className="sr-only">{social.label}</span>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <h3 className="text-lg font-medium">Company</h3>
            <nav className="mt-4 flex flex-col space-y-2 text-sm">
              <a href="#about" className="text-muted-foreground hover:text-foreground">
                About Us
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Careers
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Our Process
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                News & Press
              </a>
            </nav>
          </div>
          <div>
            <h3 className="text-lg font-medium">Services</h3>
            <nav className="mt-4 flex flex-col space-y-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                UI/UX Design
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Web Development
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Brand Identity
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Digital Marketing
              </a>
            </nav>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <h3 className="text-lg font-medium">Resources</h3>
            <nav className="mt-4 flex flex-col space-y-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Blog
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Case Studies
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Guides & Tutorials
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                FAQ
              </a>
            </nav>
          </div>
          <div>
            <h3 className="text-lg font-medium">Legal</h3>
            <nav className="mt-4 flex flex-col space-y-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Cookie Policy
              </a>
            </nav>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Subscribe to our newsletter</h3>
          <p className="text-sm text-muted-foreground">
            Stay updated with our latest projects, design tips, and company news.
          </p>
          <form className="flex space-x-3">
            <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1 rounded-3xl" />
            <Button type="submit" className="rounded-3xl">
              Subscribe
            </Button>
          </form>
        </div>
      </motion.div>
      <div className="border-t">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Design Studio. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Crafted with passion in New York City</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;