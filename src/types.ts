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

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviewsCount: number;
  description: string;
  badge?: string;
  sizeOptions?: string[];
  selectedSize?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'delivering' | 'delivered';
  address: string;
  deliveryOption: 'delivery' | 'pickup';
}

