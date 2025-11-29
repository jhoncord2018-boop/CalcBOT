import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';
  
  // Simple parser to separate code blocks from text
  const renderContent = (text: string) => {
    // Regex to find ```code``` blocks
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Remove the backticks
        let content = part.slice(3, -3);
        // Extract language if present (e.g., ```python)
        let language = 'text';
        const firstLineBreak = content.indexOf('\n');
        if (firstLineBreak > -1) {
          const possibleLang = content.slice(0, firstLineBreak).trim();
          if (possibleLang && !possibleLang.includes(' ')) {
             language = possibleLang;
             content = content.slice(firstLineBreak + 1);
          }
        }
        
        return (
          <div key={index} className="my-4 rounded-md overflow-hidden border border-slate-700 bg-[#0c121e] shadow-lg">
             <div className="flex items-center justify-between px-3 py-1 bg-slate-800 border-b border-slate-700">
                <span className="text-xs font-mono text-neon uppercase opacity-80">{language}</span>
                <span className="text-[10px] text-slate-400">RAW</span>
             </div>
             <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
               {content}
             </pre>
          </div>
        );
      }
      
      // Render regular text with paragraphs
      return (
        <p key={index} className="whitespace-pre-wrap mb-2 leading-7">
          {part}
        </p>
      );
    });
  };

  return (
    <div className={`flex w-full mb-6 ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div 
        className={`
          max-w-[90%] md:max-w-[80%] lg:max-w-[70%] 
          p-4 md:p-6 rounded-lg 
          ${isModel 
            ? 'bg-slate-850 border-l-2 border-neon text-slate-200' 
            : 'bg-slate-800 border-r-2 border-slate-600 text-slate-100'}
          shadow-md
        `}
      >
        <div className="flex items-center mb-2 pb-2 border-b border-slate-700/50">
           <div className={`w-2 h-2 rounded-full mr-2 ${isModel ? 'bg-neon animate-pulse' : 'bg-slate-400'}`}></div>
           <span className="text-xs font-mono font-bold tracking-widest uppercase opacity-75">
             {isModel ? 'Architect AI' : 'Developer'}
           </span>
           <span className="ml-auto text-[10px] opacity-40 font-mono">
             {message.timestamp.toLocaleTimeString()}
           </span>
        </div>
        <div className="text-sm md:text-base font-sans">
          {renderContent(message.text)}
        </div>
      </div>
    </div>
  );
};