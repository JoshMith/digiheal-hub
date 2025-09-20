import { Button } from "@/components/ui/button";
import { Stethoscope, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <Link to="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Services
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              About
            </Link>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">Contact</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="outline" className="hidden sm:inline-flex">
                <User className="mr-2 h-4 w-4" />
                Patient Login
              </Button>
            </Link>
            <Link to="/staff-portal">
              <Button className="hidden sm:inline-flex bg-gradient-primary hover:opacity-90">
                <Stethoscope className="mr-2 h-4 w-4" />
                Staff Portal
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="md:hidden py-4 border-t animate-fade-in">
            <nav className="flex flex-col space-y-3">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                Features
              </a>
              <Link to="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                Services
              </Link>
              <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                About
              </Link>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-3">
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Patient Login
                  </Button>
                </Link>
                <Link to="/staff-portal">
                  <Button size="sm" className="bg-gradient-primary hover:opacity-90 w-full">
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Staff Portal
                  </Button>
                </Link>
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;