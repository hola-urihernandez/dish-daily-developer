
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import UserMenu from './UserMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Navigation links with translations
  const navLinks = [
    { 
      href: '/', 
      label: { 
        en: 'Home', 
        es: 'Inicio', 
        ca: 'Inici' 
      } 
    },
    { 
      href: '/dishes', 
      label: { 
        en: 'Dishes', 
        es: 'Platos', 
        ca: 'Plats' 
      } 
    },
    { 
      href: '/menus', 
      label: { 
        en: 'Menus', 
        es: 'Menús', 
        ca: 'Menús' 
      } 
    },
    { 
      href: '/daily-planner', 
      label: { 
        en: 'Daily Planner', 
        es: 'Planificador Diario', 
        ca: 'Planificador Diari' 
      } 
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold tracking-tight text-foreground flex items-center">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded mr-2">MD</span>
            <span className="hidden sm:inline">Menu Daily</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:bg-secondary hover:text-foreground'
                }`}
              >
                {t(link.label)}
              </Link>
            ))}
            <div className="ml-4 flex items-center space-x-2">
              <LanguageSelector />
              <UserMenu />
            </div>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center">
            <LanguageSelector />
            <UserMenu />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="ml-2"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-b border-border">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:bg-secondary hover:text-foreground'
                }`}
              >
                {t(link.label)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
