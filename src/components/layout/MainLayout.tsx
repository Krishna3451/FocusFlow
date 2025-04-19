
import React from 'react';
import Navigation from './Navigation';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/mentor':
        return 'Mentor Room';
      case '/today':
        return "Today's Focus";
      case '/journey':
        return 'Journey Overview';
      default:
        return 'Wise Owl Coach';
    }
  };

  return (
    <div className="min-h-screen owl-gradient animate-fade-in">
      <Navigation />
      <main className="container mx-auto py-6 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-owl-navy mb-6">
          {getPageTitle()}
        </h1>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
