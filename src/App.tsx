import React from 'react';
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MentorRoom from "./pages/MentorRoom";
import Today from "./pages/Today";
import Journey from "./pages/Journey";
import NotFound from "./pages/NotFound";
import { MentorProvider } from './context/MentorContext';

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <MentorProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/mentor" element={<MentorRoom />} />
                <Route path="/today" element={<Today />} />
                <Route path="/journey" element={<Journey />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </MentorProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
