import React, { useRef, useEffect, useState } from 'react';
import MessageBubble, { TypingIndicator } from './MessageBubble';
import { useMentor } from '../../context/MentorContext';

const ChatWindow: React.FC = () => {
  const { messages, isTyping, sendMessage } = useMentor();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Send message through context
    await sendMessage(inputValue);
    setInputValue('');
  };
  
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-card h-[600px] lg:h-[calc(100vh-10rem)] w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="border-t border-owl-blue/10 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Share your thoughts or ask me a question..."
            className="flex-1 border border-owl-blue/20 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-owl-blue/50 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="bg-owl-blue hover:bg-owl-blue/80 text-owl-navy font-medium rounded-full px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
