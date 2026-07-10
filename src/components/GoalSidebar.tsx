import React, { useState } from 'react';
import { Goal, SavingsLog } from '../types';
import { Target, Flag, FolderHeart, Calendar, TrendingUp, Sparkles, AlertCircle, Trash2, Trophy, Clock, Landmark } from 'lucide-react';

interface GoalSidebarProps {
  goals: Goal[];
  logs: SavingsLog[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onDeleteAllGoals: () => void;
}

export const GoalSidebar: React.FC<GoalSidebarProps> = ({
  goals,
  logs,
  categories,
  selectedCategory,
  onSelectCategory,
  onDeleteCategory,
  onDeleteAllGoals
}) => {
  const activeGoals = goals.filter(g => g.currentAmount < g.targetAmount);
  const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount);

  // Calculate global savings
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const globalProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  // Get last 5 activity logs
  const sortedLogs = [...logs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col h-full gap-5 p-1">
      {/* Platform Welcome Header */}
      <div className="py-2 px-3 rounded-xl bg-linear-to-br from-emerald-600 to-emerald-700 text-white shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-[7.5px] bg-white/20 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            Махзан
          </span>
        </div>
        <h2 className="font-black text-xs tracking-tight mb-0.5 text-white">
          Сандуқи Ҳадафҳо
        </h2>
        <p className="text-emerald-100/90 text-[9px] leading-tight">
          Пасандозҳои худро идора кунед ва муваффақият ба даст оред.
        </p>

        {/* Global Progress mini bar */}
        {goals.length > 0 && (
          <div className="mt-2 pt-1 border-t border-white/20">
            <div className="flex items-center justify-between text-[8px] font-extrabold text-white mb-0.5">
              <span>Пешравии Умумӣ</span>
              <span>{globalProgress}%</span>
            </div>
            <div className="w-full h-0.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${globalProgress}%` }} />
            </div>
            <div className="flex items-center justify-between text-[7.5px] text-emerald-100 font-bold mt-0.5">
              <span>Ҷамъ: {new Intl.NumberFormat('tg-TJ').format(totalSaved)} TJS</span>
              <span>Ҳадаф: {new Intl.NumberFormat('tg-TJ').format(totalTarget)} TJS</span>
            </div>
          </div>
        )}
      </div>

      {/* Goal Filtering Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FolderHeart className="w-4 h-4 text-slate-400" />
            Гурӯҳҳо
          </h3>
          <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
            {categories.length + 1}
          </span>
        </div>

        <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
          {/* All Goals Filter */}
          <button
            onClick={() => onSelectCategory('Ҳама')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'Ҳама'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <span>🎯</span>
              <span>Ҳамаи ҳадафҳо</span>
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
              selectedCategory === 'Ҳама' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {goals.length}
            </span>
          </button>

          {/* Individual Categories */}
          {categories.map((cat) => {
            const count = goals.filter(g => g.category === cat).length;
            const emojiMap: Record<string, string> = {
              'Нақлиёт': '🚗',
              'Хона': '🏠',
              'Хонаву Ҷой': '🏠',
              'Технология': '💻',
              'Саёҳат': '✈️',
              'Таҳсил': '🎓',
              'Дигар': '✨'
            };
            const catEmoji = emojiMap[cat] !== undefined ? emojiMap[cat] : '🏷️';
            
            return (
              <div key={cat} className="group/cat flex items-center gap-1">
                <button
                  onClick={() => onSelectCategory(cat)}
                  className={`flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {catEmoji && <span>{catEmoji}</span>}
                    <span className="truncate">{cat}</span>
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
                
                {/* Delete button for category (hidden for defaults unless customized) */}
                {!['Нақлиёт', 'Хонаву Ҷой', 'Технология', 'Саёҳат', 'Таҳсил', 'Дигар'].includes(cat) && (
                  <button
                    onClick={() => {
                      if (confirm(`Оё шумо мутмаин ҳастед, ки гурӯҳи "${cat}"-ро нест кунед?`)) {
                        onDeleteCategory(cat);
                      }
                    }}
                    className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-all opacity-0 group-hover/cat:opacity-100 cursor-pointer"
                    title="Нест кардани гурӯҳ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="space-y-3 flex-1 flex flex-col min-h-[180px]">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-1">
          <Clock className="w-4 h-4 text-slate-400" />
          Фаъолияти охирин
        </h3>

        <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 p-3 overflow-y-auto space-y-2 max-h-[220px]">
          {sortedLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <p className="text-[11px] font-extrabold text-slate-400">Ягон ҳаракат нест</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Ҳангоми пасандоз намудан дар инҷо сабтҳо пайдо мешаванд.</p>
            </div>
          ) : (
            sortedLogs.map((log) => {
              const associatedGoal = goals.find(g => g.id === log.goalId);
              const isPositive = log.amount >= 0;
              return (
                <div key={log.id} className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs text-[11px]">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-extrabold text-slate-800 truncate" title={log.description}>
                      {log.description}
                    </span>
                    <span className={`font-black font-mono flex-shrink-0 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPositive ? '+' : ''}{log.amount} {associatedGoal?.currency || 'TJS'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                    <span className="truncate max-w-[100px]">
                      {associatedGoal ? `${associatedGoal.emoji} ${associatedGoal.title}` : 'Ҳадафи нестшуда'}
                    </span>
                    <span className="font-mono">
                      {new Date(log.date).toLocaleDateString('tg-TJ', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Delete All Goals Button */}
      {goals.length > 0 && (
        <button
          type="button"
          onClick={() => {
            if (confirm('Оё шумо мутмаин ҳастед, ки мехоҳед ҲАМАИ ҳадафҳо ва таърихи пасандозҳоро нест кунед? Ин амалро барқарор кардан намешавад.')) {
              onDeleteAllGoals();
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-xs font-extrabold hover:bg-rose-100/70 hover:text-rose-700 transition-all shadow-3xs cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Тоза кардани ҳамаи маълумот</span>
        </button>
      )}
    </div>
  );
};
