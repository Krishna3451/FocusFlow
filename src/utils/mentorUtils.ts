// Utility functions for mentor goal extraction and processing

import { Goal, Milestone, Task } from '../context/MentorContext';
import { v4 as uuidv4 } from 'uuid';

// Regular expressions for extracting goal-related information
const GOAL_PATTERN = /(?:my goal is|i want to|i would like to|i'd like to|i aim to|planning to|trying to|goal:|i need to)\s+(.+?)(?:\.|$)/i;
const DEADLINE_PATTERN = /(?:by|until|before|deadline is|due|complete by)\s+(.+?)(?:\.|$)/i;
const MOTIVATION_PATTERN = /(?:because|so that|in order to|as|motivation is|reason is|motivated by)\s+(.+?)(?:\.|$)/i;

/**
 * Attempts to extract structured goal information from a user message
 * @param message The user's message text
 * @returns Potential goal data if detected, or null if no goal is found
 */
export const extractGoalFromMessage = (message: string): Partial<Goal> | null => {
  // Extract potential goal statement
  const goalMatch = message.match(GOAL_PATTERN);
  if (!goalMatch) return null;
  
  const potentialGoal = goalMatch[1].trim();
  
  // Don't process very short goal statements (likely not actual goals)
  if (potentialGoal.length < 5) return null;
  
  // Extract deadline if present
  const deadlineMatch = message.match(DEADLINE_PATTERN);
  let deadline: Date | undefined = undefined;
  
  if (deadlineMatch) {
    const deadlineText = deadlineMatch[1].trim();
    
    // Try to parse common date formats and references
    if (deadlineText.toLowerCase().includes('week')) {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      deadline = date;
    } else if (deadlineText.toLowerCase().includes('month')) {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      deadline = date;
    } else if (deadlineText.toLowerCase().includes('tomorrow')) {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      deadline = date;
    } else {
      // Try to parse as a date
      const possibleDate = new Date(deadlineText);
      if (!isNaN(possibleDate.getTime())) {
        deadline = possibleDate;
      }
    }
  }
  
  // Extract motivation if present
  const motivationMatch = message.match(MOTIVATION_PATTERN);
  const keyMotivators: string[] = [];
  
  if (motivationMatch) {
    keyMotivators.push(motivationMatch[1].trim());
  }
  
  return {
    title: potentialGoal,
    description: potentialGoal,
    deadline,
    keyMotivators,
    milestones: [],
  };
};

/**
 * Creates a simple initial milestone structure for a new goal
 * @param goalTitle The main goal title to generate milestones for
 * @returns An array of milestone objects
 */
export const generateInitialMilestones = (goalTitle: string): Milestone[] => {
  // Split the goal into simple milestones
  return [
    {
      id: uuidv4(),
      title: `Plan your approach to ${goalTitle}`,
      description: 'Create a specific plan with actionable steps',
      tasks: [
        {
          id: uuidv4(),
          title: 'Research methods and best practices',
          description: 'Find proven approaches for achieving this goal',
          isCompleted: false,
          tags: ['planning', 'research']
        },
        {
          id: uuidv4(),
          title: 'Define measurable success criteria',
          description: 'Create clear metrics to track progress',
          isCompleted: false,
          tags: ['planning', 'metrics']
        }
      ],
      isCompleted: false
    },
    {
      id: uuidv4(),
      title: 'Take first action step',
      description: 'Complete the first concrete action toward your goal',
      tasks: [
        {
          id: uuidv4(),
          title: `Take the first small step toward ${goalTitle}`,
          description: 'Start with something achievable to build momentum',
          isCompleted: false,
          tags: ['action', 'momentum']
        }
      ],
      isCompleted: false
    }
  ];
};

/**
 * Analyzes user message for feedback on completed or missed tasks
 * @param message The user's message
 * @returns Object containing detected obstacles and feedback
 */
export const extractTaskFeedback = (message: string): { 
  wasCompleted: boolean; 
  obstacles: string[]; 
} => {
  const lowerMessage = message.toLowerCase();
  
  // Check if message indicates task completion or failure
  const completionIndicators = ['completed', 'finished', 'done', 'accomplished', 'achieved', 'did it'];
  const failureIndicators = ['didn\'t do', 'couldn\'t do', 'failed', 'missed', 'skipped', 'forgot'];
  
  const wasCompleted = completionIndicators.some(indicator => lowerMessage.includes(indicator));
  const wasFailed = failureIndicators.some(indicator => lowerMessage.includes(indicator));
  
  // Extract potential obstacles
  const obstacles: string[] = [];
  const obstaclePatterns = [
    /(?:because|since|as|reason is)\s+(.+?)(?:\.|$)/i,
    /(?:got in the way|obstacle was|problem was|issue was)\s+(.+?)(?:\.|$)/i,
  ];
  
  if (wasFailed) {
    for (const pattern of obstaclePatterns) {
      const match = message.match(pattern);
      if (match) {
        obstacles.push(match[1].trim());
        break;
      }
    }
  }
  
  return {
    wasCompleted: wasCompleted && !wasFailed,
    obstacles
  };
}; 