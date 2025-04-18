
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home, Settings, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <nav className="bg-card border-b border-border p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2 text-foreground">
          <Building2 size={24} className="text-roof-500" />
          <span className="font-bold text-xl hidden md:block">RoofView</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-1 md:space-x-4">
          <NavLink to="/" icon={<Home size={isMobile ? 20 : 16} />} label="Dashboard" />
          <NavLink to="/upload" icon={<Upload size={isMobile ? 20 : 16} />} label="Upload" />
          <NavLink to="/admin" icon={<Settings size={isMobile ? 20 : 16} />} label="Settings" />
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label }) => {
  const isMobile = useIsMobile();
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
        "hover:bg-secondary hover:text-roof-300"
      )}
    >
      {icon}
      {!isMobile && <span>{label}</span>}
    </Link>
  );
};

export default Navbar;
