import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import TaskCard, { Task } from '../components/tasks/TaskCard';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'wise_owl_daily_tasks';

const TodaysFocus: React.FC = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Failed to parse saved tasks', error);
      }
    }
  }, []);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);
  
  // New task form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    goalTitle: '',
  });
  
  const handleComplete = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: true } : task
      )
    );
    
    toast({
      title: "Task completed!",
      description: "Great job making progress today!",
      variant: "default",
    });
  };
  
  const handleSkip = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    
    toast({
      title: "Task skipped",
      description: "No worries! You can come back to it later.",
      variant: "default",
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTask.title.trim() === '') {
      toast({
        title: "Task title required",
        description: "Please enter a title for your task",
        variant: "destructive",
      });
      return;
    }
    
    const task: Task = {
      id: uuidv4(),
      title: newTask.title,
      description: newTask.description,
      goalTitle: newTask.goalTitle || undefined,
      completed: false,
    };
    
    setTasks(prev => [...prev, task]);
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      goalTitle: '',
    });
    setShowAddForm(false);
    
    toast({
      title: "Task added",
      description: "Your new task has been added to today's focus",
      variant: "default",
    });
  };
  
  const handleClearCompletedTasks = () => {
    setTasks(prev => prev.filter(task => !task.completed));
    
    toast({
      title: "Completed tasks cleared",
      description: "All completed tasks have been removed",
      variant: "default",
    });
  };
  
  // Count completed tasks
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const hasCompletedTasks = completedTasks > 0;
  
  return (
    <MainLayout>
      <div className="mb-8">
        <div className="bg-owl-yellow/20 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-owl-navy mb-2">Today's Focus</h2>
          <p className="text-owl-navy/80">Add tasks you want to accomplish today. Focus on making small improvements each day.</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-card p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-owl-navy">Daily Progress</h3>
              <p className="text-sm text-owl-navy/70">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
            <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-owl-blue bg-white">
              <span className="text-2xl font-bold text-owl-navy">
                {totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions Row */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="bg-owl-blue hover:bg-owl-blue/80 text-white font-medium rounded-full px-6 py-3 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {showAddForm ? "Cancel" : "Add New Task"}
        </button>
        
        {hasCompletedTasks && (
          <button 
            onClick={handleClearCompletedTasks} 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-full px-6 py-3 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Clear Completed
          </button>
        )}
      </div>
      
      {/* Add Task Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <h3 className="text-lg font-medium text-owl-navy mb-4">Add a New Task</h3>
          <form onSubmit={handleAddTask}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-owl-navy mb-1">
                Task Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                className="w-full border border-owl-blue/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-owl-blue/50 focus:border-transparent"
                placeholder="What do you want to accomplish?"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-owl-navy mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                className="w-full border border-owl-blue/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-owl-blue/50 focus:border-transparent"
                placeholder="Add details about this task"
                rows={3}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="goalTitle" className="block text-sm font-medium text-owl-navy mb-1">
                Related Goal (Optional)
              </label>
              <input
                type="text"
                id="goalTitle"
                name="goalTitle"
                value={newTask.goalTitle}
                onChange={handleInputChange}
                className="w-full border border-owl-blue/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-owl-blue/50 focus:border-transparent"
                placeholder="Which goal is this task helping with?"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-owl-blue hover:bg-owl-blue/80 text-white font-medium rounded-lg px-6 py-2 transition-colors"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Task List */}
      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        ))}
      </div>
      
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-owl-navy mb-2">No tasks yet</h3>
          <p className="text-owl-navy/70 mb-4">Add some tasks to plan your day!</p>
          <button 
            onClick={() => setShowAddForm(true)} 
            className="bg-owl-blue hover:bg-owl-blue/80 text-white font-medium rounded-full px-6 py-3 transition-colors"
          >
            Add Your First Task
          </button>
        </div>
      )}
      
      <div className="mt-8 bg-white rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-owl-navy mb-3">Motivational Tip</h3>
        <blockquote className="border-l-4 border-owl-yellow pl-4 italic text-owl-navy/80">
          "The journey of a thousand miles begins with a single step. Every task you complete today is bringing you closer to your goals."
        </blockquote>
      </div>
    </MainLayout>
  );
};

export default TodaysFocus;
