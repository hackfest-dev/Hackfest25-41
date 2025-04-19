'use client';

import { useState, useEffect } from 'react';
import { FiMenu, FiChevronLeft } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ChatInterface() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic');
  const selectedTopic = topicParam ? JSON.parse(decodeURIComponent(topicParam)) : null;

  const [messages, setMessages] = useState([
    { role: 'system', content: "Hi, I'm Hackinator. How can I help you today?", time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    }, 1000);
  };

  useEffect(() => {
    const chatArea = document.getElementById('chat-messages');
    if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
  }, [messages, typing]);

  return (
    <div className="w-[950px] h-[650px] flex justify-center items-center">
      <div className="flex w-full max-w-6xl h-full rounded-lg overflow-hidden shadow-xl text-gray-200 bg-slate-900/40 backdrop-blur-lg">

        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'} bg-white/10 backdrop-blur-xl text-white flex flex-col items-center py-4 border-r border-white/20 relative`}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 mb-6 hover:bg-white/10 rounded-full transition duration-200"
          >
            {sidebarOpen ? <FiChevronLeft size={22} /> : <FiMenu size={22} />}
          </button>

          {/* Sidebar Content */}
          {sidebarOpen && (
            <div className="w-full text-sm flex flex-col flex-grow px-3">
              <div className="space-y-6">
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-2 px-4 rounded-lg w-full text-left font-medium shadow-sm transition duration-200">
                  New Chat
                </button>

                <div className="pt-2">
                  <div className="text-gray-300 uppercase text-xs tracking-wide mb-2">Recent Chats</div>
                  <div className="space-y-3">
                    {['Chat 1', 'Chat 2'].map((chat, idx) => (
                      <div
                        key={idx}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm py-2 px-4 rounded-lg text-white cursor-pointer transition-all duration-200 shadow-sm"
                      >
                        {chat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spacer to push link to bottom */}
              <div className="flex-grow"></div>

              {/* Bottom-Centered Link */}
              <div className="flex justify-center mb-4">
                <Link href="/flow/flow-readme">
                  <div className="bg-white/30 hover:bg-white/50 backdrop-blur-md text-black py-2 px-4 rounded-lg w-full text-center font-medium shadow-sm transition duration-200 cursor-pointer">
                    Next Page
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="flex flex-col flex-1">
          {/* Header */}
            <div className="px-5 py-3 text-white text-md bg-white/10 backdrop-blur-xl border-b border-white/20 font-semibold shadow-md">
              Hackinator
            </div>

            <div className="flex flex-row flex-1 justify-evenly items-center space-x-4">
                <div className=" text-white py-2 px-4 rounded-lg shadow-md cursor-pointer">
                    Pros
                </div>
                <div className=" text-white py-2 px-4 rounded-lg shadow-md cursor-pointer">
                    Cros
                </div>
                <div className=" text-white py-2 px-4 rounded-lg shadow-md cursor-pointer">
                    Questions
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
