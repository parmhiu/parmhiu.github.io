import React from 'react';
import { Sidebar } from './Sidebar';
import { useSettings } from './SettingsContext';
import { Key, LayoutDashboard, Mic2, Edit3, History as HistoryIcon, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { aiProvider, geminiKey, openAiKey, deepseekKey } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const hasKey = 
    (aiProvider === 'gemini' && geminiKey) || 
    (aiProvider === 'openai' && openAiKey) || 
    (aiProvider === 'deepseek' && deepseekKey);

  if (!hasKey && location.pathname !== '/settings') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--background)] p-6">
        <div className="glass-card rounded-3xl p-10 max-w-md w-full text-center shadow-xl animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Key className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3">API Key Required</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Please enter your {aiProvider === 'gemini' ? 'Google Gemini' : aiProvider === 'openai' ? 'OpenAI' : 'DeepSeek'} API key in the settings to start using the AI English Coach.
          </p>
          <button 
            onClick={() => navigate('/settings')}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
          >
            Go to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-m-background md:bg-[var(--background)] selection:bg-indigo-200 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-6 pb-28 px-4 md:px-10 md:pt-8 md:pb-8 relative bg-m-background md:bg-transparent text-m-on-surface md:text-[inherit]">
        <div 
          key={location.pathname} 
          className="max-w-6xl mx-auto w-full h-full pb-10 animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both"
        >
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-[env(safe-area-inset-bottom)] bg-m-surface-container-low/80 backdrop-blur-xl border-t border-white/12 rounded-t-xl shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        {[
          { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
          { name: 'Speaking', icon: Mic2, path: '/speaking' },
          { name: 'Writing', icon: Edit3, path: '/writing' },
          { name: 'History', icon: HistoryIcon, path: '/history' },
          { name: 'Settings', icon: SettingsIcon, path: '/settings' },
        ].map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <div 
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center transition-all duration-200 tap-highlight-transparent cursor-pointer flex-1 ${
                isActive 
                  ? 'text-m-primary drop-shadow-[0_0_8px_rgba(208,188,255,0.6)] scale-110' 
                  : 'text-m-on-surface-variant/60 hover:text-m-primary/80'
              }`}
            >
              <Icon className={isActive ? "fill-m-primary" : ""} size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-label-sm text-[10px] mt-1 line-clamp-1">{item.name}</span>
            </div>
          );
        })}
      </nav>

    </div>
  );
};
