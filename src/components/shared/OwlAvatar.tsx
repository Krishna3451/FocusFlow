
import React from 'react';

interface OwlAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  isThinking?: boolean;
}

const OwlAvatar: React.FC<OwlAvatarProps> = ({ size = 'md', isThinking = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center rounded-full bg-owl-yellow overflow-hidden ${isThinking ? 'animate-pulse' : 'animate-subtle-bounce'}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/4 h-3/4 text-owl-navy"
      >
        <path
          d="M12 3C7.58172 3 4 6.58172 4 11C4 12.8273 4.60879 14.5167 5.64728 15.8614C5.77366 16.0141 5.89081 16.173 6 16.3368V21L8.5 18.5L9.04343 18.1859C9.95398 18.7083 10.9535 19.0666 12.0245 19.2112C12.0082 19.055 12 18.8957 12 18.7333C12 16.1111 14.0222 14 16.5333 14C17.5502 14 18.495 14.3173 19.2779 14.866C19.7332 13.6976 20 12.4301 20 11C20 6.58172 16.4183 3 12 3Z"
          className="fill-owl-navy"
        />
        <circle cx="9" cy="10" r="1.5" className="fill-white" />
        <circle cx="15" cy="10" r="1.5" className="fill-white" />
        {isThinking && (
          <path
            d="M12 14C13.1046 14 14 13.1046 14 12H10C10 13.1046 10.8954 14 12 14Z"
            className="fill-white animate-blink"
          />
        )}
        {!isThinking && (
          <path
            d="M9 13.5C10.6569 13.5 12 13.1046 12 12.5C12 11.8954 10.6569 12 9 12C7.34315 12 6 12.3954 6 13C6 13.6046 7.34315 13.5 9 13.5Z"
            className="fill-white"
            transform="rotate(10, 9, 12.5)"
          />
        )}
      </svg>
    </div>
  );
};

export default OwlAvatar;
