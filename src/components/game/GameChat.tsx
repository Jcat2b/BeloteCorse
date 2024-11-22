import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: number;
}

interface GameChatProps {
  gameId: string;
}

const GameChat: React.FC<GameChatProps> = ({ gameId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      userId: user.uid,
      userName: user.displayName || 'Anonyme',
      timestamp: Date.now(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.userId === user?.uid ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.userId === user?.uid
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p className="text-sm font-semibold mb-1">{message.userName}</p>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Votre message..."
            className="flex-1 rounded-md border border-gray-300 p-2 focus:border-primary-500 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameChat;