import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Goal } from '../types';
import { X, Target, Calendar, Award, Palette, Sparkles, AlertCircle } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: Partial<Goal>) => void;
  goal?: Goal | null;
  categories: string[];
  onAddCategory: (cat: string) => void;
}

const PRESET_EMOJIS = ['🚗', '🏠', '💻', '✈️', '🎓', '📱', '🚲', '🛍️', '💎', '💡', '💰', '👑', '⛰️', '🩺', '🎸', '👟'];

const COLORS: Goal['color'][] = ['emerald', 'amber', 'violet', 'rose', 'blue', 'indigo', 'pink', 'slate'];

const COLOR_NAMES = {
  emerald: 'Сабз (Зебо)',
  amber: 'Зард (Илҳомбахш)',
  violet: 'Банафш (Ҷодуӣ)',
  rose: 'Сурх (Қатъӣ)',
  blue: 'Осмонӣ (Ором)',
  indigo: 'Олучагӣ (Муосир)',
  pink: 'Гулгун (Шавқовар)',
  slate: 'Хокистарӣ (Касбӣ)'
};

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  goal,
  categories,
  onAddCategory
}) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [currency, setCurrency] = useState('TJS');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState<Goal['color']>('emerald');
  const [emoji, setEmoji] = useState('🎯');
  const [targetDate, setTargetDate] = useState('');

  const [newCatInput, setNewCatInput] = useState('');
  const [showNewCatForm, setShowNewCatForm] = useState(false);
  const [error, setError] = useState('');

  // Sync state with goal when editing or creating
  useEffect(() => {
    if (isOpen) {
      if (goal) {
        setTitle(goal.title);
        setTargetAmount(goal.targetAmount.toString());
        setCurrentAmount(goal.currentAmount.toString());
        setCurrency(goal.currency);
        setCategory(goal.category);
        setColor(goal.color);
        setEmoji(goal.emoji);
        setTargetDate(goal.targetDate || '');
      } else {
        setTitle('');
        setTargetAmount('');
        setCurrentAmount('0');
        setCurrency('TJS');
        setCategory(categories[0] || 'Дигар');
        setColor('emerald');
        setEmoji('🎯');
        setTargetDate('');
      }
      setError('');
      setShowNewCatForm(false);
      setNewCatInput('');
    }
  }, [isOpen, goal, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const targetNum = parseFloat(targetAmount);
    const currentNum = parseFloat(currentAmount);

    if (!title.trim()) {
      setError('Лутфан унвони ҳадафро ворид созед.');
      return;
    }
    if (isNaN(targetNum) || targetNum <= 0) {
      setError('Маблағи ҳадаф бояд аз 0 калон бошад.');
      return;
    }
    if (isNaN(currentNum) || currentNum < 0) {
      setError('Маблағи пасандозшуда наметавонад аз 0 кам бошад.');
      return;
    }

    onSave({
      title: title.trim(),
      targetAmount: targetNum,
      currentAmount: currentNum,
      currency,
      category,
      color,
      emoji: emoji.trim() || '🎯',
      targetDate: targetDate || undefined
    });

    onClose();
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatInput.trim()) {
      onAddCategory(newCatInput.trim());
      setCategory(newCatInput.trim());
      setNewCatInput('');
      setShowNewCatForm(false);
    }
  };

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

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white w-full max-w-xl rounded-3xl shadow-xl border border-slate-100 flex flex-col overflow-hidden max-h-[90vh] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Target className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">
                  {goal ? 'Ислоҳи Ҳадаф' : 'Ҳадафи Нав Гузоштан'}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Ҳадафи худро бо унвону ранг созед</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5 text-xs text-rose-600 font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Scrollable Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Goal Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Номи Ҳадаф
              </label>
              <input
                type="text"
                required
                placeholder="Масалан: Харидани мошини Hyundai Elantra..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3 text-slate-800 text-sm font-semibold outline-none transition-all"
              />
            </div>

            {/* Target & Current Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Маблағи умумӣ (Ҳадаф)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Масалан: 120000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl pl-4 pr-16 py-3 text-slate-800 text-sm font-semibold outline-none transition-all font-mono"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">
                    {currency}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Пасандози ибтидоӣ (Аллакай дорам)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="Масалан: 5000"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl pl-4 pr-16 py-3 text-slate-800 text-sm font-semibold outline-none transition-all font-mono"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">
                    {currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Currency Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Асъор (Валюта)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['TJS', 'USD', 'EUR', 'RUB'].map((cur) => (
                  <button
                    type="button"
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      currency === cur
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs scale-102'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cur === 'TJS' ? 'TJS (Сомонӣ)' : cur}
                  </button>
                ))}
              </div>
            </div>

            {/* Emoji Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Нишони Ҳадаф (Эмодзи)
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                {PRESET_EMOJIS.map((emojiPreset) => (
                  <button
                    type="button"
                    key={emojiPreset}
                    onClick={() => setEmoji(emojiPreset)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all cursor-pointer ${
                      emoji === emojiPreset
                        ? 'bg-white border-emerald-500 scale-110 shadow-3xs'
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {emojiPreset}
                  </button>
                ))}
                <div className="w-16 h-9 rounded-xl overflow-hidden border border-slate-200 bg-white flex items-center">
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="Дигар..."
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="w-full h-full text-center text-base font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Гурӯҳи Ҳадаф (Категория)
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewCatForm(!showNewCatForm)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  {showNewCatForm ? 'Бекор кардан' : '+ Гурӯҳи нав'}
                </button>
              </div>

              {showNewCatForm ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Номи гурӯҳи нав..."
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategorySubmit}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Илова
                  </button>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl px-4 py-3 text-slate-700 text-sm font-semibold outline-none transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Color Accent */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Ранг барои ҳадаф
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((c) => {
                  const active = color === c;
                  const colorClasses = {
                    emerald: 'bg-emerald-500 text-emerald-950',
                    amber: 'bg-amber-500 text-amber-950',
                    violet: 'bg-violet-500 text-violet-950',
                    rose: 'bg-rose-500 text-rose-950',
                    blue: 'bg-blue-500 text-blue-950',
                    indigo: 'bg-indigo-500 text-indigo-950',
                    pink: 'bg-pink-500 text-pink-950',
                    slate: 'bg-slate-500 text-slate-950'
                  };
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)}
                      className={`h-9 px-2 rounded-xl text-[10px] font-black transition-all truncate border flex items-center justify-center cursor-pointer ${colorClasses[c]} ${
                        active
                          ? 'border-slate-900 scale-102 ring-2 ring-emerald-400/50 ring-offset-2'
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      {COLOR_NAMES[c].split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Мӯҳлати иҷро (Ихтиёрӣ)
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3 text-slate-700 text-sm font-semibold outline-none transition-all font-mono"
              />
            </div>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Бекор кардан
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>{goal ? 'Сабти тағйирот' : 'Эҷод кардани Ҳадаф'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
