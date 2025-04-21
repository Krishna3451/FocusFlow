import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateMentorResponse, GeminiMessage } from '../services/geminiApi';
import { extractGoalFromMessage, generateInitialMilestones, extractTaskFeedback } from '../utils/mentorUtils';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline?: Date;
  keyMotivators: string[];
  milestones: Milestone[];
  createdAt: Date;
  isActive: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  deadline?: Date;
  tasks: Task[];
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  isCompleted: boolean;
  tags: string[];
  energyLevel?: 'low' | 'medium' | 'high'; // How much energy is required for this task
}

type MentorMode = 'coaching' | 'therapist' | 'brainstorming';
type MoodLevel = 'sad' | 'neutral' | 'happy' | 'very-happy' | 'excellent';
type EnergyLevel = 'low' | 'medium' | 'high';

interface UserMemory {
  completedTasks: number;
  missedTasks: number;
  preferredTimeOfDay?: string;
  responseToFailure?: string;
  responseToSuccess?: string;
  commonObstacles: string[];
  strengths: string[];
  challengeAreas: string[];
  currentMood?: MoodLevel;
  currentEnergyLevel?: EnergyLevel;
  lastActiveDate?: string;
}

interface MentorContextType {
  messages: Message[];
  isTyping: boolean;
  activeGoals: Goal[];
  currentMode: MentorMode;
  userMemory: UserMemory;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'isActive'>) => void;
  updateGoal: (goal: Goal) => void;
  completeTask: (goalId: string, milestoneId: string, taskId: string) => void;
  setUserMood: (mood: MoodLevel) => void;
  setUserEnergyLevel: (level: EnergyLevel) => void;
}

const MentorContext = createContext<MentorContextType | undefined>(undefined);

interface MentorProviderProps {
  children: ReactNode;
}

// Enhanced system prompt to guide Gemini's behavior
const MENTOR_SYSTEM_PROMPT = 
  "You are Wise Owl Coach, a supportive and insightful mentor with specific behavior modes. " +
  
  "GENERAL GUIDELINES: " +
  "- Be warm, empathetic, and encouraging while providing practical advice. " +
  "- Guide the user to discover their own insights rather than just providing answers. " +
  "- Maintain a positive, growth-oriented mindset, and acknowledge efforts and progress. " +
  "- Respond concisely in 2-3 sentences when appropriate. " +
  
  "MODES OF OPERATION: " +
  "1. COACHING MODE (default): " +
  "- Ask open questions about goals ('What's a big goal you care about right now?') " +
  "- Clarify vague goals ('How would you define \"be better at fitness\"?') " +
  "- Help break down goals into milestones and daily tasks " +
  "- Follow up on progress and adjust as needed " +
  "- Adjust task recommendations based on user's current energy level " +
  
  "2. THERAPIST MODE: " +
  "- Activated when user expresses stress, anxiety, overwhelm, or emotional challenges " +
  "- Focus on emotional support and reflection " +
  "- Ask about feelings and provide validation " +
  "- Offer mindfulness or perspective-taking exercises " +
  
  "3. BRAINSTORMING MODE: " +
  "- Activated when user requests ideas, solutions, or creative thinking " +
  "- Generate multiple approaches to problems " +
  "- Ask questions that stimulate lateral thinking " +
  "- Provide structured frameworks for decision-making " +
  
  "HANDLING FAILURES: " +
  "- When tasks are missed, ask reflective questions ('What got in the way?') " +
  "- Suggest new approaches ('Would breaking tasks into smaller steps help?') " +
  "- Adapt to patterns you notice in the user's behavior " +
  
  "ENERGY LEVEL AWARENESS: " +
  "- When user has low energy, suggest easier tasks and self-care " +
  "- When user has high energy, recommend more challenging tasks " +
  "- Always acknowledge and adapt to the user's current emotional state " +
  
  "You're designed to help users achieve their personal and professional goals through thoughtful guidance. Adapt your responses based on the user's needs and current context.";

// Get stored data from localStorage or use defaults
const getStoredGoals = (): Goal[] => {
  try {
    const stored = localStorage.getItem('wise_owl_goals');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading goals from storage:', error);
    return [];
  }
};

