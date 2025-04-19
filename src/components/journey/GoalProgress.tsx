
import React from 'react';

export interface Goal {
  id: string;
  title: string;
  progress: number; // 0-100
  dueDate?: Date;
}

interface GoalProgressProps {
  goal: Goal;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal }) => {
  const { title, progress, dueDate } = goal;
  
  const getProgressColor = () => {
    if (progress < 30) return 'bg-owl-yellow';
    if (progress < 70) return 'bg-owl-blue';
    return 'bg-owl-mint';
  };
  
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 card-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-owl-navy">{title}</h3>
        {dueDate && (
          <span className="text-sm text-owl-navy/70">
            Due: {formatDate(dueDate)}
          </span>
        )}
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-owl-navy">Progress</span>
          <span className="text-sm font-medium text-owl-navy">{progress}%</span>
        </div>
        <div className="h-2 w-full bg-owl-grey rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressColor()} transition-all duration-500 ease-out`} 
            style={{ width: `${progress}%` }} 
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GoalProgress;
