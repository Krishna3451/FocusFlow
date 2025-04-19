
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import OwlAvatar from '../shared/OwlAvatar';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: '/mentor', text: 'Mentor Room' },
    { href: '/today', text: "Today's Focus" },
    { href: '/journey', text: 'Journey Overview' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-owl-blue/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2">
              <OwlAvatar size="sm" />
              <span className="text-owl-navy font-semibold text-lg">Wise Owl Coach</span>
            </NavLink>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {links.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full transition-colors ${
                    isActive
                      ? 'bg-owl-blue/20 text-owl-navy font-medium'
                      : 'text-owl-navy/70 hover:text-owl-navy hover:bg-owl-blue/10'
                  }`
                }
              >
                {link.text}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-owl-navy p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-owl-blue/10 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            {links.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-owl-blue/20 text-owl-navy font-medium'
                      : 'text-owl-navy/70 hover:text-owl-navy hover:bg-owl-blue/10'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.text}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
