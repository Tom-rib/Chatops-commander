import React from 'react';
import ChatInterface from '../components/Chat/ChatInterface';

const Chat: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-2">Chat Assistant</h1>
        <p className="text-gray-400">Parlez à votre infrastructure en langage naturel</p>
      </div>
      
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Chat;