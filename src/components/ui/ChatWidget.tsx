'use client';
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', type: 'bot', text: 'Hi there! Welcome to Vitafoam. How can I help you get better sleep today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { id: Date.now().toString(), type: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Simulate bot reply
    setTimeout(() => {
      setMessages([...newMessages, { 
        id: (Date.now() + 1).toString(), 
        type: 'bot', 
        text: "Thanks for your message! Our sleep experts will be with you shortly. In the meantime, have you tried our Sleep Quiz to find your perfect match?" 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open Chat"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden transition-all duration-300 z-50 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}>
        
        {/* Header */}
        <div className="bg-primary text-white p-4 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">Support Chat</h3>
            <p className="text-xs text-white/80 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
            </p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 custom-scrollbar">
          <div className="text-center text-xs text-gray-400 my-2">Today</div>
          {messages.map(msg => (
            <div key={msg.id} className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-primary text-white self-end rounded-tr-sm' : 'bg-white border border-border text-text-primary self-start rounded-tl-sm shadow-sm'}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-border">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-gray-100 border-none rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 transition-opacity"
            >
              <Send size={14} className="-ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