const getStoredMemory = (): UserMemory => {
  try {
    const stored = localStorage.getItem('wise_owl_memory');
    return stored ? JSON.parse(stored) : {
      completedTasks: 0,
      missedTasks: 0,
      commonObstacles: [],
      strengths: [],
      challengeAreas: []
    };
  } catch (error) {
    console.error('Error loading memory from storage:', error);
    return {
      completedTasks: 0,
      missedTasks: 0,
      commonObstacles: [],
      strengths: [],
      challengeAreas: []
    };
  }
};

export const MentorProvider: React.FC<MentorProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your Wise Owl Coach. What's a goal you're working on right now?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeGoals, setActiveGoals] = useState<Goal[]>(getStoredGoals);
  const [currentMode, setCurrentMode] = useState<MentorMode>('coaching');
  const [userMemory, setUserMemory] = useState<UserMemory>(getStoredMemory);

  // Check if this is a new day and reset daily state if needed
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (userMemory.lastActiveDate !== today) {
      setUserMemory(prev => ({
        ...prev,
        currentEnergyLevel: undefined,
        currentMood: undefined,
        lastActiveDate: today
      }));
    }
  }, []);

  // Save goals and memory to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('wise_owl_goals', JSON.stringify(activeGoals));
  }, [activeGoals]);

  useEffect(() => {
    localStorage.setItem('wise_owl_memory', JSON.stringify(userMemory));
  }, [userMemory]);

  // Process user message for goals and feedback
  const processUserMessage = useCallback((content: string) => {
    // Try to extract goal from message
    const potentialGoal = extractGoalFromMessage(content);
    
    if (potentialGoal && potentialGoal.title) {
      // Create milestones for the new goal
      const milestones = generateInitialMilestones(potentialGoal.title);
      
      // Add the complete goal
      addGoal({
        ...potentialGoal,
        milestones,
        keyMotivators: potentialGoal.keyMotivators || []
      });
    }
    
    // Look for task feedback in the message
    const feedback = extractTaskFeedback(content);
    
    if (!feedback.wasCompleted && feedback.obstacles.length > 0) {
      // Update user memory with obstacles
      setUserMemory(prev => {
        const updatedObstacles = [...prev.commonObstacles];
        
        // Add new obstacle if it's not already in the list
        if (!updatedObstacles.includes(feedback.obstacles[0])) {
          updatedObstacles.push(feedback.obstacles[0]);
        }
        
        return {
          ...prev,
          missedTasks: prev.missedTasks + 1,
          commonObstacles: updatedObstacles.slice(0, 5) // Keep only the 5 most recent obstacles
        };
      });
    }
  }, []);

  // Detect mode switches based on user input
  const detectMode = useCallback((userMessage: string): MentorMode => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for therapist mode triggers
    if (
      lowerMessage.includes("stressed") || 
      lowerMessage.includes("anxious") || 
      lowerMessage.includes("overwhelmed") || 
      lowerMessage.includes("depressed") || 
      lowerMessage.includes("sad") || 
      lowerMessage.includes("worried") ||
      lowerMessage.includes("frustrated")
    ) {
      return 'therapist';
    }
    
    // Check for brainstorming mode triggers
    if (
      lowerMessage.includes("brainstorm") || 
      lowerMessage.includes("ideas for") || 
      lowerMessage.includes("help me think") || 
      lowerMessage.includes("creative solutions") || 
      lowerMessage.includes("different approaches")
    ) {
      return 'brainstorming';
    }
    
    // Default to coaching mode
    return 'coaching';
  }, []);

  // Function to convert our app messages to Gemini format
  const convertToGeminiMessages = useCallback((appMessages: Message[]): GeminiMessage[] => {
    // Create enhanced system message that includes user's goals and memory
    const enhancedPrompt = 
      `${MENTOR_SYSTEM_PROMPT}\n\n` +
      `USER CONTEXT:\n` +
      `Current mode: ${currentMode}\n` +
      `Current mood: ${userMemory.currentMood || 'Unknown'}\n` +
      `Current energy level: ${userMemory.currentEnergyLevel || 'Unknown'}\n` +
      `Active goals: ${activeGoals.map(g => g.title).join(', ') || 'None yet'}\n` +
      `User memory: Completed ${userMemory.completedTasks} tasks, missed ${userMemory.missedTasks} tasks\n` +
      `Common obstacles: ${userMemory.commonObstacles.join(', ') || 'Unknown'}\n` +
      `Strengths: ${userMemory.strengths.join(', ') || 'Unknown'}\n` +
      `Challenge areas: ${userMemory.challengeAreas.join(', ') || 'Unknown'}\n`;
    
    const systemMessage: GeminiMessage = {
      role: 'model',
      parts: [{ text: enhancedPrompt }]
    };

    const conversationMessages: GeminiMessage[] = appMessages.map(msg => ({
      role: msg.isUser ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    return [systemMessage, ...conversationMessages];
  }, [activeGoals, currentMode, userMemory]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    // Process the message for goals and task feedback
    processUserMessage(content);

    // Detect if we should switch modes based on the message
    const detectedMode = detectMode(content);
    if (detectedMode !== currentMode) {
      setCurrentMode(detectedMode);
    }

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Prepare messages for Gemini API including the new user message
      const updatedMessages = [...messages, userMessage];
      const geminiMessages = convertToGeminiMessages(updatedMessages);

      // Get response from Gemini API
      const aiResponseText = await generateMentorResponse(geminiMessages);

      // Add AI response
      const aiMessage: Message = {
        id: uuidv4(),
        content: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting mentor response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        content: "I'm having trouble connecting right now. Could we try again in a moment?",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, convertToGeminiMessages, currentMode, detectMode, processUserMessage]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: uuidv4(),
        content: "Hi there! I'm your Wise Owl Coach. What's a goal you're working on right now?",
        isUser: false,
        timestamp: new Date(),
      }
    ]);
  }, []);

  const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'createdAt' | 'isActive'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: uuidv4(),
      createdAt: new Date(),
      isActive: true
    };
    
    setActiveGoals(prev => [...prev, newGoal]);
  }, []);

  const updateGoal = useCallback((updatedGoal: Goal) => {
    setActiveGoals(prev => 
      prev.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal)
    );
  }, []);

  const completeTask = useCallback((goalId: string, milestoneId: string, taskId: string) => {
    setActiveGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      
      const updatedMilestones = goal.milestones.map(milestone => {
        if (milestone.id !== milestoneId) return milestone;
        
        const updatedTasks = milestone.tasks.map(task => 
          task.id === taskId ? { ...task, isCompleted: true } : task
        );
        
        // Check if all tasks are completed to mark milestone as completed
        const allTasksCompleted = updatedTasks.every(task => task.isCompleted);
        
        return {
          ...milestone,
          tasks: updatedTasks,
          isCompleted: allTasksCompleted
        };
      });
      
      return {
        ...goal,
        milestones: updatedMilestones
      };
    }));
    
    // Update user memory
    setUserMemory(prev => ({
      ...prev,
      completedTasks: prev.completedTasks + 1
    }));
  }, []);

  const setUserMood = useCallback((mood: MoodLevel) => {
    setUserMemory(prev => ({
      ...prev,
      currentMood: mood,
      lastActiveDate: new Date().toISOString().split('T')[0]
    }));
  }, []);

  const setUserEnergyLevel = useCallback((level: EnergyLevel) => {
    setUserMemory(prev => ({
      ...prev,
      currentEnergyLevel: level,
      lastActiveDate: new Date().toISOString().split('T')[0]
    }));
  }, []);

  return (
    <MentorContext.Provider 
      value={{ 
        messages, 
        isTyping, 
        activeGoals,
        currentMode,
        userMemory,
        sendMessage, 
        clearMessages,
        addGoal,
        updateGoal,
        completeTask,
        setUserMood,
        setUserEnergyLevel
      }}
    >
      {children}
    </MentorContext.Provider>
  );
};

export const useMentor = (): MentorContextType => {
  const context = useContext(MentorContext);
  if (!context) {
    throw new Error('useMentor must be used within a MentorProvider');
  }
  return context;
}; 