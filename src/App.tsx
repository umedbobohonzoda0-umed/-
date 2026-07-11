import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  X, 
  Info, 
  Menu, 
  Plus, 
  Calculator, 
  Users, 
  Trash2, 
  UserPlus, 
  CheckCircle2, 
  Calendar, 
  Search, 
  ArrowUpDown, 
  MapPin, 
  Clock, 
  Sparkles, 
  User, 
  Check, 
  PlusCircle 
} from 'lucide-react';

interface Roommate {
  id: string;
  name: string;
  spent: number;
  spentFormula?: string;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

interface SavedCalculation {
  id: string;
  title: string;
  createdAt: string;
  roommates: Roommate[];
}

function calculateSettlements(roommates: Roommate[]): Settlement[] {
  const n = roommates.length;
  if (n === 0) return [];

  const total = roommates.reduce((sum, r) => sum + r.spent, 0);
  const share = total / n;

  // Calculate balance for each roommate: spent - share
  const balances = roommates.map((r, idx) => ({
    name: r.name.trim() || `Ҳамхонаи ${idx + 1}`,
    balance: r.spent - share
  }));

  const creditors = balances
    .filter(b => b.balance > 0.01)
    .map(b => ({ name: b.name, balance: b.balance }))
    .sort((a, b) => b.balance - a.balance);
    
  const debtors = balances
    .filter(b => b.balance < -0.01)
    .map(b => ({ name: b.name, balance: b.balance }))
    .sort((a, b) => a.balance - b.balance);

  const settlements: Settlement[] = [];

  let cIdx = 0;
  let dIdx = 0;

  while (cIdx < creditors.length && dIdx < debtors.length) {
    const creditor = creditors[cIdx];
    const debtor = debtors[dIdx];

    const oweAmount = Math.abs(debtor.balance);
    const creditAmount = creditor.balance;

    const settled = Math.min(oweAmount, creditAmount);

    if (settled > 0.01) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Number(settled.toFixed(2))
      });
    }

    creditor.balance -= settled;
    debtor.balance += settled;

    if (creditor.balance < 0.01) {
      cIdx++;
    }
    if (Math.abs(debtor.balance) < 0.01) {
      dIdx++;
    }
  }

  return settlements;
}

function getSpentLines(formula: string | undefined, spent: number): string[] {
  if (formula) {
    const parts = formula.split(/[\n+]/).map(x => x.trim()).filter(x => x !== '');
    if (parts.length > 0) return parts;
  }
  return spent === 0 ? [] : [spent.toString()];
}

const DEFAULT_CALCULATIONS: SavedCalculation[] = [
  {
    id: '1',
    title: 'Хароҷоти Ошхона',
    createdAt: '24.06.2026',
    roommates: [
      { id: '1', name: 'Аҳмад', spent: 1000, spentFormula: '500+500' },
      { id: '2', name: 'Сомон', spent: 400, spentFormula: '400' },
      { id: '3', name: 'Баҳром', spent: 0, spentFormula: '' },
      { id: '4', name: 'Парвиз', spent: 0, spentFormula: '' }
    ]
  },
  {
    id: '2',
    title: 'Пардохти Коммуналӣ',
    createdAt: '22.06.2026',
    roommates: [
      { id: '1', name: 'Аҳмад', spent: 0, spentFormula: '' },
      { id: '2', name: 'Сомон', spent: 450, spentFormula: '200+250' },
      { id: '3', name: 'Баҳром', spent: 450, spentFormula: '450' },
      { id: '4', name: 'Парвиз', spent: 0, spentFormula: '' }
    ]
  }
];

