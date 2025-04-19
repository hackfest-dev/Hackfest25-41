'use client';
import { useState, useEffect } from 'react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { role: 'system', content: "Hi, I'm DeepSeek. How can I help you today?", time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = { role: 'user', content: input, time: new Date() };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'system', content: 'Thanks for your message!', time: new Date() }
      ]);
      setTyping(false);
    }, 1200);
  };

  useEffect(() => {
    const chatArea = document.getElementById('chat-messages');
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }, [messages, typing]);

  return (
    <div className="flex w-full ">
      {/* Sidebar */}
      <div className="w-64 p-5 border-r border-gray-200 bg-white flex flex-col">
        <button className="w-full p-3 mb-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          + New Chat
        </button>
        <h3 className="text-sm text-gray-500 mb-2 font-medium">Today</h3>
        <div className="space-y-2 text-sm text-gray-700 mb-6">
          <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">Designing ChatGPT UI</div>
          <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">Tally Chat Feature</div>
        </div>
        <h3 className="text-sm text-gray-500 mb-2 font-medium">30 Days</h3>
        <div className="space-y-2 text-sm text-gray-700 flex-1 overflow-y-auto">
          {[
            'React Collapsibles',
            'Responsive Layout Fixes',
            'Contact Page UX',
            'Networking Concepts',
            'DAA Tree Problems',
            '8086 CALL Instruction',
            'IP Addressing & Protocols'
          ].map((item, i) => (
            <div key={i} className="hover:bg-gray-100 p-2 rounded cursor-pointer">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-auto space-y-3 text-sm">
          <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">Get App</div>
          <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">My Profile</div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-semibold text-gray-800">DeepSeek Chat</h1>
        </div>

        {/* Messages */}
        <div
          id="chat-messages"
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-100"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-3 max-w-xs md:max-w-md rounded-xl shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-900 rounded-bl-none'
                }`}
              >
                <div>{msg.content}</div>
                <div className="text-xs text-gray-300 mt-1 text-right">
                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-500 px-4 py-2 rounded-xl shadow-sm max-w-xs">
                DeepSeek is typing...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="w-full p-4 pr-24 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
