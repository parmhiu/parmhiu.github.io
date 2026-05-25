import React, { useState } from 'react';
import { Calendar, ChevronRight, TrendingUp, Mic2, Edit3, MessageSquare, Bot, ChevronDown, History as HistoryIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

import { getHistory } from '../services/storage';
import type { HistoryItem } from '../services/storage';

const HistoryView = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  React.useEffect(() => {
    const hist = getHistory();
    setHistory(hist);
    
    const chartData = [...hist].reverse().map((item) => ({
      name: item.date.split(',')[0],
      score: item.score
    }));
    setData(chartData);
  }, []);

  const sessionsCount = history.length;
  const avgScore = sessionsCount ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / sessionsCount) : 0;

  return (
    <div className="animate-in fade-in duration-500 w-full h-full">
      {/* DESKTOP UI */}
      <div className="hidden md:block">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Practice History</h1>
          <p className="text-slate-500 dark:text-slate-400">Track your progress over time.</p>
        </div>

        {/* Chart Section */}
        <div className="glass-card rounded-3xl p-8 mb-10 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-500" /> Weekly Progress</h2>
            <span className="text-sm font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Last 7 Days</span>
          </div>
          
          <div className="h-64 w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-400">
                 <span className="text-3xl mb-2 block">📊</span>
                 <p>No data available to chart.</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <h2 className="text-xl font-bold mb-6">Recent Sessions</h2>
        
        {history.length > 0 ? (
          <div className="space-y-4 relative before:absolute before:inset-0 before:mx-auto before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
            {history.map((item) => (
              <div key={item.id} className="relative flex items-center justify-normal odd:flex-row-reverse group is-active">
                
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--background)] bg-indigo-500 text-white shadow shrink-0 order-1 group-odd:-translate-x-1/2 group-even:translate-x-1/2 z-10">
                  <Calendar className="w-4 h-4" />
                </div>

                <div className="w-[calc(50%-2.5rem)] glass-card p-6 rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all cursor-default group-hover:border-indigo-200 dark:group-hover:border-indigo-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400">{item.date}</span>
                    <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{item.type}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-4">{item.title}</h3>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex flex-col">
                       <span className="text-xs text-slate-400 font-semibold uppercase">Score</span>
                       <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xl">{item.score}</span>
                    </div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{item.focus}</span>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No past sessions found</h3>
            <p className="text-slate-500 dark:text-slate-400">Complete some practice sessions to see your history here.</p>
          </div>
        )}
      </div>

      {/* MOBILE UI */}
      <div className="md:hidden">
        <header className="mb-8">
          <h2 className="font-headline-lg-mobile text-[28px] text-m-on-surface mb-2">Practice History</h2>
          <p className="text-m-on-surface-variant/80 font-body-md text-[16px]">Your recent language evolution</p>
        </header>

        {/* Stats Overview Row */}
        <div className="grid grid-cols-2 gap-[16px] mb-8">
          <div className="glass-card-m light-leak p-[24px] rounded-xl">
            <p className="font-label-md text-[14px] text-m-on-surface-variant mb-1">Sessions</p>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-md text-[24px] text-m-primary">{sessionsCount}</span>
              <span className="text-m-tertiary font-label-sm text-[12px]">+12%</span>
            </div>
          </div>
          <div className="glass-card-m light-leak p-[24px] rounded-xl">
            <p className="font-label-md text-[14px] text-m-on-surface-variant mb-1">Avg Score</p>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-md text-[24px] text-m-secondary">{avgScore}%</span>
              <span className="text-m-on-surface-variant/40 font-label-sm text-[12px]">B2</span>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="flex flex-col gap-4">
          {history.length > 0 ? history.map((item, index) => {
            const isSpeaking = item.focus === 'Speaking';
            const primaryColorClass = isSpeaking ? 'text-m-primary' : 'text-m-secondary';
            const borderColorClass = isSpeaking ? 'border-m-primary/30' : 'border-m-secondary/30';
            const bgContainerClass = isSpeaking ? 'bg-m-primary-container/20' : 'bg-m-secondary-container/20';
            const gradientClass = isSpeaking ? 'from-m-primary to-m-secondary' : 'from-m-secondary to-m-tertiary';
            
            // Just some arbitrary logic to add styling for old items as seen in design
            const isOld = index > 2;
            const cardOpacity = isOld ? 'opacity-70' : '';
            const oldBgClass = isOld ? 'bg-m-surface-container-highest' : bgContainerClass;
            const oldBorderClass = isOld ? 'border-white/5' : borderColorClass;
            const oldIconColor = isOld ? 'text-m-on-surface-variant' : primaryColorClass;
            
            return (
              <div key={item.id} className={`glass-card-m light-leak p-[24px] rounded-xl flex items-center gap-4 transition-transform active:scale-[0.98] cursor-pointer ${cardOpacity}`}>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${oldBgClass} ${oldBorderClass} ${!isOld && isSpeaking ? 'neon-glow-purple' : ''}`}>
                  {isOld ? <HistoryIcon className={oldIconColor} size={24} /> : 
                   isSpeaking ? <Mic2 className={oldIconColor} size={24} /> : <Edit3 className={oldIconColor} size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-label-md text-[14px] text-m-on-surface font-bold truncate">{item.title}</h3>
                    <span className="text-[10px] font-label-sm uppercase tracking-wider text-m-on-surface-variant/60">
                      {item.date.split(',')[0]}
                    </span>
                  </div>
                  <p className="text-[13px] text-m-on-surface-variant line-clamp-1">{item.type}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-m-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full ${isOld ? 'bg-m-on-surface-variant' : `bg-gradient-to-r ${gradientClass}`}`} style={{width: `${item.score}%`}}></div>
                    </div>
                    <span className={`font-label-sm text-[12px] ${isOld ? 'text-m-on-surface-variant' : primaryColorClass}`}>{item.score}%</span>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="glass-card-m light-leak p-[24px] rounded-xl text-center text-m-on-surface-variant">
              No sessions found. Start practicing!
            </div>
          )}

          {/* Load More Button */}
          {history.length > 0 && (
            <button className="w-full py-4 text-m-primary font-label-md text-[14px] flex items-center justify-center gap-2 hover:opacity-80 transition-all">
              View All Sessions
              <ChevronDown size={20} />
            </button>
          )}
        </div>

        {/* AI Pulse Widget */}
        <div 
          className="fixed right-6 bottom-28 z-40 ai-pulse cursor-pointer"
          onClick={() => alert('LinguistAI: Ready to practice! What would you like to focus on?')}
        >
          <div className="w-14 h-14 bg-gradient-to-br from-m-primary to-m-secondary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(208,188,255,0.4)] border border-white/20">
            <Bot className="text-m-on-primary-container" size={28} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
