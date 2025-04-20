import React, { useState } from 'react';
import { useMentor } from '../../context/MentorContext';

type MoodOption = {
  emoji: string;
  label: string;
  value: 'sad' | 'neutral' | 'happy' | 'very-happy' | 'excellent';
};

type EnergyOption = {
  label: string;
  value: 'low' | 'medium' | 'high';
  color: string;
};

const moodOptions: MoodOption[] = [
  { emoji: '😔', label: 'Not Great', value: 'sad' },
  { emoji: '😐', label: 'Okay', value: 'neutral' },
  { emoji: '🙂', label: 'Good', value: 'happy' },
  { emoji: '😄', label: 'Very Good', value: 'very-happy' },
  { emoji: '🤩', label: 'Excellent', value: 'excellent' },
];

const energyOptions: EnergyOption[] = [
  { 
    label: 'Low Energy', 
    value: 'low', 
    color: 'bg-blue-100 border-blue-300 text-blue-800'
  },
  { 
    label: 'Medium Energy', 
    value: 'medium', 
    color: 'bg-amber-100 border-amber-300 text-amber-800' 
  },
  { 
    label: 'High Energy', 
    value: 'high', 
    color: 'bg-green-100 border-green-300 text-green-800' 
  },
];

const MoodMeter: React.FC = () => {
  const { userMemory, setUserMood, setUserEnergyLevel } = useMentor();
  const [showEnergyMeter, setShowEnergyMeter] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(userMemory.currentMood || null);
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(userMemory.currentEnergyLevel || null);
  
  const handleMoodSelect = (moodValue: string) => {
    setSelectedMood(moodValue);
    setUserMood(moodValue as any);
    
    // Show energy meter after mood is selected
    setShowEnergyMeter(true);
  };
  
  const handleEnergySelect = (energyValue: string) => {
    setSelectedEnergy(energyValue);
    setUserEnergyLevel(energyValue as any);
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-card p-6 h-fit sticky top-6">
      <h2 className="text-xl font-semibold text-owl-navy mb-3">How are you feeling today?</h2>
      <p className="text-sm text-gray-500 mb-5">
        Your mentor will adapt recommendations based on your energy level.
      </p>
      
      <div className="flex justify-between items-center mb-8">
        {moodOptions.map((option) => (
          <button 
            key={option.value}
            onClick={() => handleMoodSelect(option.value)}
            className={`p-3 rounded-full transition-all ${
              selectedMood === option.value 
                ? 'bg-owl-blue/20 scale-110 border-2 border-owl-blue' 
                : 'hover:bg-owl-blue/10 border-2 border-transparent'
            }`}
            title={option.label}
          >
            <span className="text-2xl">{option.emoji}</span>
          </button>
        ))}
      </div>
      
      {showEnergyMeter && (
        <div className="pt-3 border-t border-gray-100">
          <h3 className="text-sm font-medium text-owl-navy mb-4">Energy Level:</h3>
          <div className="flex flex-col gap-3">
            {energyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleEnergySelect(option.value)}
                className={`py-3 px-4 text-sm rounded-lg border-2 transition-all ${
                  selectedEnergy === option.value
                    ? `${option.color} border-current`
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {selectedMood && selectedEnergy && (
        <div className="mt-6 text-center text-sm text-owl-navy py-3 bg-owl-blue/10 rounded-lg">
          <p>Thank you! Your mentor will adapt recommendations accordingly.</p>
        </div>
      )}
    </div>
  );
};

export default MoodMeter; 