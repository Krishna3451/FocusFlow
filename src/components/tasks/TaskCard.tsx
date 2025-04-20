
import React, { useState } from 'react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  goalTitle?: string;
  completed: boolean;
}

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onSkip }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`bg-white rounded-2xl p-5 card-shadow ${task.completed ? 'bg-owl-mint/20 border border-owl-mint' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${task.completed ? 'text-owl-navy/50 line-through' : 'text-owl-navy'}`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`mt-1 text-sm ${task.completed ? 'text-owl-navy/50' : 'text-owl-navy/70'}`}>
              {task.description}
            </p>
          )}
          
          {task.goalTitle && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-owl-yellow/30 text-owl-navy">
                {task.goalTitle}
              </span>
            </div>
          )}
        </div>
        
        <div className={`flex gap-2 transition-opacity duration-300 ${(isHovered || task.completed) ? 'opacity-100' : 'opacity-0'}`}>
          {!task.completed ? (
            <>
              <button
                onClick={() => onComplete(task.id)}
                className="p-2 rounded-full bg-owl-mint/20 hover:bg-owl-mint/40 text-owl-navy transition-colors"
                title="Mark as completed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => onSkip(task.id)}
                className="p-2 rounded-full bg-owl-grey hover:bg-owl-grey/70 text-owl-navy transition-colors"
                title="Skip for now"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-owl-mint text-owl-navy">
              Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
