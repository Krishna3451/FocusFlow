import React from 'react';
import { useMentor, Goal } from '../../context/MentorContext';
import { format } from 'date-fns';

interface GoalItemProps {
  goal: Goal;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal }) => {
  const { title, deadline, milestones } = goal;
  const completedMilestones = milestones.filter(m => m.isCompleted).length;
  const totalMilestones = milestones.length;
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  
  return (
    <div className="bg-owl-blue/10 rounded-xl p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-owl-navy">{title}</h3>
        {deadline && (
          <span className="text-xs bg-owl-blue/20 px-2 py-1 rounded-full text-owl-navy">
            Due: {format(new Date(deadline), 'MMM d, yyyy')}
          </span>
        )}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className="bg-owl-blue h-2 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="text-xs text-owl-navy/70">
        {completedMilestones} of {totalMilestones} milestones completed
      </div>
    </div>
  );
};

const GoalsList: React.FC = () => {
  const { activeGoals } = useMentor();
  
  if (activeGoals.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
        <h2 className="text-lg font-semibold text-owl-navy mb-4">Your Goals</h2>
        <p className="text-owl-navy/70 text-sm">
          Share your goals with your coach to see them here!
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
      <h2 className="text-lg font-semibold text-owl-navy mb-4">Your Goals</h2>
      {activeGoals.map(goal => (
        <GoalItem key={goal.id} goal={goal} />
      ))}
    </div>
  );
};

export default GoalsList; 