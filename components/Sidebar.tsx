import React from 'react';
import { BotCommand } from '../types';

interface SidebarProps {
  onCommand: (cmd: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCommand, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />
      
      {/* Sidebar Content */}
      <aside 
        className={`
          fixed top-0 right-0 h-full w-80 bg-slate-950 border-l border-slate-800 
          transform transition-transform duration-300 z-30
          flex flex-col shadow-2xl
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-mono text-neon font-bold tracking-tighter">
            ARCHITECT_OS v2.0
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            System Status: <span className="text-green-500">ONLINE</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Project Tools Section */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4 font-mono">
              Project Tools
            </h3>
            <div className="grid gap-3">
              <button 
                onClick={() => onCommand(BotCommand.SAVE_STATE)}
                className="group flex items-center justify-between p-3 rounded bg-slate-900 border border-slate-800 hover:border-neon/50 hover:bg-slate-850 transition-all text-left"
              >
                <span className="text-sm font-mono text-slate-300 group-hover:text-white">CheckPoint</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">XML</span>
              </button>

              <button 
                onClick={() => onCommand(BotCommand.BUILD)}
                className="group flex items-center justify-between p-3 rounded bg-slate-900 border border-slate-800 hover:border-neon/50 hover:bg-slate-850 transition-all text-left"
              >
                <span className="text-sm font-mono text-slate-300 group-hover:text-white">Build Project</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">.ps1</span>
              </button>

              <button 
                onClick={() => onCommand(BotCommand.TEXTBOOK)}
                className="group flex items-center justify-between p-3 rounded bg-slate-900 border border-slate-800 hover:border-neon/50 hover:bg-slate-850 transition-all text-left"
              >
                <span className="text-sm font-mono text-slate-300 group-hover:text-white">Textbook</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">MD</span>
              </button>
            </div>
          </div>

          {/* Protocols Section */}
          <div className="font-mono text-xs text-slate-400 border border-slate-800 p-4 rounded bg-slate-900/50">
             <h3 className="text-neon mb-2 font-bold">PROTOCOLS ACTIVE</h3>
             <ul className="space-y-2 list-disc pl-4">
                <li><span className="text-white">Zero Trust:</span> Logic verification required before execution.</li>
                <li><span className="text-white">Atomic Blocks:</span> Code guaranteed to be isolated.</li>
                <li><span className="text-white">BOM Safety:</span> PowerShell encoding checks active.</li>
             </ul>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/30">
           <div className="text-[10px] text-slate-600 font-mono text-center">
             SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}
           </div>
        </div>
      </aside>
    </>
  );
};