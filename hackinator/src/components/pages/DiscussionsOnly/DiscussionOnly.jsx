'use client';

import { useState, useEffect } from 'react';
import { FiMenu, FiChevronLeft } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function DiscussionsOnly() {
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
   <div>
      {/* Bottom-Centered Link */}
      <div className="flex justify-center mb-4 mt-2">
        <Link href="/flow/flow-readme">
          <div className="bg-white/30 hover:bg-white/50 backdrop-blur-md text-black py-2 px-4 rounded-lg w-full text-center font-medium shadow-sm transition duration-200 cursor-pointer">
            Next Page
          </div>
        </Link>
      </div>
      
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

            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="flex flex-col flex-1">
          {/* Header */}
            <div className="px-5 py-3 text-white text-md bg-white/10 backdrop-blur-xl border-b border-white/20 font-semibold shadow-md">
              Hackinator
            </div>


          {/* Selected Topic Display */}
          {selectedTopic && (
            <div className="bg-white/5 text-white px-6 py-4 border-b border-white/20">
              <h2 className="text-lg font-semibold">💡 Topic: {selectedTopic.title}</h2>
              <p className="text-sm text-gray-300">{selectedTopic.description}</p>
            </div>
          )}

          {/* Messages */}
          <div
            id="chat-messages"
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-transparent text-sm text-white backdrop-blur-xl"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-4 py-3 max-w-xs rounded-xl ${msg.role === 'user' ? 'bg-white/20 text-white' : 'bg-white/15 text-gray-100'}`}
                >
                  <div>{msg.content}</div>
                  <div className="text-[11px] mt-1 text-right text-gray-300">
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white/15 text-gray-300 px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                  Hackii is typing...
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="px-6 py-4 bg-white/10 backdrop-blur-xl border-t border-white/20">
            <div className="flex flex-col gap-2">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full p-3 pr-16 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/20 text-white px-5 py-2 rounded-full text-xs transition duration-200 backdrop-blur-sm"
                >
                  Send
                </button>
              </div>
              <div className="flex items-center gap-2 text-white text-sm pl-2">
                <input type="radio" id="research" name="mode" />
                <label htmlFor="research">Research</label>
              </div>
            </div>
          </div>  
        </div>
      </div>
    </div>
    
   </div>
  );
}
