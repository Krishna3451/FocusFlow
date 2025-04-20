import React from 'react';
import OwlAvatar from '../shared/OwlAvatar';
import { Message } from '../../context/MentorContext';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { content, isUser } = message;
  
  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="chat-bubble-user">
          <p>{content}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-start mb-4 gap-2">
      <div className="mt-1">
        <OwlAvatar size="sm" />
      </div>
      <div className="chat-bubble-mentor">
        <p>{content}</p>
      </div>
    </div>
  );
};

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start mb-4 gap-2">
      <div className="mt-1">
        <OwlAvatar size="sm" isThinking={true} />
      </div>
      <div className="chat-bubble-mentor typing-indicator">
        <span className="typing-dot animate-typing-dot-1"></span>
        <span className="typing-dot animate-typing-dot-2"></span>
        <span className="typing-dot animate-typing-dot-3"></span>
      </div>
    </div>
  );
};

export default MessageBubble;
