import { Button } from "@/components/ui/button";
import { Stethoscope, Menu, X, User, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { useLogout } from "@/hooks/use-auth";
import { toast } from "sonner";
import { UserRole } from "@/types/api.types";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, profile, logout: authLogout } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      authLogout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      // Even on error, logout locally
      authLogout();
      navigate('/');
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/auth';
    switch (user.role) {
      case UserRole.ADMIN:
        return '/admin-portal';
      case UserRole.STAFF:
        return '/staff-portal';
      case UserRole.PATIENT:
      default:
        return '/patient-dashboard';
    }
  };

  const getDisplayName = () => {
    if (profile && 'firstName' in profile) {
      return profile.firstName;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-smooth">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">DKUT Medical</h1>
              <p className="text-xs text-muted-foreground">Digital Health Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Features
            </Link>
            <Link to="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Services
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()}>
                  <Button variant="outline" className="hidden sm:inline-flex">
                    <User className="mr-2 h-4 w-4" />
                    {getDisplayName()}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="hidden sm:inline-flex text-muted-foreground hover:text-destructive"
                  title="Logout"
                >
                  {logoutMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="hidden sm:inline-flex">
                    <User className="mr-2 h-4 w-4" />
                    Patient Login
                  </Button>
                </Link>
                <Link to="/staff-auth">
                  <Button className="hidden sm:inline-flex bg-gradient-primary hover:opacity-90">
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Staff Portal
                  </Button>
                </Link>
              </>
            )}
            
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
              <Link 
                to="/features" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/services" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-3">
                {isAuthenticated ? (
                  <>
                    <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        {getDisplayName()}
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      disabled={logoutMutation.isPending}
                      className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      {logoutMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                      )}
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        Patient Login
                      </Button>
                    </Link>
                    <Link to="/staff-auth" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" className="bg-gradient-primary hover:opacity-90 w-full">
                        <Stethoscope className="mr-2 h-4 w-4" />
                        Staff Portal
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;