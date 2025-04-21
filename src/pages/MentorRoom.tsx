import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ChatWindow from '../components/mentor/ChatWindow';
import MoodMeter from '../components/mentor/MoodMeter';
import { useMentor } from '../context/MentorContext';

const MentorRoom: React.FC = () => {
  const { currentMode } = useMentor();
  
  // Get the friendly name for the current mode
  const getModeLabel = (): string => {
    switch (currentMode) {
      case 'therapist': return 'Emotional Support';
      case 'brainstorming': return 'Brainstorming';
      default: return 'Goal Coaching';
    }
  };
  
  // Get the color style for the current mode
  const getModeColor = (): string => {
    switch (currentMode) {
      case 'therapist': return 'bg-purple-100 text-purple-800';
      case 'brainstorming': return 'bg-teal-100 text-teal-800';
      default: return 'bg-owl-blue/20 text-owl-navy';
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Chat section */}
          <div className="lg:w-2/3">
            <div className="mb-4 flex items-center">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${getModeColor()}`}>
                Mode: {getModeLabel()}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                Your mentor adapts based on your needs
              </span>
            </div>
            <ChatWindow />
          </div>
          
          {/* Right side - Mood meter */}
          <div className="lg:w-1/3">
            <MoodMeter />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MentorRoom;
