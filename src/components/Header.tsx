import { Button } from "@/components/ui/button";
import { Stethoscope, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">DKUT Medical</h1>
              <p className="text-xs text-muted-foreground">Digital Health Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Features
            </a>
            <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Services
            </a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              About
            </a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Contact
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden sm:inline-flex">
              Patient Login
            </Button>
            <Button className="hidden sm:inline-flex bg-gradient-primary hover:opacity-90">
              Staff Portal
            </Button>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <nav className="flex flex-col space-y-3">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                Features
              </a>
              <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                Services
              </a>
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                About
              </a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-3">
                <Button variant="outline" size="sm">
                  Patient Login
                </Button>
                <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                  Staff Portal
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;