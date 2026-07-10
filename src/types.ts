export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  category: string;
  color: 'emerald' | 'amber' | 'violet' | 'rose' | 'blue' | 'indigo' | 'pink' | 'slate';
  emoji: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsLog {
  id: string;
  goalId: string;
  amount: number; // positive for deposit, negative for withdrawal
  date: string;
  description: string;
}
