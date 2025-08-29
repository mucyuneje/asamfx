"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  // Initialize theme based on user preference
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark", !dark);
  };

  const navLinks = ["Home", "Signals", "Courses", "Mentorship"];

  return (
    <nav className="fixed w-full z-50 bg-background/90 backdrop-blur-md shadow-sm border-b border-border transition-colors duration-500">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">AsamFXAcademy</div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="hover:text-primary transition-colors"
            >
              {link}
            </a>
          ))}
          <button
            className="px-4 py-2 rounded transition
            bg-[color:var(--primary)] text-[color:var(--primary-foreground)]
            hover:brightness-90"
          >
            Join Now
          </button>
          <button onClick={toggleTheme} className="ml-4">
            {dark ? <Sun /> : <Moon />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleTheme} className="mr-4">
            {dark ? <Sun /> : <Moon />}
          </button>
          <button onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Animate */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-background/95 border-t border-border overflow-hidden"
          >
            <div className="flex flex-col space-y-4 p-4">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="hover:text-primary transition-colors"
                >
                  {link}
                </a>
              ))}
              <button
                className="px-4 py-2 rounded transition
                bg-[color:var(--primary)] text-[color:var(--primary-foreground)]
                hover:brightness-90"
              >
                Join Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
