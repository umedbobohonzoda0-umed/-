import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bus, Train, Car, ChevronRight, PiggyBank, HelpCircle, Check, ArrowRight, Coins } from 'lucide-react';
import { Goal } from '../types';

interface TransportWidgetProps {
  goals: Goal[];
  onAddSavingsLog: (goalId: string, amount: number, description: string) => void;
  triggerToast: (msg: string) => void;
}

interface TransportItem {
  id: string;
  name: string;
  fare: number;
  icon: React.ReactNode;
  iconBg: string;
  textColor: string;
  description: string;
}

export function TransportWidget({ goals, onAddSavingsLog, triggerToast }: TransportWidgetProps) {
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
  const [taxiCost, setTaxiCost] = useState<number>(15); // Average taxi fare in Dushanbe
  const [tripsPerDay, setTripsPerDay] = useState<number>(2);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [customDays, setCustomDays] = useState<number>(7); // Weekly, monthly, etc.

  const transportItems: TransportItem[] = [
    {
      id: 'bus',
      name: 'Автобус',
      fare: 2.40,
      icon: <Bus className="w-5 h-5 text-white" />,
      iconBg: 'bg-red-500 shadow-lg shadow-red-500/20',
      textColor: 'text-red-600',
      description: 'Нархи роҳкиро бо корти шаҳрӣ: 2.40 TJS'
    },
    {
      id: 'marshrutka',
      name: 'Маршрутка',
      fare: 2.50,
      icon: <Car className="w-5 h-5 text-white" />,
      iconBg: 'bg-blue-500 shadow-lg shadow-blue-500/20',
      textColor: 'text-blue-600',
      description: 'Нархи роҳкиро вобаста ба самт: 2.50 TJS'
    },
    {
      id: 'trolleybus',
      name: 'Троллейбус',
      fare: 1.50,
      icon: <Train className="w-5 h-5 text-white" />,
      iconBg: 'bg-emerald-500 shadow-lg shadow-emerald-500/20',
      textColor: 'text-emerald-600',
      description: 'Нархи роҳкиро бо корти шаҳрӣ: 1.50 TJS'
    }
  ];

  const handleCardClick = (id: string) => {
    if (selectedTransport === id) {
      setSelectedTransport(null);
    } else {
      setSelectedTransport(id);
      // Auto-select the first unfinished goal if none is selected
      if (!selectedGoalId && goals.length > 0) {
        const unfinished = goals.find(g => g.currentAmount < g.targetAmount);
        setSelectedGoalId(unfinished ? unfinished.id : goals[0].id);
      }
    }
  };

  const activeItem = transportItems.find(item => item.id === selectedTransport);
  const dailyFare = activeItem ? activeItem.fare * tripsPerDay : 0;
  const taxiDailyCost = taxiCost * tripsPerDay;
  const dailySavings = Math.max(0, taxiDailyCost - dailyFare);
  const totalSavedForDays = dailySavings * customDays;

  const handleApplySavings = () => {
    if (!selectedGoalId) {
      triggerToast('Лутфан аввал ҳадафро интихоб кунед! 🎯');
      return;
    }
    if (totalSavedForDays <= 0) {
      triggerToast('Маблағи пасандоз бояд аз 0 зиёд бошад! 💰');
      return;
    }

    const goal = goals.find(g => g.id === selectedGoalId);
    if (!goal) return;

    const description = `Пасандози роҳкиро: Истифодаи ${activeItem?.name} ба ҷои такси (${customDays} рӯз)`;
    onAddSavingsLog(selectedGoalId, Number(totalSavedForDays.toFixed(2)), description);
    
    // Reset selection/state
    setSelectedTransport(null);
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-emerald-600" />
            Ҳисобкунаки Роҳкиро ва Пасандоз
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Бо истифодаи нақлиёти ҷамъиятӣ сарфа кунед ва пасандоз кунед
          </p>
        </div>
      </div>

      {/* Main Transport Cards List */}
      <div className="space-y-3">
        {transportItems.map((item) => {
          const isSelected = selectedTransport === item.id;
          return (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-100 transition-all">
              <button
                onClick={() => handleCardClick(item.id)}
                className={`w-full flex items-center justify-between p-3.5 bg-white hover:bg-slate-50/50 transition-all cursor-pointer text-left ${
                  isSelected ? 'bg-slate-50/80' : ''
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Rounded Icon Box */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-sm sm:text-base leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5 font-medium">
                      Роҳкиро: {item.fare.toFixed(2)} TJS
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase bg-slate-100 px-2 py-1 rounded-lg">
                    Ҳисоб кардан
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                    isSelected ? 'bg-emerald-100 rotate-90 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Calculator Panel Expansion */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-slate-50/60 border-t border-slate-100 px-4 py-4 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Inputs */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                          Нархи таксии алтернативӣ (TJS):
                        </label>
                        <input
                          type="number"
                          value={taxiCost}
                          onChange={(e) => setTaxiCost(Math.max(0, Number(e.target.value)))}
                          className="w-full text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                          Шумораи сафарҳо дар як рӯз:
                        </label>
                        <input
                          type="number"
                          value={tripsPerDay}
                          onChange={(e) => setTripsPerDay(Math.max(1, Number(e.target.value)))}
                          className="w-full text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                          Давраи ҳисоб (рӯзҳо):
                        </label>
                        <select
                          value={customDays}
                          onChange={(e) => setCustomDays(Number(e.target.value))}
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2 py-2 text-slate-700 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                        >
                          <option value={1}>1 рӯз</option>
                          <option value={7}>1 ҳафта (7 рӯз)</option>
                          <option value={30}>1 моҳ (30 рӯз)</option>
                        </select>
                      </div>
                    </div>

                    {/* Result and transfer to saving goals */}
                    <div className="p-3.5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 block">
                          Пасандози умумӣ барои {customDays} рӯз:
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-xl font-black font-mono text-emerald-700">
                            {totalSavedForDays.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-emerald-600 font-extrabold">TJS</span>
                        </div>
                        <p className="text-[9.5px] text-slate-400 mt-1">
                          Ҳисоб: ({taxiCost} - {item.fare}) TJS × {tripsPerDay} сафар × {customDays} рӯз
                        </p>
                      </div>

                      {/* Goal destination & Submit */}
                      <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        {goals.length === 0 ? (
                          <span className="text-[10px] text-slate-400 italic">
                            Аввал ҳадаф созед
                          </span>
                        ) : (
                          <>
                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] font-extrabold uppercase tracking-wider text-slate-400">Интихоби ҳадаф:</span>
                              <select
                                value={selectedGoalId}
                                onChange={(e) => setSelectedGoalId(e.target.value)}
                                className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                              >
                                {goals.map((goal) => (
                                  <option key={goal.id} value={goal.id}>
                                    {goal.emoji} {goal.title} ({Math.round((goal.currentAmount / goal.targetAmount) * 100)}%)
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              onClick={handleApplySavings}
                              className="mt-4 sm:mt-auto py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <PiggyBank className="w-3.5 h-3.5" />
                              <span>Илова ба пасандоз</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
