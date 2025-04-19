'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ChatInterface() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic');
  const selectedTopic = topicParam ? JSON.parse(decodeURIComponent(topicParam)) : null;

  const dummyPitch = {
    pros: ['Scalable architecture', 'Clean UI', 'Fast response time'],
    cons: ['Lacks authentication', 'Limited mobile support'],
    questions: ['How is state managed?', 'Is it SEO optimized?']
  };

  const renderSection = (title, items) => (
<div className="min-w-0 w-[30%]">
  <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
  <table className="min-w-full bg-transparent rounded-lg shadow-md border border-gray-600">
    <thead>
      <tr className="border-b border-gray-500">
        <th className="px-5 py-3 text-left text-lg font-medium text-gray-200">Item</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item, idx) => (
        <tr key={idx} className="hover:bg-gray-700 transition-all">
          <td className="px-5 py-3 text-sm text-gray-300">{item}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );

  return (
    <div className="w-[950px] h-[650px] flex justify-center items-center">
      <div className="flex w-full max-w-6xl h-full rounded-lg overflow-hidden shadow-xl text-gray-200 bg-slate-900/40 backdrop-blur-lg">

        {/* Pitch Display Area */}
        <div className="flex flex-col flex-1 bg-transparent">
          <div className="px-5 py-3 text-white text-md bg-white/10 backdrop-blur-xl border-b border-white/20 font-semibold shadow-md">
            Hackinator Pitch Analysis
          </div>

          {/* First Row for Pros and Cons */}
          <div className="flex flex-row justify-center items-start flex-1 p-6 overflow-y-auto space-x-8 flex-nowrap max-h-max">
            {renderSection('Pros', dummyPitch.pros)}
            {renderSection('Cons', dummyPitch.cons)}
          </div>

          {/* Second Row for Questions (displayed as a list) */}
          <div className="min-w-0 w-[30%] p-6 mt-6">
            <h2 className="text-xl font-bold text-white mb-2">Questions</h2>
            <ul className="list-disc list-inside text-white/90">
              {dummyPitch.questions.map((item, idx) => (
                <li key={idx} className="mb-1">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
