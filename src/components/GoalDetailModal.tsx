import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Goal, SavingsLog } from '../types';
import { X, Calendar, Plus, Trash2, ArrowUpRight, CheckCircle2, TrendingUp, Sparkles, Award, ReceiptText, ChevronRight, Minus } from 'lucide-react';

interface GoalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  logs: SavingsLog[];
  onAddLog: (goalId: string, amount: number, description: string) => void;
  onDeleteLog: (logId: string) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export const GoalDetailModal: React.FC<GoalDetailModalProps> = ({
  isOpen,
  onClose,
  goal,
  logs,
  onAddLog,
  onDeleteLog,
  onEdit,
  onDelete
}) => {
  const [amountInput, setAmountInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [isWithdrawal, setIsWithdrawal] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !goal) return null;

  // Stats calculation
  const percentage = goal.targetAmount > 0 
    ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100) 
    : 0;
  const isCompleted = goal.currentAmount >= goal.targetAmount;
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);

  const formattedSaved = new Intl.NumberFormat('tg-TJ').format(goal.currentAmount);
  const formattedTarget = new Intl.NumberFormat('tg-TJ').format(goal.targetAmount);
  const formattedRemaining = new Intl.NumberFormat('tg-TJ').format(remaining);

  const goalLogs = logs.filter(l => l.goalId === goal.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amountInput);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Лутфан маблағи дуруст ворид созед.');
      return;
    }

    const finalAmount = isWithdrawal ? -parsedAmount : parsedAmount;
    const defaultDesc = isWithdrawal ? 'Гирифтани пул' : 'Пасандоз';
    
    // Check if withdrawal exceeds current savings
    if (isWithdrawal && Math.abs(finalAmount) > goal.currentAmount) {
      setError('Шумо наметавонед аз пасандозатон бештар пул гиред.');
      return;
    }

    onAddLog(goal.id, finalAmount, descInput.trim() || defaultDesc);
    setAmountInput('');
    setDescInput('');
    setIsWithdrawal(false);
  };

  const getMilestones = () => {
    return [
      { percentage: 10, label: 'Саршавии бобарор 🎯', desc: '10% ҳадаф ҷамъ шуд', achieved: percentage >= 10 },
      { percentage: 25, label: 'Қадами аввалин 🌱', desc: 'Чоряки ҳадаф ба даст омад', achieved: percentage >= 25 },
      { percentage: 50, label: 'Нисфи роҳ ⛰️', desc: '50% маблағ пасандоз шуд!', achieved: percentage >= 50 },
      { percentage: 80, label: 'Қариб расидем! 🚀', desc: '80% роҳ паси сар шуд', achieved: percentage >= 80 },
      { percentage: 100, label: 'Ғалаба ва Муваффақият! 🏆', desc: 'Ҳадафи шумо 100% пур шуд!', achieved: percentage >= 100 },
    ];
  };

  const milestones = getMilestones();

  // Color theme map for details page styling
  const colorThemes = {
    emerald: 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700',
    amber: 'bg-amber-600 text-white border-amber-700 hover:bg-amber-700',
    violet: 'bg-violet-600 text-white border-violet-700 hover:bg-violet-700',
    rose: 'bg-rose-600 text-white border-rose-700 hover:bg-rose-700',
    blue: 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700',
    indigo: 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700',
    pink: 'bg-pink-600 text-white border-pink-700 hover:bg-pink-700',
    slate: 'bg-slate-700 text-white border-slate-800 hover:bg-slate-800',
  };

  const themeBtnClass = colorThemes[goal.color] || colorThemes.slate;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Panel content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[90vh] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl border border-slate-100 shadow-2xs">
                {goal.emoji || '🎯'}
              </div>
              <div>
                <span className="inline-block text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider mb-0.5">
                  {goal.category}
                </span>
                <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">
                  {goal.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Main Layout split into 2 Columns (Desktop) */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Progress, Stats & Action Form */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Quick Stats Panel */}
              <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl border border-slate-100 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Пешравӣ</span>
                    <p className="text-3xl font-black font-mono text-slate-800 mt-1">{percentage}%</p>
                  </div>
                  {isCompleted ? (
                    <div className="bg-emerald-500/10 text-emerald-600 p-2 rounded-xl flex items-center gap-1 text-xs font-bold border border-emerald-500/20">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span>Иҷро шуд!</span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Боқӣ</span>
                      <p className="text-base font-extrabold text-slate-700 font-mono mt-1">{formattedRemaining} {goal.currency}</p>
                    </div>
                  )}
                </div>

                {/* Big Progress bar */}
                <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden mb-5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-slate-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Пасандоз шуд</span>
                    <span className="text-base font-extrabold text-slate-800 font-mono">{formattedSaved} {goal.currency}</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-slate-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ҳадаф</span>
                    <span className="text-base font-extrabold text-slate-800 font-mono">{formattedTarget} {goal.currency}</span>
                  </div>
                </div>

                {goal.targetDate && (
                  <div className="mt-4 pt-3 border-t border-slate-200/40 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      Мӯҳлати охирин:
                    </span>
                    <span className="font-mono text-slate-700">{new Date(goal.targetDate).toLocaleDateString('tg-TJ')}</span>
                  </div>
                )}
              </div>

              {/* Deposit/Withdraw Money Form */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-2xs">
                <div className="flex items-center gap-1.5 mb-4">
                  <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
                  <h4 className="font-extrabold text-slate-800 text-sm">Амалиёти пулӣ (Илова/Кам кардани пасандоз)</h4>
                </div>

                {error && (
                  <div className="mb-4 p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600">
                    {error}
                  </div>
                )}

                <form onSubmit={handleAddLogSubmit} className="space-y-4">
                  {/* Mode Selector */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/30">
                    <button
                      type="button"
                      onClick={() => setIsWithdrawal(false)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        !isWithdrawal
                          ? 'bg-white text-emerald-700 shadow-3xs border border-emerald-100'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      ➕ Пасандоз (Пул илова кардан)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsWithdrawal(true)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        isWithdrawal
                          ? 'bg-white text-rose-700 shadow-3xs border border-rose-100'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      ➖ Бозпас гирифтан (Хароҷот)
                    </button>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Маблағ</label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          min="0.1"
                          step="any"
                          placeholder="0.00"
                          value={amountInput}
                          onChange={(e) => setAmountInput(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-2 px-3 text-xs font-bold outline-none font-mono"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                          {goal.currency}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Шарҳ (Сабаб)</label>
                      <input
                        type="text"
                        placeholder="Масалан: Даромади имрӯза, Тӯҳфа..."
                        value={descInput}
                        onChange={(e) => setDescInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-2 px-3 text-xs font-bold outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-white ${
                      isWithdrawal
                        ? 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-200'
                        : themeBtnClass
                    }`}
                  >
                    {isWithdrawal ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span>{isWithdrawal ? 'Кам кардани маблағ' : 'Сабти пасандози имрӯза'}</span>
                  </button>
                </form>
              </div>

              {/* Milestones / Achievements progress */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-2xs">
                <div className="flex items-center gap-1.5 mb-4">
                  <Award className="w-4.5 h-4.5 text-emerald-600" />
                  <h4 className="font-extrabold text-slate-800 text-sm">Марҳалаҳои муваффақият</h4>
                </div>

                <div className="space-y-3.5">
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.percentage}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                        milestone.achieved
                          ? 'bg-emerald-50/40 border-emerald-100/60 text-emerald-950'
                          : 'bg-white border-slate-100 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all ${
                          milestone.achieved ? 'bg-emerald-100 text-emerald-700 scale-102 shadow-3xs' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {milestone.percentage}%
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${milestone.achieved ? 'text-slate-800' : 'text-slate-400'}`}>
                            {milestone.label}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">{milestone.desc}</p>
                        </div>
                      </div>
                      
                      {milestone.achieved ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-3xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="text-[10px] font-extrabold font-mono text-slate-300">Пӯшида</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Savings Ledger / History Logs */}
            <div className="md:col-span-5 space-y-4 flex flex-col h-full min-h-[300px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ReceiptText className="w-4.5 h-4.5 text-slate-600" />
                  <h4 className="font-extrabold text-slate-800 text-sm">Таърихи пасандозҳо</h4>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {goalLogs.length} сабт
                </span>
              </div>

              {/* Scrollable logs box */}
              <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 p-4 overflow-y-auto space-y-3 max-h-[420px] md:max-h-none">
                {goalLogs.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
                      <ReceiptText className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-500">Ягон сабт ворид нашудааст</p>
                    <p className="text-[10px] text-slate-400 mt-1">Имрӯз аввалин пулатонро пасандоз кунед!</p>
                  </div>
                ) : (
                  goalLogs.map((log) => {
                    const isPositive = log.amount >= 0;
                    const dateObj = new Date(log.date);
                    const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('tg-TJ', { month: 'short' })} ${dateObj.getFullYear()}`;
                    
                    return (
                      <div
                        key={log.id}
                        className="bg-white p-3 rounded-xl border border-slate-100 shadow-3xs flex items-center justify-between gap-3 group/log transition-all hover:bg-slate-50/50"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-slate-800 truncate">
                            {log.description}
                          </p>
                          <span className="text-[9px] text-slate-400 font-bold block mt-0.5 font-mono">
                            {formattedDate}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs font-black font-mono ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? '+' : ''}{new Intl.NumberFormat('tg-TJ').format(log.amount)} {goal.currency}
                          </span>
                          <button
                            onClick={() => {
                              if (confirm('Оё мутмаин ҳастед, ки ин сабти пасандозро нест кунед? Ин маблағ ба таври худкор аз пасандози умумӣ ислоҳ мешавад.')) {
                                onDeleteLog(log.id);
                              }
                            }}
                            className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover/log:opacity-100 cursor-pointer"
                            title="Нест кардани сабт"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Goal Management Buttons (Edit/Delete whole goal) */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => {
                    onEdit(goal);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-3xs cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-slate-400 rotate-180" />
                  <span>Таҳрири Ҳадаф</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Оё шумо мутмаин ҳастед, ки ин ҳадаф ва ҳамаи таърихи пасандозҳоро нест кунед? Ин амалро барқарор кардан намешавад.')) {
                      onDelete(goal.id);
                      onClose();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-rose-100 bg-rose-50/60 text-rose-600 text-xs font-bold hover:bg-rose-100/50 hover:text-rose-700 transition-all shadow-3xs cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Нест кардани Ҳадаф</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
