import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, Info, Menu, Plus, Calculator, Users, Trash2, UserPlus, CheckCircle2 } from 'lucide-react';

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

const DEFAULT_ROOMMATES: Roommate[] = [
  { id: '1', name: 'Аҳмад', spent: 2000 },
  { id: '2', name: 'Сомон', spent: 500 },
  { id: '3', name: 'Баҳром', spent: 0 },
  { id: '4', name: 'Парвиз', spent: 0 },
];

export default function App() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  
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
    return [];
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
    setCalcTitle(`Ҳисоби нав ${savedCalculations.length + 1}`);
    setCalcRoommates([
      { id: '1', name: '', spent: 0 },
    ]);
    setSpentInputs({ '1': '' });
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

  const totalSpent = calcRoommates.reduce((sum, r) => sum + r.spent, 0);
  const perPersonShare = calcRoommates.length > 0 ? Number((totalSpent / calcRoommates.length).toFixed(2)) : 0;
  const settlements = calculateSettlements(calcRoommates);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col antialiased">
      
      {/* Main Single Page Wrapper */}
      <div className="w-full max-w-xl mx-auto flex flex-col p-6 sm:p-10 space-y-8 flex-1">
        
        {/* Header Row with Menu (Three lines) on left and Plus on right */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
          <button className="p-2 -ml-2 rounded-xl hover:bg-slate-200/60 active:scale-95 text-slate-700 hover:text-slate-900 transition-all cursor-pointer">
            <Menu className="w-6 h-6" />
          </button>
          
          <button 
            onClick={handleOpenNewCalculator}
            className="p-2 -mr-2 rounded-xl hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            title="Ҳисобкунаки хароҷот"
          >
            <Plus className="w-5.5 h-5.5" />
            <span className="text-xs font-black">Нав</span>
          </button>
        </div>

        {/* Brand Title block */}
        <div className="text-center py-2">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Ҳисобкунаки Хароҷот
          </h1>
          <p className="text-sm text-slate-400 mt-1.5 font-semibold">
            Тақсими баробари маблағи хӯрок байни ҳамхонаҳо
          </p>
        </div>

        {/* Saved Roommate Calculations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Ҳисобҳои захирашуда
            </h2>
            <button
              onClick={handleOpenNewCalculator}
              className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Иловаи нав
            </button>
          </div>

          <div className="space-y-2">
            {savedCalculations.map((calc) => {
              const total = calc.roommates.reduce((sum, r) => sum + r.spent, 0);
              return (
                <button
                  key={calc.id}
                  onClick={() => handleOpenEditCalculator(calc)}
                  className="w-full flex items-center justify-between py-4 px-4 bg-white border border-slate-200/60 hover:bg-emerald-50/40 active:scale-[0.98] rounded-2xl shadow-xs transition-all duration-200 cursor-pointer text-left group"
                >
                  <div className="flex-1 flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-105 duration-200 shrink-0">
                      <Calculator className="w-5.5 h-5.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-slate-800 text-base tracking-tight leading-none">
                        {calc.title}
                      </h3>
                      <span className="inline-block text-xs text-emerald-600 font-extrabold mt-1.5">
                        Умумӣ: +{total} сомонӣ • {calc.roommates.length} нафар
                      </span>
                      <div className="mt-3.5 space-y-2 border-t border-slate-100/60 pt-3">
                        {calc.roommates.map((r, idx) => {
                          const name = r.name.trim() || `Ҳамхонаи ${idx + 1}`;
                          const lines = getSpentLines(r.spentFormula, r.spent);
                          return (
                            <div key={r.id} className="flex items-start justify-between w-full text-[11px] leading-tight">
                              <span className="font-extrabold text-slate-700 bg-white pr-1.5 shrink-0">
                                {name}
                              </span>
                              <div className="flex-1 border-b border-dotted border-slate-300 mx-1.5 mt-2 h-0"></div>
                              <div className="text-right font-mono font-black text-emerald-600 pl-1.5 shrink-0 space-y-0.5">
                                {lines.map((line, lIdx) => (
                                  <div key={lIdx}>
                                    +{line}с.
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-100/50 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}

            {savedCalculations.length === 0 && (
              <div className="py-8 px-4 border-2 border-dashed border-slate-200 rounded-3xl text-center bg-slate-50/50 mt-2">
                <Calculator className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-bounce" />
                <p className="text-xs font-semibold text-slate-400 max-w-xs mx-auto">
                  Ҳеҷ гуна ҳисоби захирашуда ёфт нашуд. Барои сохтани ҳисоб тугмаи <strong className="text-emerald-600 font-black">«Иловаи нав»</strong> ё <strong className="text-emerald-600 font-black font-mono">«+»</strong>-ро пахш кунед.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Detailed Information Modal on selection */}
        <AnimatePresence>
          {isCalculatorOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => setIsCalculatorOpen(false)}
            >
              <motion.div
                initial={{ y: 50, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 50, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="bg-white rounded-[32px] w-full max-w-lg p-6 sm:p-8 space-y-6 text-left shadow-2xl relative my-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                      <Calculator className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-base leading-tight">
                        {editingId ? 'Таҳрири Ҳисоби Хона' : 'Ҳисоби Нави Хароҷот'}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">
                        Тақсими баробари маблағ барои хӯрок
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
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Номи ҳисоб</label>
                  <input
                    type="text"
                    value={calcTitle}
                    onChange={(e) => setCalcTitle(e.target.value)}
                    placeholder="Масалан: Июл"
                    className="max-w-[60%] w-full bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
                  />
                </div>

                {/* Input Fields / Roommate List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> Рӯйхати ҳамхонаҳо ва хароҷот
                    </span>
                    <button
                      onClick={addRoommate}
                      className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Иловаи нав
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                    {calcRoommates.map((roommate) => (
                      <div key={roommate.id} className="flex items-start gap-2">
                        <input
                          type="text"
                          value={roommate.name}
                          onChange={(e) => updateRoommateName(roommate.id, e.target.value)}
                          placeholder="Ҳамхонаи беном"
                          className="flex-1 min-w-[100px] bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white mt-[1px]"
                        />
                        <div className="relative w-28 sm:w-32">
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
                                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-6 pr-8 py-2 text-xs font-mono font-bold text-slate-700 text-right focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white resize-none scrollbar-none block leading-normal"
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
                    <span className="text-sm font-black text-slate-800 block mt-1 font-mono">+{totalSpent} c.</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Шумораи нафар</span>
                    <span className="text-sm font-black text-slate-800 block mt-1 font-mono">{calcRoommates.length} наф.</span>
                  </div>
                  <div className="bg-emerald-50/40 border border-emerald-100 p-2.5 rounded-xl">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">Саҳми ҳар нафар</span>
                    <span className="text-sm font-black text-emerald-700 block mt-1 font-mono">+{perPersonShare} c.</span>
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
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-slate-700">{settlement.from}</span>
                            <span className="text-slate-400 text-[10px] font-semibold">бояд диҳад ба:</span>
                            <span className="font-bold text-emerald-700">{settlement.to}</span>
                          </div>
                          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg font-mono">
                            +{settlement.amount} c.
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center py-4 text-emerald-600 bg-emerald-50/30 border border-emerald-100/50 rounded-xl text-xs font-bold">
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
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Сохранить
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