export default function App() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('Egamberdiev');
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);
  
  // Search and Sort Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // List of all saved roommate calculations
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>(() => {
    const local = localStorage.getItem('saved_calculations');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_CALCULATIONS;
  });

  // Current calculation details being edited/created in the modal
  const [editingId, setEditingId] = useState<string | null>(null);
  const [calcTitle, setCalcTitle] = useState<string>('Хароҷоти аввала');
  const [calcRoommates, setCalcRoommates] = useState<Roommate[]>([]);
  const [spentInputs, setSpentInputs] = useState<Record<string, string>>({});

  // Function to save calculations to state and localStorage
  const saveList = (list: SavedCalculation[]) => {
    setSavedCalculations(list);
    localStorage.setItem('saved_calculations', JSON.stringify(list));
  };

  // Open the calculator modal in CREATE mode
  const handleOpenNewCalculator = () => {
    setEditingId(null);
    setCalcTitle(`Ҳисоби нав #${savedCalculations.length + 1}`);
    setCalcRoommates([
      { id: '1', name: '', spent: 0 },
      { id: '2', name: '', spent: 0 },
    ]);
    setSpentInputs({ '1': '', '2': '' });
    setIsCalculatorOpen(true);
  };

  // Open the calculator modal in EDIT/VIEW mode
  const handleOpenEditCalculator = (calc: SavedCalculation) => {
    setEditingId(calc.id);
    setCalcTitle(calc.title);
    setCalcRoommates(calc.roommates);
    
    const inputs: Record<string, string> = {};
    calc.roommates.forEach(r => {
      inputs[r.id] = r.spentFormula !== undefined ? r.spentFormula : (r.spent === 0 ? '' : r.spent.toString());
    });
    setSpentInputs(inputs);
    setIsCalculatorOpen(true);
  };

  // Roommate modification helpers for the active edit state
  const addRoommate = () => {
    const newId = (Math.max(...calcRoommates.map(r => parseInt(r.id) || 0), 0) + 1).toString();
    setCalcRoommates([...calcRoommates, { id: newId, name: '', spent: 0 }]);
    setSpentInputs(prev => ({ ...prev, [newId]: '' }));
  };

  const removeRoommate = (id: string) => {
    setCalcRoommates(calcRoommates.filter(r => r.id !== id));
    setSpentInputs(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const updateRoommateName = (id: string, name: string) => {
    setCalcRoommates(calcRoommates.map(r => r.id === id ? { ...r, name } : r));
  };

  const updateRoommateSpent = (id: string, spent: number, spentFormula?: string) => {
    setCalcRoommates(calcRoommates.map(r => r.id === id ? { 
      ...r, 
      spent: isNaN(spent) ? 0 : spent,
      spentFormula: spentFormula !== undefined ? spentFormula : r.spentFormula
    } : r));
  };

  const handleSpentInputChange = (id: string, val: string) => {
    setSpentInputs(prev => ({ ...prev, [id]: val }));

    const formatted = val.replace(/\r?\n/g, '+');
    const sanitized = formatted.replace(/[^0-9+\-*/().\s]/g, '');
    if (!sanitized.trim()) {
      updateRoommateSpent(id, 0, val);
      return;
    }

    try {
      let evalStr = sanitized.trim();
      while (evalStr && /[+\-*/(.\s]$/.test(evalStr)) {
        evalStr = evalStr.slice(0, -1).trim();
      }
      if (!evalStr) {
        updateRoommateSpent(id, 0, val);
        return;
      }
      const fn = new Function(`return (${evalStr})`);
      const evaluated = fn();
      const parsed = Number(evaluated);
      if (!isNaN(parsed) && isFinite(parsed)) {
        updateRoommateSpent(id, Number(parsed.toFixed(2)), val);
      }
    } catch {
      updateRoommateSpent(id, calcRoommates.find(r => r.id === id)?.spent || 0, val);
    }
  };

  const handleSpentInputBlur = (id: string, val: string) => {
    const formatted = val.replace(/\r?\n/g, '+');
    const sanitized = formatted.replace(/[^0-9+\-*/().\s]/g, '');
    if (!sanitized.trim()) {
      setSpentInputs(prev => ({ ...prev, [id]: '' }));
      updateRoommateSpent(id, 0, '');
      return;
    }
    try {
      let evalStr = sanitized.trim();
      while (evalStr && /[+\-*/(.\s]$/.test(evalStr)) {
        evalStr = evalStr.slice(0, -1).trim();
      }
      const fn = new Function(`return (${evalStr})`);
      const evaluated = fn();
      const parsed = Number(evaluated);
      if (!isNaN(parsed) && isFinite(parsed)) {
        const finalVal = Number(parsed.toFixed(2));
        setSpentInputs(prev => ({ ...prev, [id]: val }));
        updateRoommateSpent(id, finalVal, val);
      }
    } catch {
      const current = calcRoommates.find(r => r.id === id);
      const currentSpent = current?.spent || 0;
      const currentFormula = current?.spentFormula || '';
      setSpentInputs(prev => ({ ...prev, [id]: currentFormula || (currentSpent === 0 ? '' : currentSpent.toString()) }));
    }
  };

  const handleSaveCalculation = () => {
    if (!calcTitle.trim()) return;
    
    if (editingId) {
      // Update existing
      const updated = savedCalculations.map(c => {
        if (c.id === editingId) {
          return {
            ...c,
            title: calcTitle,
            roommates: calcRoommates
          };
        }
        return c;
      });
      saveList(updated);
    } else {
      // Create new
      const newCalc: SavedCalculation = {
        id: Date.now().toString(),
        title: calcTitle,
        createdAt: new Date().toLocaleDateString('tg-TJ', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        roommates: calcRoommates
      };
      saveList([...savedCalculations, newCalc]);
    }
    setIsCalculatorOpen(false);
  };

  const handleDeleteCalculation = (id: string) => {
    const filtered = savedCalculations.filter(c => c.id !== id);
    saveList(filtered);
    setIsCalculatorOpen(false);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Filtering & sorting calculations
  const filteredCalculations = savedCalculations
    .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'total') {
        const totalA = a.roommates.reduce((sum, r) => sum + r.spent, 0);
        const totalB = b.roommates.reduce((sum, r) => sum + r.spent, 0);
        return sortOrder === 'asc' ? totalA - totalB : totalB - totalA;
      } else {
        // Sort by date/id
        return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      }
    });

  const totalSpent = calcRoommates.reduce((sum, r) => sum + r.spent, 0);
  const perPersonShare = calcRoommates.length > 0 ? Number((totalSpent / calcRoommates.length).toFixed(2)) : 0;
  const settlements = calculateSettlements(calcRoommates);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col antialiased pb-12">
      
      {/* Main Container */}
      <div className="w-full max-w-xl mx-auto flex flex-col p-5 sm:p-8 space-y-5 flex-1">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
          <button className="p-2 -ml-2 rounded-xl hover:bg-amber-50 active:scale-95 text-slate-700 hover:text-amber-600 transition-all cursor-pointer">
            <Menu className="w-6 h-6" />
          </button>
          
          <button 
            onClick={handleOpenNewCalculator}
            className="py-2.5 px-4.5 rounded-2xl bg-amber-50 hover:bg-amber-100/80 text-amber-600 hover:text-amber-700 active:scale-95 transition-all cursor-pointer flex items-center gap-2 font-black text-xs shadow-xs border border-amber-100/50"
            title="Ҳисобкунаки нав"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Ҳисоби нав</span>
          </button>
        </div>

        {/* Calculations Section */}
        <div className="space-y-3">
            {filteredCalculations.length > 0 ? (
              filteredCalculations.map((calc) => {
                const total = calc.roommates.reduce((sum, r) => sum + r.spent, 0);
                
                // Get high spender (green dot) and low spender (red dot) to display route
                const sortedRoommates = [...calc.roommates].sort((a, b) => b.spent - a.spent);
                const highSpender = sortedRoommates[0];
                const lowSpender = sortedRoommates[sortedRoommates.length - 1];

                return (
                  <div
                    key={calc.id}
                    onClick={() => handleOpenEditCalculator(calc)}
                    className="border border-amber-100 rounded-[32px] bg-white p-2.5 space-y-1.5 shadow-xs hover:shadow-sm hover:border-amber-200 transition-all duration-200 cursor-pointer"
                  >
                    {/* Card Header Row (Driver style) */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {/* Initial Circle Avatar in Golden amber */}
                        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100/60 flex items-center justify-center shrink-0">
                          <span className="font-extrabold text-amber-600 text-[11px]">
                            {calc.title.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-black text-slate-800 text-xs leading-none">
                              {calc.title}
                            </h4>
                            <span className="w-3 h-3 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0" title="Захирашуда">
                              <Check className="w-1.5 h-1.5 stroke-[4px]" />
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                            {calc.roommates.length} ҳамхона
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-slate-800 font-mono">
                          {total} <span className="text-[9px] font-extrabold text-slate-400">сомонӣ</span>
                        </div>
                        <div className="text-[8px] font-extrabold text-emerald-600 font-mono mt-0.5">
                          {Number((total / calc.roommates.length).toFixed(2))}с. / нафар
                        </div>
                      </div>
                    </div>

                    {/* Card Route Display (Cleverly mapping roommates to Green/Red dots like the map route) */}
                    {calc.roommates.length > 0 && (
                      <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                        <div className="space-y-0.5 bg-slate-50/50 p-1.5 rounded-xl flex-1 mr-2 border border-slate-100/60">
                          {/* Green dot for high spender */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                              <span className="text-[10px] font-bold text-slate-700">
                                {highSpender.name || 'Ҳамхонаи 1'}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono font-black text-emerald-600">
                              +{highSpender.spent}с.
                            </span>
                          </div>
                          {/* Connection line */}
                          <div className="w-0.5 h-0.5 border-l border-slate-300 ml-0.5"></div>
                          {/* Red dot for lowest spender */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></div>
                              <span className="text-[10px] font-bold text-slate-700">
                                {lowSpender ? (lowSpender.name || 'Ҳамхонаи охир') : 'Ҳеҷ кас'}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono font-black text-slate-500">
                              +{lowSpender ? lowSpender.spent : 0}с.
                            </span>
                          </div>
                        </div>

                        {/* Quick View Button resembling the map icon from the image */}
                        <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-500 hover:bg-amber-100 flex items-center justify-center border border-amber-100/50 cursor-pointer transition-colors shrink-0" title="Намоиш">
                          <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                        </div>
                      </div>
                    )}

                    {/* Card Footer: Date + View info */}
                    <div className="flex items-center justify-between border-t border-slate-50 pt-1.5 text-[9px]">
                      <div className="flex items-center gap-1 text-slate-400 font-bold">
                        <Clock className="w-2.5 h-2.5 text-amber-500" />
                        <span>{calc.createdAt || '24.06.2026'}</span>
                      </div>

                      <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        Тафсилот
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-10 px-4 border-2 border-dashed border-slate-200 rounded-[32px] text-center bg-white">
                <Calculator className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-400 max-w-xs mx-auto">
                  Ҳеҷ ҳисобе ёфт нашуд.
                </p>
              </div>
            )}
          </div>

        {/* Dynamic Detailed Calculator Modal with Amber Yellow styling */}
        <AnimatePresence>
          {isCalculatorOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => setIsCalculatorOpen(false)}
            >
              <motion.div
                initial={{ y: 50, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 50, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="bg-white rounded-[32px] w-full max-w-lg p-6 sm:p-8 space-y-6 text-left shadow-2xl relative my-8 border-2 border-amber-300"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-900 shadow-sm shrink-0">
                      <Calculator className="w-5.5 h-5.5 text-slate-800" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm sm:text-base leading-tight">
                        {editingId ? 'Таҳрири Ҳисоби Ҳамхонаҳо' : 'Ҳисоби Нави Хароҷот'}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">
                        Ҳисоб ва тақсими одилонаи маблағҳо
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCalculatorOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Customizable Bill Title Input */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-amber-600 uppercase tracking-wider block">Номи ҳисоби умумӣ</label>
                  <input
                    type="text"
                    value={calcTitle}
                    onChange={(e) => setCalcTitle(e.target.value)}
                    placeholder="Масалан: Хароҷоти Июл"
                    className="max-w-[80%] w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:bg-white focus:border-amber-300"
                  />
                </div>

                {/* Input Fields / Roommate List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-500" /> Рӯйхати ҳамхонаҳо ва хароҷот
                    </span>
                    <button
                      onClick={addRoommate}
                      className="text-[11px] font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Иловаи нав
                    </button>
                  </div>

                  <div className="max-h-52 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                    {calcRoommates.map((roommate, index) => (
                      <div key={roommate.id} className="flex items-start gap-2">
                        <input
                          type="text"
                          value={roommate.name}
                          onChange={(e) => updateRoommateName(roommate.id, e.target.value)}
                          placeholder={`Ҳамхонаи ${index + 1}`}
                          className="flex-1 min-w-[100px] bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:bg-white focus:border-amber-300 mt-[1px]"
                        />
                        <div className="relative w-28 sm:w-32 shrink-0">
                          {(() => {
                            const val = spentInputs[roommate.id] !== undefined ? spentInputs[roommate.id] : (roommate.spent || '').toString();
                            const lines = val.split('\n').length;
                            return (
                              <>
                                <span className={`absolute left-2.5 text-[11px] font-bold text-slate-400 ${lines > 1 ? 'top-2.5' : 'top-1/2 -translate-y-1/2'}`}>+</span>
                                <textarea
                                  rows={Math.min(3, lines)}
                                  value={val}
                                  onChange={(e) => handleSpentInputChange(roommate.id, e.target.value)}
                                  onBlur={(e) => handleSpentInputBlur(roommate.id, e.target.value)}
                                  placeholder="0"
                                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-6 pr-8 py-2 text-xs font-mono font-bold text-slate-700 text-right focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:bg-white focus:border-amber-300 resize-none scrollbar-none block leading-normal"
                                  style={{ minHeight: '34px' }}
                                />
                                <span className={`absolute right-2.5 text-[10px] font-black text-slate-400 ${lines > 1 ? 'top-2.5' : 'top-1/2 -translate-y-1/2'}`}>c</span>
                              </>
                            );
                          })()}
                        </div>
                        {calcRoommates.length > 1 && (
                          <button
                            onClick={() => removeRoommate(roommate.id)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer mt-[1px]"
                            title="Нест кардан"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calculation Summary Grid */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Хароҷоти умумӣ</span>
                    <span className="text-xs sm:text-sm font-black text-slate-800 block mt-1 font-mono">+{totalSpent} c.</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Шумораи нафар</span>
                    <span className="text-xs sm:text-sm font-black text-slate-800 block mt-1 font-mono">{calcRoommates.length} наф.</span>
                  </div>
                  <div className="bg-amber-50/60 border border-amber-100 p-2.5 rounded-xl">
                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider block">Саҳми ҳар нафар</span>
                    <span className="text-xs sm:text-sm font-black text-amber-700 block mt-1 font-mono">+{perPersonShare} c.</span>
                  </div>
                </div>

                {/* Settlements Breakdowns / Transaction list */}
                <div className="space-y-3 pt-1 border-t border-slate-100">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                    Тақсимоти пардохт (Ки ба кӣ бояд диҳад?)
                  </span>

                  {settlements.length > 0 ? (
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {settlements.map((settlement, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50/80 border border-slate-100/80 px-3.5 py-2.5 rounded-xl">
                          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                            <span className="font-bold text-slate-700">{settlement.from}</span>
                            <span className="text-slate-400 text-[10px]">диҳад ба:</span>
                            <span className="font-bold text-amber-700">{settlement.to}</span>
                          </div>
                          <span className="text-[11px] sm:text-xs font-black text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg font-mono">
                            +{settlement.amount} c.
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center py-4 text-amber-600 bg-amber-50/30 border border-amber-100/50 rounded-xl text-xs font-bold">
                      <CheckCircle2 className="w-4.5 h-4.5 shrink-0" /> Ҳама баробар пардохт кардаанд! Ниёз ба интиқол нест.
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap gap-2 pt-2">
                  {editingId && (
                    <button
                      onClick={() => handleDeleteCalculation(editingId)}
                      className="py-3 px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                      title="Нест кардани ҳисоб"
                    >
                      <Trash2 className="w-4 h-4" /> Нест кардан
                    </button>
                  )}
                  <button
                    onClick={() => setIsCalculatorOpen(false)}
                    className="py-3 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black rounded-xl transition-colors cursor-pointer text-center flex-1"
                  >
                    Пӯшидан
                  </button>
                  <button
                    onClick={handleSaveCalculation}
                    className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-black rounded-xl transition-colors cursor-pointer text-center shadow-xs"
                  >
                    Захира кардан
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
