import React, { useMemo } from 'react';
import { useMentor, Task } from '../../context/MentorContext';
import { format, isToday, addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface TaskItemProps {
  task: Task & { goalId: string; milestoneId: string };
  onComplete: (goalId: string, milestoneId: string, taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete }) => {
  const { title, isCompleted, goalId, milestoneId, id, energyLevel } = task;
  
  // Get energy level badge color
  const getEnergyBadgeColor = () => {
    if (!energyLevel) return '';
    
    switch (energyLevel) {
      case 'low': return 'bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full ml-2';
      case 'medium': return 'bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full ml-2';
      case 'high': return 'bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full ml-2';
      default: return '';
    }
  };
  
  return (
    <div className="flex items-center gap-3 mb-2 p-2 hover:bg-owl-blue/5 rounded-lg transition-colors">
      <input 
        type="checkbox" 
        checked={isCompleted}
        onChange={() => !isCompleted && onComplete(goalId, milestoneId, id)}
        className="h-5 w-5 rounded-md border-2 border-owl-blue/30 text-owl-blue focus:ring-owl-blue/30"
      />
      <div className="flex items-center">
        <span className={isCompleted ? "line-through text-gray-400" : "text-owl-navy"}>
          {title}
        </span>
        {energyLevel && <span className={getEnergyBadgeColor()}>{energyLevel}</span>}
      </div>
    </div>
  );
};

const TodaysFocus: React.FC = () => {
  const { activeGoals, completeTask, userMemory } = useMentor();
  
  // Generate today's tasks from active goals
  const todaysTasks = useMemo(() => {
    const tasks: (Task & { goalId: string; milestoneId: string })[] = [];
    
    // Get incomplete tasks from active goals
    activeGoals.forEach(goal => {
      if (!goal.isActive) return;
      
      goal.milestones.forEach(milestone => {
        if (milestone.isCompleted) return;
        
        milestone.tasks.forEach(task => {
          if (task.isCompleted) return;
          
          // Include the task if it's due today or has no specific date
          if (!task.dueDate || isToday(new Date(task.dueDate))) {
            tasks.push({
              ...task,
              goalId: goal.id,
              milestoneId: milestone.id,
              // If task has no energy level, assign a default one
              energyLevel: task.energyLevel || 'medium'
            });
          }
        });
      });
    });
    
    // If we have fewer than 3 tasks, generate some generic ones based on energy level
    if (tasks.length < 3 && activeGoals.length > 0) {
      // Find the most recently created active goal
      const latestGoal = [...activeGoals]
        .filter(g => g.isActive)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      
      if (latestGoal) {
        const firstMilestone = latestGoal.milestones[0] || {
          id: uuidv4(),
          title: 'Get started',
          description: 'First steps toward your goal',
          tasks: [],
          isCompleted: false
        };
        
        // Create tasks based on current energy level
        const currentEnergy = userMemory.currentEnergyLevel || 'medium';
        
        if (currentEnergy === 'low') {
          // For low energy, suggest reflection or small planning tasks
          tasks.push({
            id: uuidv4(),
            title: `Reflect on your progress with "${latestGoal.title}"`,
            description: "Take a few minutes to think about what's working and what's not",
            isCompleted: false,
            tags: ['reflection', 'low-energy'],
            energyLevel: 'low',
            goalId: latestGoal.id,
            milestoneId: firstMilestone.id
          });
        } else if (currentEnergy === 'medium') {
          // For medium energy, suggest moderate tasks
          tasks.push({
            id: uuidv4(),
            title: `Work on one step toward "${latestGoal.title}"`,
            description: 'Choose an achievable task that moves you forward',
            isCompleted: false,
            tags: ['action', 'medium-energy'],
            energyLevel: 'medium',
            goalId: latestGoal.id,
            milestoneId: firstMilestone.id
          });
        } else {
          // For high energy, suggest challenging tasks
          tasks.push({
            id: uuidv4(),
            title: `Make significant progress on "${latestGoal.title}"`,
            description: 'Use your high energy to tackle something challenging',
            isCompleted: false,
            tags: ['challenge', 'high-energy'],
            energyLevel: 'high',
            goalId: latestGoal.id,
            milestoneId: firstMilestone.id
          });
        }
      }
    }
    
    return tasks;
  }, [activeGoals, userMemory.currentEnergyLevel]);
  
  // Prioritize tasks based on user's energy level
  const prioritizedTasks = useMemo(() => {
    if (!userMemory.currentEnergyLevel) {
      return todaysTasks;
    }
    
    // Create a copy to avoid mutating the original
    const sortedTasks = [...todaysTasks];
    
    // Sort tasks by matching energy level
    sortedTasks.sort((a, b) => {
      // If task energy level matches user energy level, it gets highest priority
      if (a.energyLevel === userMemory.currentEnergyLevel && b.energyLevel !== userMemory.currentEnergyLevel) {
        return -1;
      }
      if (a.energyLevel !== userMemory.currentEnergyLevel && b.energyLevel === userMemory.currentEnergyLevel) {
        return 1;
      }
      
      // For low energy users, prioritize low energy tasks
      if (userMemory.currentEnergyLevel === 'low') {
        if (a.energyLevel === 'low' && b.energyLevel !== 'low') return -1;
        if (a.energyLevel !== 'low' && b.energyLevel === 'low') return 1;
        if (a.energyLevel === 'medium' && b.energyLevel === 'high') return -1;
        if (a.energyLevel === 'high' && b.energyLevel === 'medium') return 1;
      }
      
      // For high energy users, prioritize high energy tasks
      if (userMemory.currentEnergyLevel === 'high') {
        if (a.energyLevel === 'high' && b.energyLevel !== 'high') return -1;
        if (a.energyLevel !== 'high' && b.energyLevel === 'high') return 1;
        if (a.energyLevel === 'medium' && b.energyLevel === 'low') return -1;
        if (a.energyLevel === 'low' && b.energyLevel === 'medium') return 1;
      }
      
      return 0;
    });
    
    return sortedTasks;
  }, [todaysTasks, userMemory.currentEnergyLevel]);
  
  if (activeGoals.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
        <h2 className="text-lg font-semibold text-owl-navy mb-4">Today's Focus</h2>
        <div className="bg-owl-yellow/20 rounded-xl p-4">
          <p className="text-owl-navy">Share your goals with your mentor to see personalized daily tasks.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
      <h2 className="text-lg font-semibold text-owl-navy mb-4">Today's Focus</h2>
      
      {prioritizedTasks.length > 0 ? (
        <div className="bg-owl-yellow/20 rounded-xl p-4">
          {userMemory.currentEnergyLevel && (
            <div className="mb-3 text-sm text-owl-navy/70">
              Tasks prioritized for your {userMemory.currentEnergyLevel} energy level today
            </div>
          )}
          {prioritizedTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onComplete={completeTask} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-owl-yellow/20 rounded-xl p-4">
          <p className="text-owl-navy">All tasks for today are complete! Talk with your mentor to set new goals.</p>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        {format(new Date(), 'EEEE, MMMM d, yyyy')}
      </div>
    </div>
  );
};

export default TodaysFocus; 