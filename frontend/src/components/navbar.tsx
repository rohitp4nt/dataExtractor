import React, { useState, useEffect } from "react";
import { Menu, X, Instagram, Facebook, Youtube } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-gray-900/95 backdrop-blur-md shadow-xl py-2" : "bg-gray-800 py-4"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <img
                src="/api/placeholder/40/40"
                alt="Raasta Logo"
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Raasta</span> Data Extractor
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {/* Social Links */}
            <div className="flex items-center space-x-1">
              <span className="text-gray-400 text-sm mr-2">Follow us:</span>
              <a href="#" className="hover:text-purple-400 text-gray-300 p-2 rounded-full hover:bg-gray-700/50 transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 text-gray-300 p-2 rounded-full hover:bg-gray-700/50 transition-all duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-red-400 text-gray-300 p-2 rounded-full hover:bg-gray-700/50 transition-all duration-300">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 rounded-md hover:bg-gray-700/70 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-6 px-2 space-y-6 animate-fadeIn">
            {/* Mobile Social Links */}
            <div className="space-y-3">
              <p className="text-gray-400 text-sm font-medium">Follow us on:</p>
              <div className="grid grid-cols-3 gap-2">
                <a href="#" className="flex items-center justify-center space-x-2 bg-gray-700/60 p-3 rounded-lg hover:bg-gray-600/60 transition-colors duration-300">
                  <Instagram size={18} className="text-purple-400" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
                <a href="#" className="flex items-center justify-center space-x-2 bg-gray-700/60 p-3 rounded-lg hover:bg-gray-600/60 transition-colors duration-300">
                  <Facebook size={18} className="text-blue-400" />
                  <span className="text-sm font-medium">Facebook</span>
                </a>
                <a href="#" className="flex items-center justify-center space-x-2 bg-gray-700/60 p-3 rounded-lg hover:bg-gray-600/60 transition-colors duration-300">
                  <Youtube size={18} className="text-red-400" />
                  <span className="text-sm font-medium">YouTube</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;