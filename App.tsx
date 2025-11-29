import React, { useState, useEffect, useRef } from 'react';
import { Message, BotCommand, ChatState } from './types';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { Sidebar } from './components/Sidebar';

const App: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: true,
    error: null,
  });
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  // Initial greeting
  useEffect(() => {
    const startSession = async () => {
      try {
        const greeting = await initializeChat();
        setState(prev => ({
          ...prev,
          messages: [{
            id: 'init',
            role: 'model',
            text: greeting,
            timestamp: new Date()
          }],
          isLoading: false
        }));
      } catch (e) {
        setState(prev => ({
           ...prev, 
           isLoading: false, 
           error: "Failed to connect to Architect Core. Verify network/API Key."
        }));
      }
    };
    startSession();
  }, []);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || state.isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isLoading: true
    }));
    setInput('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMsg],
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Transmission failed."
      }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const appendFastTrack = () => {
    setInput(prev => {
        const spacer = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
        return prev + spacer + BotCommand.FAST_TRACK;
    });
    // Focus and resize
    setTimeout(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, 10);
  };

  const handleSidebarCommand = (cmd: string) => {
      handleSendMessage(cmd);
      // Close sidebar on mobile after command
      if (window.innerWidth < 1024) {
          setIsSidebarOpen(false);
      }
  };

  return (
    <div className="flex h-full w-full bg-slate-950 text-slate-200">
      
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full relative transition-all duration-300 lg:mr-80">
        
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-950/80 backdrop-blur justify-between z-10">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-neon rounded-full shadow-[0_0_10px_#39ff14]"></div>
             <h1 className="font-mono font-bold tracking-tight text-lg text-slate-100">
               ARCHITECT<span className="text-neon">.AI</span>
             </h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-neon border border-neon/30 rounded hover:bg-neon/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scroll-smooth">
          {state.messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {state.isLoading && (
            <div className="flex w-full mb-6 justify-start">
               <div className="p-4 rounded-lg bg-slate-850 border-l-2 border-neon text-neon font-mono text-sm animate-pulse">
                  ARCHITECT IS THINKING...
               </div>
            </div>
          )}
          {state.error && (
            <div className="flex w-full justify-center my-4">
                <span className="px-4 py-2 bg-red-900/20 border border-red-500 text-red-400 rounded text-sm font-mono">
                    ERROR: {state.error}
                </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-slate-950 border-t border-slate-800">
           <div className="max-w-4xl mx-auto relative flex flex-col gap-2">
             
             {/* Fast Track Button */}
             <div className="flex justify-end">
                <button 
                  onClick={appendFastTrack}
                  className="text-[10px] md:text-xs font-mono font-bold text-neon border border-neon/50 px-3 py-1 rounded bg-neon/5 hover:bg-neon/20 transition-colors uppercase tracking-widest flex items-center gap-2"
                  title="Skip negotiation loop"
                >
                  <span>⚡ Fast Track Protocol</span>
                </button>
             </div>

             <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputResize}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter command or architectural query..."
                  rows={1}
                  className="w-full bg-slate-900 text-slate-200 p-4 pr-12 rounded-lg border border-slate-700 focus:border-neon focus:ring-1 focus:ring-neon outline-none resize-none min-h-[56px] max-h-[200px] font-mono shadow-inner custom-scrollbar"
                />
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={state.isLoading || !input.trim()}
                  className="absolute bottom-3 right-3 p-2 text-slate-400 hover:text-neon disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
             </div>
             <div className="text-[10px] text-slate-600 font-mono pl-1">
               Shift+Enter for new line. Enter to execute.
             </div>
           </div>
        </div>
      </main>

      {/* Sidebar */}
      <Sidebar 
        onCommand={handleSidebarCommand} 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
    </div>
  );
};

export default App;