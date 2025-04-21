import React, { useState, useRef, useEffect } from 'react';
import MessageBubble, { TypingIndicator } from './MessageBubble';
import { Message } from '../../context/MentorContext';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '../../hooks/use-toast';

// Direct Gemini API call
async function askGemini(messages: Message[]): Promise<any> {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('Missing Gemini API key');
  }

  // Prepare prompt for Gemini
  const prompt = [
    "You are a caring mentor helping users clarify their goals. Always:",
    "• Ask open, reflective questions to uncover goals and motivation.",
    "• Clarify and get specific if user's goals are vague.",
    "• When you feel the user has shared a goal or commitment, output a JSON object with keys: GOAL, DEADLINE, KEY_MOTIVATORS. Otherwise continue the conversation.",
    "",
    "Conversation so far:",
    ...messages.map(m => (m.isUser ? `User: ${m.content}` : `Mentor: ${m.content}`)),
    "",
    'If a new goal is shared, output as JSON on a separate line (for example: {"GOAL":"Run a marathon", "DEADLINE":"2025-11-01", "KEY_MOTIVATORS":["Health","Challenge"]}), otherwise, keep chatting.'
  ].join("\n");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    const content = data.candidates[0]?.content?.parts[0]?.text;
    
    if (!content) {
      throw new Error('No content in Gemini response');
    }

    // Try to find a JSON object in the output for structured goals
    let structured = null;
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      try {
        structured = JSON.parse(jsonMatch[0]);
      } catch (err) {
        console.error("Error parsing JSON from response:", err);
      }
    }

    return { message: content, structured };
  } catch (err: any) {
    console.error("Error calling Gemini:", err);
    throw err;
  }
}

const ChatWindow: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your Wise Owl Gemini Mentor. What's a big goal you care about right now?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isError, setIsError] = useState(false);
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
    setIsError(false);

    const userMessage: Message = {
      id: uuidv4(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await askGemini([...messages, userMessage]);
      
      const aiMessage: Message = {
        id: uuidv4(),
        content: response.message,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // If structured output provided by Gemini, show a toast
      if (response.structured?.GOAL) {
        toast({
          title: "New Goal Identified",
          description: `Goal: "${response.structured.GOAL}"`,
          variant: "default",
        });
      }
    } catch (err: any) {
      console.error("Error in chat:", err);
      setIsError(true);
      
      setMessages(prev => [
        ...prev,
        {
          id: uuidv4(),
          content: "Sorry, I'm having trouble connecting right now. Could you try again in a moment?",
          isUser: false,
          timestamp: new Date(),
        }
      ]);
      
      toast({
        title: "Connection Error",
        description: "Unable to reach the Gemini AI service. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-card h-[600px] lg:h-[calc(100vh-10rem)] w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        {isError && (
          <div className="text-center text-red-500 text-sm my-2">
            <p>Connection issue with Gemini AI. Please check your API key and try again.</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-owl-blue"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-6 py-2 bg-owl-blue text-owl-navy rounded-full font-medium hover:bg-owl-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTyping ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
