import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Goal, SavingsLog } from '../types';
import { Target, Calendar, Plus, Edit2, Trash2, CheckCircle2, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onQuickDeposit: (goalId: string, amount: number, description: string) => void;
  onSelect: (goal: Goal) => void;
  logs: SavingsLog[];
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onQuickDeposit,
  onSelect,
  logs
}) => {
  const [quickAmount, setQuickAmount] = useState<string>('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Calculate stats
  const percentage = goal.targetAmount > 0 
    ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100) 
    : 0;
  const isCompleted = goal.currentAmount >= goal.targetAmount;
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);

  // Color theme mapper
  const colorThemes = {
    emerald: {
      bg: 'bg-emerald-50/60 hover:bg-emerald-50 border-emerald-100',
      progressBg: 'bg-slate-200/60',
      progressFill: 'bg-emerald-500',
      text: 'text-emerald-900',
      tag: 'bg-emerald-100/80 text-emerald-700 border-emerald-200/50',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200',
      accent: 'text-emerald-600',
      glow: 'shadow-emerald-100'
    },
    amber: {
      bg: 'bg-amber-50/60 hover:bg-amber-50 border-amber-100',
      progressBg: 'bg-slate-200/60',
      progressFill: 'bg-amber-500',
      text: 'text-amber-900',
      tag: 'bg-amber-100/80 text-amber-700 border-amber-200/50',
      button: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200',
      accent: 'text-amber-600',
      glow: 'shadow-amber-100'
    },
    violet: {
      bg: 'bg-violet-50/60 hover:bg-violet-50 border-violet-100',
      progressBg: 'bg-slate-200/60',
      progressFill: 'bg-violet-500',
      text: 'text-violet-900',
      tag: 'bg-violet-100/80 text-violet-700 border-violet-200/50',
      button: 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200',
      accent: 'text-violet-600',
      glow: 'shadow-violet-100'
    },
    rose: {
      bg: 'bg-rose-50/60 hover:bg-rose-50 border-rose-100',
      progressBg: 'bg-slate-200/60',
      progressFill: 'bg-rose-500',
      text: 'text-rose-900',
      tag: 'bg-rose-100/80 text-rose-700 border-rose-200/50',
      button: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200',
      accent: 'text-rose-600',
      glow: 'shadow-rose-100'
    },
    blue: {
      bg: 'bg-blue-50/60 hover:bg-blue-50 border-blue-100',
      progressBg: 'bg-slate-200/60',
      progressFill: 'bg-blue-500',
      text: 'text-blue-900',
      tag: 'bg-blue-100/80 text-blue-700 border-blue-200/50',
      button: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200',
      accent: 'text-blue-600',
      glow: 'shadow-blue-100'
    },
    indigo: {
      bg: 'bg-indigo-50/60 hover:bg-indigo-50 border-indigo-100',
      progressBg: 'bg-slate-200/60',
      progressFill: 'bg-indigo-500',
      text: 'text-indigo-900',
      tag: 'bg-indigo-100/80 text-indigo-700 border-indigo-200/50',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200',
      accent: 'text-indigo-600',
      glow: 'shadow-indigo-100'
    },
    pink: {
      bg: 'bg-pink-50/60 hover:bg-pink-50 border-pink-100',
      progressBg: 'bg-slate-200/60',
      progressFill: 'bg-pink-500',
      text: 'text-pink-900',
      tag: 'bg-pink-100/80 text-pink-700 border-pink-200/50',
      button: 'bg-pink-600 hover:bg-pink-700 text-white shadow-pink-200',
      accent: 'text-pink-600',
      glow: 'shadow-pink-100'
    },
    slate: {
      bg: 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200/60',
      progressBg: 'bg-slate-200/60',
      progressFill: 'bg-slate-700',
      text: 'text-slate-900',
      tag: 'bg-slate-200 text-slate-700 border-slate-300/40',
      button: 'bg-slate-700 hover:bg-slate-800 text-white shadow-slate-200',
      accent: 'text-slate-700',
      glow: 'shadow-slate-100'
    }
  };

  const theme = colorThemes[goal.color] || colorThemes.slate;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(quickAmount);
    if (!isNaN(parsed) && parsed > 0) {
      onQuickDeposit(goal.id, parsed, 'Ҷамъоварии ҳамарӯза');
      setQuickAmount('');
      setShowQuickAdd(false);
    }
  };

  const formattedSaved = new Intl.NumberFormat('tg-TJ').format(goal.currentAmount);
  const formattedTarget = new Intl.NumberFormat('tg-TJ').format(goal.targetAmount);
  const formattedRemaining = new Intl.NumberFormat('tg-TJ').format(remaining);

  // Days left helper
  const getDaysLeftText = () => {
    if (!goal.targetDate) return null;
    const target = new Date(goal.targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Мӯҳлат гузашт';
    if (diffDays === 0) return 'Имрӯз охирин рӯз';
    return `${diffDays} рӯз боқӣ монд`;
  };

  const daysLeft = getDaysLeftText();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`relative group flex flex-col p-3 rounded-2xl border ${theme.bg} ${theme.glow} shadow-xs hover:shadow-md transition-all duration-300 min-h-[120px] h-full overflow-hidden`}
    >
      {/* Complete Watermark / Sparkles */}
      {isCompleted && (
        <div className="absolute -right-3 -top-3 w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center rotate-12 pointer-events-none">
          <Sparkles className="w-6 h-6 text-emerald-500 opacity-60" />
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1.5">
          {/* Emoji Badge */}
          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs flex items-center justify-center text-lg border border-slate-100">
            {goal.emoji || '🎯'}
          </div>
          <div>
            <span className={`inline-block text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border ${theme.tag}`}>
              {goal.category}
            </span>
            {daysLeft && (
              <span className="block text-[8px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                <Calendar className="w-2 h-2 text-slate-400" />
                {daysLeft}
              </span>
            )}
          </div>
        </div>

        {/* Edit / Delete Buttons */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(goal)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-white/80 transition-all cursor-pointer"
            title="Ислоҳ кардан"
          >
            <Edit2 className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => {
              if (confirm('Оё мутмаин ҳастед, ки ин ҳадафро нест кардан мехоҳед?')) {
                onDelete(goal.id);
              }
            }}
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            title="Нест кардан"
          >
            <Trash2 className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="flex-1 cursor-pointer" onClick={() => onSelect(goal)}>
        <h3 className={`font-extrabold text-xs leading-snug mb-1 tracking-tight group-hover:text-emerald-900 transition-colors ${theme.text}`}>
          {goal.title || 'Ҳадафи нав'}
        </h3>
        
        {/* Progress Circle & Percent */}
        <div className="flex items-center justify-between gap-1 mt-1 mb-0.5">
          <div className="flex items-baseline gap-0.5">
            <span className="text-base font-black font-mono tracking-tight text-slate-800">
              {percentage}%
            </span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">ҷамъ шуд</span>
          </div>
          
          {isCompleted ? (
            <div className="flex items-center gap-0.5 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 py-0.5 px-1.5 rounded-md border border-emerald-100">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Ба даст омад!</span>
            </div>
          ) : (
            <div className="text-[9px] text-slate-500 font-semibold">
              боқӣ: <span className="font-mono font-bold text-slate-700">{formattedRemaining} {goal.currency}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-1.5 rounded-full ${theme.progressBg} overflow-hidden mb-1.5`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${theme.progressFill}`}
          />
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-1 bg-white/40 border border-white/50 rounded-lg p-1.5 mb-1.5">
          <div>
            <span className="block text-[8px] text-slate-400 font-extrabold uppercase tracking-wide">Пасандоз</span>
            <span className="text-[11px] font-extrabold text-slate-800 font-mono">{formattedSaved} {goal.currency}</span>
          </div>
          <div className="border-l border-slate-200/30 pl-1.5">
            <span className="block text-[8px] text-slate-400 font-extrabold uppercase tracking-wide">Ҳадаф</span>
            <span className="text-[11px] font-extrabold text-slate-800 font-mono">{formattedTarget} {goal.currency}</span>
          </div>
        </div>
      </div>

      {/* Quick Add Form or Instant Presets */}
      <div className="mt-auto pt-3 border-t border-slate-200/30 flex flex-col gap-2">
        {!showQuickAdd ? (
          <div className="flex gap-2 items-center">
            {/* Quick Presets */}
            {!isCompleted && (
              <div className="flex gap-1 flex-1">
                {[50, 100, 500].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => onQuickDeposit(goal.id, preset, 'Иловаи зуд')}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 text-[10px] font-extrabold text-slate-700 transition-all font-mono cursor-pointer"
                  >
                    +{preset}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                if (isCompleted) {
                  onSelect(goal);
                } else {
                  setShowQuickAdd(true);
                }
              }}
              className={`flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isCompleted 
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 w-full' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              {isCompleted ? (
                <>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Дидани таърих</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Илова</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <form onSubmit={handleQuickSubmit} className="flex gap-1.5 items-center">
            <div className="relative flex-1">
              <input
                type="number"
                required
                placeholder="Маблағ..."
                value={quickAmount}
                onChange={(e) => setQuickAmount(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-xl py-1.5 pl-3 pr-8 text-xs font-bold outline-none"
                autoFocus
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 font-mono">
                {goal.currency}
              </span>
            </div>
            <button
              type="submit"
              className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Илова
            </button>
            <button
              type="button"
              onClick={() => setShowQuickAdd(false)}
              className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold transition-all cursor-pointer"
            >
              X
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};
