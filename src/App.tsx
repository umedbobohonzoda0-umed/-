import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  Home, 
  FolderOpen, 
  ShoppingBag, 
  User as UserIcon, 
  Star, 
  Plus, 
  Minus, 
  X, 
  Check, 
  ArrowLeft, 
  Percent, 
  Clock, 
  Sparkles, 
  ArrowRight,
  Navigation,
  CheckCircle2,
  Gift,
  Settings,
  Bell,
  Mic
} from 'lucide-react';
import { Product, CartItem, Order, Category } from './types';

// ==========================================
// STATIC DATABASE FOR PREMIUM FLOWERS & GIFTS
// ==========================================

const CATEGORIES: Category[] = [
  {
    id: 'flowers',
    name: 'Цветы',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'gifts',
    name: 'Подарки',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'plants',
    name: 'Комнатные растения',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'cosmetics',
    name: 'Косметика',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'sweets',
    name: 'Торты и сладости',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'certificates',
    name: 'Подарочные сертификаты',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=200&q=80'
  }
];

const PRODUCTS: Product[] = [
  // Цветы
  {
    id: 'fl-1',
    name: 'Букет кустовых пионовидных роз',
    category: 'flowers',
    price: 3490,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewsCount: 124,
    description: 'Пышный букет из отборных розовых кустовых роз в фирменной дизайнерской матовой бумаге с атласной лентой. Обладает нежным ароматом и стойкостью до 12 дней.',
    badge: 'Популярно',
    sizeOptions: ['S (9 роз)', 'M (15 роз)', 'L (25 роз)']
  },
  {
    id: 'fl-2',
    name: 'Королевские красные розы (15 шт)',
    category: 'flowers',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviewsCount: 98,
    description: 'Классический премиум-букет из алых эквадорских роз высотой 60 см. Идеальный способ выразить сильные чувства и страсть. Букет перевязан лаконичной шелковой лентой.',
    sizeOptions: ['15 роз', '25 роз', '51 роза']
  },
  {
    id: 'fl-3',
    name: 'Нежное облако садовых ромашек',
    category: 'flowers',
    price: 2190,
    image: 'https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviewsCount: 54,
    description: 'Милый, легкий и невероятно искренний букет из свежих садовых ромашек. Дарит солнечное летнее настроение и тепло в любое время года.',
    badge: 'Скидка'
  },

  // Подарки
  {
    id: 'gf-1',
    name: 'Подарочный бокс Sweet Dreams',
    category: 'gifts',
    price: 1990,
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewsCount: 86,
    description: 'Элегантный крафтовый бокс с наполнителем, включающий в себя нежные маршмеллоу, премиальный листовой ягодный чай, дизайнерскую кружку ручной работы и открытку.',
    badge: 'Новинка'
  },
  {
    id: 'gf-2',
    name: 'Плюшевый мишка Барни (50 см)',
    category: 'gifts',
    price: 2490,
    image: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviewsCount: 42,
    description: 'Невероятно мягкий и приятный на ощупь гипоаллергенный медвежонок нежного кремового цвета. Станет идеальным дополнением к букету цветов для дорогого человека.'
  },
  {
    id: 'gf-3',
    name: 'Набор соевых аромасвечей',
    category: 'gifts',
    price: 1290,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewsCount: 73,
    description: 'Три натуральные свечи ручной работы из 100% соевого воска в эстетичных стеклянных баночках. Ароматы: лаванда и кокос, соленая карамель, французская ваниль.',
    badge: 'Хит'
  },

  // Растения
  {
    id: 'pl-1',
    name: 'Монстера Деликатесная в кашпо',
    category: 'plants',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviewsCount: 39,
    description: 'Популярное комнатное растение с шикарными резными листьями в стильном минималистичном терракотовом горшке. Отлично очищает воздух и дополняет современный интерьер.'
  },
  {
    id: 'pl-2',
    name: 'Кашпо с миксом суккулентов',
    category: 'plants',
    price: 1490,
    image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    reviewsCount: 27,
    description: 'Живописная мини-композиция из трех видов неприхотливых суккулентов в дизайнерском бетонном кашпо. Практически не требует полива, идеален для рабочего стола.'
  },
  {
    id: 'pl-3',
    name: 'Фикус Лирата на штамбе',
    category: 'plants',
    price: 3900,
    image: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewsCount: 15,
    description: 'Экзотическое комнатное дерево с крупными блестящими листьями в форме лиры. Нуждается в ярком рассеянном свете и регулярном опрыскивании.'
  },

  // Косметика
  {
    id: 'cs-1',
    name: 'Набор спа-кремов для рук',
    category: 'cosmetics',
    price: 890,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewsCount: 110,
    description: 'Набор из трех питательных кремов на основе масел ши, миндаля и экстракта розы. Моментально устраняет сухость, делая кожу рук шелковистой.',
    badge: 'Органика'
  },
  {
    id: 'cs-2',
    name: 'Гидрогелевые патчи с золотом',
    category: 'cosmetics',
    price: 1190,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviewsCount: 64,
    description: 'Увлажняющие патчи премиального корейского бренда. Разглаживают мелкие морщины под глазами, снимают утренние отеки и темные круги за 15 минут.'
  },
  {
    id: 'cs-3',
    name: 'Органическая мицеллярная вода',
    category: 'cosmetics',
    price: 650,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviewsCount: 41,
    description: 'Деликатное средство для снятия макияжа на основе цветочной воды василька и органического алоэ. Без отдушек, парабенов и спирта.'
  },

  // Торты
  {
    id: 'sw-1',
    name: "Бенто-торт 'Клубника-Ваниль'",
    category: 'sweets',
    price: 1690,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewsCount: 156,
    description: 'Популярный мини-торт весом 400г в экологичном ланч-боксе с деревянной ложечкой и свечкой. Начинка: сочная лесная клубника с легким крем-чизом.',
    badge: 'Топ продаж'
  },
  {
    id: 'sw-2',
    name: 'Набор нежных макарун (12 шт)',
    category: 'sweets',
    price: 1390,
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviewsCount: 82,
    description: 'Французские миндальные пирожные с нежным ганашем. Вкусы: соленая карамель, спелая малина, фисташка, манго-маракуйя, лаванда, шоколад.'
  },
  {
    id: 'sw-3',
    name: 'Набор шоколадных трюфелей',
    category: 'sweets',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1548907040-4d42b52145ca?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewsCount: 49,
    description: 'Трюфели ручной работы из бельгийского темного и молочного шоколада. Посыпаны какао-пудрой и дробленым обжаренным фундуком. Изумительное лакомство.'
  },

  // Сертификаты
  {
    id: 'cr-1',
    name: 'Подарочный сертификат на 3000 ₽',
    category: 'certificates',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    reviewsCount: 210,
    description: 'Электронный сертификат номиналом 3000 рублей. Отличный способ дать получателю возможность самому выбрать идеальный подарок в нашем каталоге.'
  },
  {
    id: 'cr-2',
    name: 'Подарочный сертификат на 5000 ₽',
    category: 'certificates',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    reviewsCount: 145,
    description: 'Подарочный сертификат номиналом 5000 рублей. Приходит моментально на email в красивом праздничном оформлении с вашим персональным пожеланием.'
  },
  {
    id: 'cr-3',
    name: 'Подарочный сертификат на 10000 ₽',
    category: 'certificates',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    reviewsCount: 88,
    description: 'Премиальный электронный сертификат на сумму 10000 рублей. Позволит заказать роскошную авторскую корзину цветов, комнатное дерево или набор сладостей.'
  }
];

export default function App() {
  // ==========================================
  // APP STATE MANAGERS
  // ==========================================
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'cart' | 'profile'>('catalog');
  const [deliveryOption, setDeliveryOption] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('Москва, Центральный пр. Хорошёвский, д. 12');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // percentage e.g., 10 for 10%
  const [promoError, setPromoError] = useState('');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-8941',
      date: '10.07.2026',
      items: [
        {
          product: PRODUCTS[0], // кустовые розы
          quantity: 1
        }
      ],
      total: 3490,
      status: 'delivered',
      address: 'Москва, Центральный пр. Хорошёвский, д. 12',
      deliveryOption: 'delivery'
    }
  ]);
  
  // Tracking simulator for current order
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [trackingStep, setTrackingStep] = useState<number>(0);

  // Address editing modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);

  // Simulated GPS Courier coordinate for tracking screen
  const [courierProgress, setCourierProgress] = useState(0);

  // ==========================================
  // EFFECT FOR SIMULATED LIVE TRACKING PROGRESS
  // ==========================================
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeOrder && activeOrder.status !== 'delivered') {
      interval = setInterval(() => {
        setCourierProgress((prev) => {
          if (prev >= 100) {
            // Update active order status
            setActiveOrder(currentOrder => {
              if (!currentOrder) return null;
              let nextStatus: 'pending' | 'preparing' | 'delivering' | 'delivered' = 'pending';
              if (currentOrder.status === 'pending') {
                nextStatus = 'preparing';
                setTrackingStep(1);
              } else if (currentOrder.status === 'preparing') {
                nextStatus = 'delivering';
                setTrackingStep(2);
              } else if (currentOrder.status === 'delivering') {
                nextStatus = 'delivered';
                setTrackingStep(3);
                // Also save to history
                setOrders(prevOrders => [
                  { ...currentOrder, status: 'delivered' },
                  ...prevOrders.filter(o => o.id !== currentOrder.id)
                ]);
              }
              return { ...currentOrder, status: nextStatus };
            });
            return 0; // reset animation cycle
          }
          return prev + 1.2;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [activeOrder]);

  // ==========================================
  // CART FUNCTIONS
  // ==========================================
  const addToCart = (product: Product, size?: string) => {
    const finalProduct = size ? { ...product, selectedSize: size } : product;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.product.selectedSize === size
      );
      if (existingIndex > -1) {
        const nextCart = [...prev];
        nextCart[existingIndex].quantity += 1;
        return nextCart;
      }
      return [...prev, { product: finalProduct, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === productId && item.product.selectedSize === size
      );
      if (existingIndex > -1) {
        const nextCart = [...prev];
        if (nextCart[existingIndex].quantity <= 1) {
          nextCart.splice(existingIndex, 1);
        } else {
          nextCart[existingIndex].quantity -= 1;
        }
        return nextCart;
      }
      return prev;
    });
  };

  const getProductQuantity = (productId: string, size?: string) => {
    const item = cart.find(
      (item) => item.product.id === productId && item.product.selectedSize === size
    );
    return item ? item.quantity : 0;
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'FLOWWOW10' || code === 'SPRING' || code === 'ЛЕТО') {
      setAppliedDiscount(10);
      setPromoError('');
    } else {
      setPromoError('Неверный промокод. Попробуйте "SPRING"');
      setAppliedDiscount(0);
    }
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((cartSubtotal * appliedDiscount) / 100);
  const deliveryFee = deliveryOption === 'pickup' ? 0 : cartSubtotal > 3000 ? 0 : 250;
  const cartTotal = cartSubtotal - discountAmount + deliveryFee;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('ru-RU'),
      items: [...cart],
      total: cartTotal,
      status: 'pending',
      address: address,
      deliveryOption: deliveryOption
    };

    setActiveOrder(newOrder);
    setTrackingStep(0);
    setCourierProgress(0);
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setPromoCode('');
    setAppliedDiscount(0);
    setActiveTab('profile'); // Switch to profile to track active order
  };

  // ==========================================
  // FILTERS & SEARCH
  // ==========================================
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory) {
      return product.category === selectedCategory.id && matchesSearch;
    }
    return matchesSearch;
  });

  return (
    <div className="h-screen w-screen bg-white flex flex-col antialiased relative overflow-hidden">
      
      {/* ==========================================
          PREMIUM STICKY HEADER (Matches mockup exactly)
          ========================================== */}
      <div className="bg-white px-5 pt-5 pb-4 sticky top-0 z-40 border-b border-slate-100 flex flex-col gap-3.5 shadow-xs">
        {/* Title & Action Icons Row */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeTab === 'catalog' && selectedCategory ? selectedCategory.name : activeTab === 'home' ? 'Главная' : activeTab === 'cart' ? 'Корзина' : activeTab === 'profile' ? 'Профиль' : 'Payments'}
          </h1>
          
          {/* Action Icons aligned right */}
          <div className="flex items-center gap-4">
            {/* Notification Bell with red dot */}
            <button 
              onClick={() => {
                alert('У вас нет новых уведомлений');
              }}
              className="relative text-slate-800 hover:text-purple-600 transition-colors p-1 cursor-pointer"
            >
              <Bell className="w-6.5 h-6.5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ff5a1f] rounded-full ring-2 ring-white"></span>
            </button>

            {/* Settings Gear */}
            <button 
              onClick={() => {
                setTempAddress(address);
                setIsAddressModalOpen(true);
              }}
              className="text-slate-800 hover:text-purple-600 transition-colors p-1 cursor-pointer"
            >
              <Settings className="w-6.5 h-6.5" />
            </button>
          </div>
        </div>

        {/* Search Input Box with microphone */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'catalog') {
                setActiveTab('catalog');
              }
            }}
            placeholder="Name or keywords"
            className="w-full bg-[#f3f4f6] border-0 rounded-2xl pl-11 pr-11 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          
          {/* Voice microphone icon trigger */}
          <button 
            onClick={() => {
              const words = ['Розы', 'Бенто', 'Подарки', 'Растения'];
              const randWord = words[Math.floor(Math.random() * words.length)];
              setSearchQuery(randWord);
              if (activeTab !== 'catalog') setActiveTab('catalog');
            }}
            className="absolute right-4 top-3.5 text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
            title="Голосовой поиск"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        {/* Super compact Delivery Toggle & Address Selector */}
        <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-slate-50">
          <div className="bg-[#f3f4f6] p-0.5 rounded-xl flex items-center shrink-0">
            <button
              onClick={() => setDeliveryOption('delivery')}
              className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                deliveryOption === 'delivery'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Доставка
            </button>
            <button
              onClick={() => setDeliveryOption('pickup')}
              className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                deliveryOption === 'pickup'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Самовывоз
            </button>
          </div>

          <button
            onClick={() => {
              setTempAddress(address);
              setIsAddressModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-left hover:opacity-85 transition-opacity overflow-hidden"
          >
            <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span className="text-[11px] font-bold text-slate-600 truncate max-w-[150px]">
              {deliveryOption === 'delivery' ? address : 'Пункт выдачи: Хорошёвский пр-д, 12'}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          </button>
        </div>
      </div>

      {/* ==========================================
          SCROLLABLE CONTENT PANEL
          ========================================== */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24">
          
          <AnimatePresence mode="wait">
            
            {/* TAB 1: HOME PAGE */}
            {activeTab === 'home' && (
              <motion.div
                key="home-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Greeting Banner */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-5 text-white relative overflow-hidden shadow-md">
                  <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-15">
                    <Gift className="w-40 h-40" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full inline-block mb-2">
                    Промокод: SPRING
                  </span>
                  <h2 className="text-xl font-black leading-tight">
                    Подарки и цветы <br />с доставкой за 30 мин!
                  </h2>
                  <p className="text-xs text-indigo-100 mt-2 font-medium">
                    Скидка 10% на ваш первый праздничный заказ в каталоге
                  </p>
                </div>

                {/* Categories Quick Links Grid */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-black text-slate-800">Быстрый выбор</h3>
                    <button 
                      onClick={() => { setActiveTab('catalog'); setSelectedCategory(null); }}
                      className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-0.5"
                    >
                      Все категории <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {CATEGORIES.slice(0, 3).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setActiveTab('catalog');
                        }}
                        className="bg-white border border-slate-100 p-3 rounded-2xl flex flex-col items-center text-center hover:border-purple-200 hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden mb-1.5">
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[10px] font-black text-slate-700 leading-tight">
                          {cat.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Offers Section */}
                <div>
                  <h3 className="text-sm font-black text-slate-800 mb-3">Горячие предложения</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {PRODUCTS.filter(p => p.badge).map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => setSelectedProduct(prod)}
                        className="bg-white border border-slate-100 rounded-2xl p-3 space-y-2 relative shadow-xs cursor-pointer hover:border-purple-100 transition-all"
                      >
                        {prod.badge && (
                          <span className="absolute top-2 left-2 z-10 text-[9px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full">
                            {prod.badge}
                          </span>
                        )}
                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1 mb-0.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-[9px] font-bold text-slate-500">{prod.rating}</span>
                          </div>
                          <h4 className="text-[11px] font-black text-slate-800 leading-tight line-clamp-2 min-h-[30px]">
                            {prod.name}
                          </h4>
                          <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-50">
                            <span className="text-xs font-black text-slate-900 font-mono">
                              {prod.price} ₽
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (prod.sizeOptions) {
                                  setSelectedProduct(prod);
                                } else {
                                  addToCart(prod);
                                }
                              }}
                              className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: CATALOG PAGE (The exact visual requested) */}
            {activeTab === 'catalog' && (
              <motion.div
                key="catalog-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Subcategory Browser Mode */}
                {!selectedCategory ? (
                  <>
                    {/* Header: Категории (Matches font and style) */}
                    <div className="pt-2">
                      <h2 className="text-[1.8rem] font-bold text-slate-800 tracking-tight">
                        Категории
                      </h2>
                    </div>

                    {/* 2-Column Grid matching Category Layout */}
                    <div className="grid grid-cols-2 gap-3.5">
                      {CATEGORIES.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat)}
                          className="bg-[#f5f5f7] rounded-[20px] p-4.5 h-32 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:bg-slate-200 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-250 group"
                        >
                          {/* Title Top Left */}
                          <div className="max-w-[70%] z-10">
                            <h3 className="text-[1.15rem] font-bold text-slate-800 leading-tight tracking-tight group-hover:text-purple-700 transition-colors">
                              {cat.name}
                            </h3>
                          </div>

                          {/* Image Bottom Right */}
                          <div className="absolute right-3.5 bottom-3.5 w-16 h-16 rounded-[14px] overflow-hidden bg-white shadow-sm shrink-0 border border-slate-100">
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  // Category Detail Listing View
                  <div className="space-y-4 pt-1">
                    {/* Category Header Row */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 text-slate-700" />
                      </button>
                      <h3 className="text-[1.5rem] font-bold text-slate-800 tracking-tight">
                        {selectedCategory.name}
                      </h3>
                    </div>

                    {/* Category Products Grid */}
                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3.5">
                        {filteredProducts.map((prod) => {
                          const quantityInCart = getProductQuantity(prod.id);
                          return (
                            <div
                              key={prod.id}
                              onClick={() => setSelectedProduct(prod)}
                              className="bg-white border border-slate-100 rounded-[20px] p-3 space-y-2 relative shadow-xs cursor-pointer hover:border-purple-200 hover:shadow-sm transition-all"
                            >
                              {prod.badge && (
                                <span className="absolute top-2.5 left-2.5 z-10 text-[8.5px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-md">
                                  {prod.badge}
                                </span>
                              )}
                              <div className="w-full aspect-square rounded-[16px] overflow-hidden bg-slate-50">
                                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                  <span className="text-[10px] font-extrabold text-slate-500">{prod.rating}</span>
                                  <span className="text-[9px] text-slate-400 font-bold">({prod.reviewsCount})</span>
                                </div>
                                <h4 className="text-[11px] font-black text-slate-800 leading-tight line-clamp-2 min-h-[30px]">
                                  {prod.name}
                                </h4>
                                <div className="flex justify-between items-center pt-1 border-t border-slate-50 mt-2">
                                  <span className="text-xs font-black text-slate-900 font-mono">
                                    {prod.price} ₽
                                  </span>
                                  
                                  {quantityInCart > 0 ? (
                                    <div className="flex items-center bg-purple-50 rounded-full border border-purple-100">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeFromCart(prod.id);
                                        }}
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-100 cursor-pointer"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </button>
                                      <span className="text-[11px] font-black text-purple-700 px-1 font-mono">
                                        {quantityInCart}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          addToCart(prod);
                                        }}
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-100 cursor-pointer"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (prod.sizeOptions) {
                                          setSelectedProduct(prod);
                                        } else {
                                          addToCart(prod);
                                        }
                                      }}
                                      className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors flex items-center justify-center cursor-pointer border border-purple-100"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-xs text-slate-400 font-bold">
                          В этой категории пока нет подходящих товаров.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: SHOPPING CART */}
            {activeTab === 'cart' && (
              <motion.div
                key="cart-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="pt-1">
                  <h2 className="text-[1.8rem] font-bold text-slate-800 tracking-tight">
                    Корзина
                  </h2>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-slate-50 rounded-[24px] border border-dashed border-slate-200">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-black text-slate-700">Корзина пуста</h3>
                    <p className="text-[11px] text-slate-400 font-bold max-w-xs mx-auto mt-1 leading-relaxed">
                      Добавьте прекрасные цветы или подарки из каталога, чтобы порадовать близких!
                    </p>
                    <button
                      onClick={() => setActiveTab('catalog')}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Перейти в каталог
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Items List */}
                    <div className="space-y-2.5">
                      {cart.map((item) => (
                        <div
                          key={`${item.product.id}-${item.product.selectedSize || ''}`}
                          className="bg-white border border-slate-100 rounded-2xl p-3 flex gap-3 shadow-xs"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h4 className="text-xs font-black text-slate-800 truncate">
                                {item.product.name}
                              </h4>
                              {item.product.selectedSize && (
                                <span className="text-[9px] font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                                  Размер: {item.product.selectedSize}
                                </span>
                              )}
                            </div>

                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs font-black text-slate-900 font-mono">
                                {item.product.price * item.quantity} ₽
                              </span>

                              <div className="flex items-center bg-slate-50 border border-slate-100 rounded-lg">
                                <button
                                  onClick={() => removeFromCart(item.product.id, item.product.selectedSize)}
                                  className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-l-lg cursor-pointer"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="text-xs font-black text-slate-800 px-2 font-mono">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => addToCart(item.product, item.product.selectedSize)}
                                  className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-r-lg cursor-pointer"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Promocode Block */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Промокод</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Напр. SPRING"
                          className="flex-1 bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 uppercase focus:outline-none focus:ring-1 focus:ring-purple-400"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className="bg-slate-800 hover:bg-slate-900 text-white font-black text-[11px] px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
                        >
                          Применить
                        </button>
                      </div>
                      {appliedDiscount > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-black">
                          <Check className="w-3.5 h-3.5 stroke-[3px]" /> Промокод активирован! Скидка {appliedDiscount}%
                        </div>
                      )}
                      {promoError && (
                        <p className="text-[10px] text-rose-500 font-bold">{promoError}</p>
                      )}
                    </div>

                    {/* Delivery Summary Block */}
                    <div className="bg-[#f5f5f7] rounded-2xl p-4 space-y-2.5">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Товары ({cart.reduce((sum, i) => sum + i.quantity, 0)} шт)</span>
                        <span className="font-mono">{cartSubtotal} ₽</span>
                      </div>
                      
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-xs font-bold text-emerald-600">
                          <span>Скидка ({appliedDiscount}%)</span>
                          <span className="font-mono">-{discountAmount} ₽</span>
                        </div>
                      )}

                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Способ доставки: {deliveryOption === 'delivery' ? 'Курьер' : 'Самовывоз'}</span>
                        <span className="font-mono">{deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₽`}</span>
                      </div>

                      <div className="border-t border-slate-200 pt-2.5 flex justify-between items-center">
                        <span className="text-xs font-black text-slate-800">Итого</span>
                        <span className="text-base font-black text-purple-700 font-mono">{cartTotal} ₽</span>
                      </div>
                    </div>

                    {/* Delivery Option Info */}
                    <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-3 flex gap-2.5">
                      <Clock className="w-4.5 h-4.5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-black text-purple-800 block">Условия доставки</span>
                        <p className="text-[10px] text-purple-600 font-bold mt-0.5">
                          {deliveryOption === 'delivery' 
                            ? 'Доставка осуществляется в течение 30-50 минут. Бесплатно при заказе от 3000 ₽.'
                            : 'Вы можете забрать ваш заказ в любое удобное время с 09:00 до 21:00.'}
                        </p>
                      </div>
                    </div>

                    {/* Order Button */}
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-3.5 rounded-[18px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow"
                    >
                      <span>Оформить заказ на {cartTotal} ₽</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 4: PROFILE & ORDER TRACKING */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* User Info */}
                <div className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-[24px] shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                    <UserIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-800">Umed Bobohonzoda</h2>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">+7 (999) 123-45-67</span>
                  </div>
                </div>

                {/* Simulated Live Order Tracker (Displays when user checkout) */}
                {activeOrder && activeOrder.status !== 'delivered' && (
                  <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-4 shadow-md relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10">
                      <Navigation className="w-32 h-32 text-white" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[8px] font-black uppercase bg-purple-600 text-white px-2 py-0.5 rounded-full">
                          Активный заказ
                        </span>
                        <h3 className="text-xs font-black mt-1.5">{activeOrder.id}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-purple-400 font-mono">
                          {activeOrder.total} ₽
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5">30-50 мин</span>
                      </div>
                    </div>

                    {/* Step Timeline Graphic */}
                    <div className="space-y-3 pt-2">
                      <div className="relative pl-6 space-y-4">
                        {/* vertical stem connector line */}
                        <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-slate-700"></div>

                        {/* Step 1: Pending / Preparing */}
                        <div className="relative">
                          <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                            trackingStep >= 0 
                              ? 'bg-purple-600 border-purple-400' 
                              : 'bg-slate-800 border-slate-700'
                          }`}>
                            {trackingStep > 0 && <Check className="w-2 h-2 text-white" />}
                          </div>
                          <div>
                            <span className={`text-[11px] font-black ${trackingStep >= 0 ? 'text-white' : 'text-slate-500'}`}>
                              Заказ принят в работу
                            </span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">Проверяем наличие и свежесть</span>
                          </div>
                        </div>

                        {/* Step 2: Preparing */}
                        <div className="relative">
                          <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                            trackingStep >= 1 
                              ? 'bg-purple-600 border-purple-400' 
                              : 'bg-slate-800 border-slate-700'
                          }`}>
                            {trackingStep > 1 && <Check className="w-2 h-2 text-white" />}
                          </div>
                          <div>
                            <span className={`text-[11px] font-black ${trackingStep >= 1 ? 'text-white' : 'text-slate-500'}`}>
                              Флорист собирает заказ
                            </span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">Оформляем в праздничный бокс</span>
                          </div>
                        </div>

                        {/* Step 3: Delivering */}
                        <div className="relative">
                          <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                            trackingStep >= 2 
                              ? 'bg-purple-600 border-purple-400' 
                              : 'bg-slate-800 border-slate-700'
                          }`}>
                            {trackingStep > 2 && <Check className="w-2 h-2 text-white" />}
                          </div>
                          <div>
                            <span className={`text-[11px] font-black ${trackingStep >= 2 ? 'text-white' : 'text-slate-500'}`}>
                              Курьер уже в пути
                            </span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">Доставка на Хорошёвский пр-д</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Simulated GPS Map visual */}
                    <div className="w-full h-28 bg-slate-800 rounded-2xl relative overflow-hidden mt-3 border border-slate-750">
                      {/* Grid background */}
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                      
                      {/* SVG Simulated Route */}
                      <svg className="absolute inset-0 w-full h-full">
                        {/* Path Line */}
                        <path 
                          d="M 40 40 Q 150 20, 240 70 T 360 40" 
                          fill="none" 
                          stroke="#4b5563" 
                          strokeWidth="3" 
                          strokeDasharray="4 4"
                        />
                        <path 
                          d="M 40 40 Q 150 20, 240 70 T 360 40" 
                          fill="none" 
                          stroke="#a855f7" 
                          strokeWidth="3" 
                          strokeDashoffset={100 - courierProgress}
                          strokeDasharray="100 1000"
                        />
                      </svg>

                      {/* Store Marker */}
                      <div className="absolute left-10 top-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-500 flex items-center justify-center text-[10px]" title="Магазин">
                          🏪
                        </div>
                        <span className="text-[8px] font-extrabold text-slate-400 mt-0.5 bg-slate-900 px-1 rounded">Склад</span>
                      </div>

                      {/* Moving Courier Icon */}
                      <div 
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center transition-all duration-300"
                        style={{
                          left: `${40 + (320 * courierProgress) / 100}px`,
                          top: `${40 + Math.sin((courierProgress / 100) * Math.PI) * 20}px`
                        }}
                      >
                        <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-[10px] animate-bounce shadow-md">
                          🚴
                        </div>
                      </div>

                      {/* Destination Marker */}
                      <div className="absolute right-10 top-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-[10px] shadow-sm">
                          🏠
                        </div>
                        <span className="text-[8px] font-extrabold text-emerald-300 mt-0.5 bg-slate-900 px-1 rounded">Вы</span>
                      </div>

                      {/* Delivery text overlay */}
                      <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-[8px] font-extrabold text-slate-300">
                        Имитация GPS курьера... {Math.round(courierProgress)}%
                      </div>
                    </div>
                  </div>
                )}

                {/* History list */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">История заказов</h3>
                  
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-black text-slate-800 block">{ord.id}</span>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{ord.date}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full inline-block ${
                            ord.status === 'delivered' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-purple-50 text-purple-600 border border-purple-100'
                          }`}>
                            {ord.status === 'delivered' ? 'Доставлен' : 'В пути'}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-50 pt-2.5 space-y-1.5">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-xs font-bold text-slate-600">
                            <span className="truncate max-w-[70%]">{it.product.name} (x{it.quantity})</span>
                            <span className="font-mono text-slate-900">{it.product.price * it.quantity} ₽</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-slate-50 pt-2.5 flex justify-between items-center text-xs">
                        <span className="font-black text-slate-800">Итоговая стоимость</span>
                        <span className="font-black text-purple-700 font-mono">{ord.total} ₽</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ==========================================
            DYNAMIC BOTTOM TAB NAVIGATION
            ========================================== */}
        <div className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around z-45 px-2 shadow-lg">
          {/* Tab 1: Главная */}
          <button
            onClick={() => {
              setActiveTab('home');
              setSelectedCategory(null);
            }}
            className={`flex flex-col items-center justify-center py-2 flex-1 cursor-pointer transition-colors ${
              activeTab === 'home' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-black">Главная</span>
          </button>

          {/* Tab 2: Каталог (ACTIVE IN MOCKUP) */}
          <button
            onClick={() => {
              setActiveTab('catalog');
              setSelectedCategory(null);
            }}
            className={`flex flex-col items-center justify-center py-2 flex-1 cursor-pointer transition-colors ${
              activeTab === 'catalog' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FolderOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-black">Каталог</span>
          </button>

          {/* Tab 3: Корзина */}
          <button
            onClick={() => {
              setActiveTab('cart');
            }}
            className={`flex flex-col items-center justify-center py-2 flex-1 relative cursor-pointer transition-colors ${
              activeTab === 'cart' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {cart.length > 0 && (
              <span className="absolute top-1 right-5 bg-purple-600 text-white font-mono font-bold text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-black">Корзина</span>
          </button>

          {/* Tab 4: Профиль */}
          <button
            onClick={() => {
              setActiveTab('profile');
            }}
            className={`flex flex-col items-center justify-center py-2 flex-1 cursor-pointer transition-colors ${
              activeTab === 'profile' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <UserIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-black">Профиль</span>
          </button>
        </div>

        {/* ==========================================
            EDIT ADDRESS BOTTOM DRAWER / MODAL
            ========================================== */}
        <AnimatePresence>
          {isAddressModalOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddressModalOpen(false)}
                className="absolute inset-0 bg-black z-50"
              />
              {/* Drawer Content */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[28px] p-5 space-y-4 z-50 max-h-[80%] overflow-y-auto shadow-2xl"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-800">Изменить адрес доставки</h3>
                  <button
                    onClick={() => setIsAddressModalOpen(false)}
                    className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      Адрес доставки
                    </label>
                    <textarea
                      value={tempAddress}
                      onChange={(e) => setTempAddress(e.target.value)}
                      placeholder="Введите город, улицу, дом, квартиру..."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-400"
                    />
                  </div>

                  {/* Preset Quick Addresses */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Быстрый выбор</span>
                    {[
                      'Москва, Центральный пр. Хорошёвский, д. 12',
                      'Москва, ул. Ленина, д. 45, кв. 89',
                      'Москва, Кутузовский проспект, д. 10',
                    ].map((addr) => (
                      <button
                        key={addr}
                        onClick={() => setTempAddress(addr)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 cursor-pointer ${
                          tempAddress === addr
                            ? 'bg-purple-50 border-purple-200 text-purple-700'
                            : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                        <span className="truncate">{addr}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setAddress(tempAddress);
                      setIsAddressModalOpen(false);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Сохранить адрес
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ==========================================
            PRODUCT DETAIL FULL SLIDE-UP MODAL
            ========================================== */}
        <AnimatePresence>
          {selectedProduct && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                className="absolute inset-0 bg-black z-50"
              />
              {/* Slide-up Container */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-50 max-h-[92%] overflow-y-auto shadow-2xl flex flex-col"
              >
                {/* Close Button on Top Right of image */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute right-4 top-4 z-55 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-slate-700 shadow-md hover:bg-white cursor-pointer transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>

                {/* Main scroll content */}
                <div className="flex-1 overflow-y-auto">
                  {/* Hero image */}
                  <div className="w-full aspect-[4/3] bg-slate-50 relative">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {selectedProduct.badge && (
                      <span className="absolute bottom-4 left-4 z-10 text-[9px] font-black bg-rose-500 text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {selectedProduct.badge}
                      </span>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-black text-slate-700">{selectedProduct.rating}</span>
                        <span className="text-xs font-bold text-slate-400">({selectedProduct.reviewsCount} отзывов)</span>
                      </div>
                      <h2 className="text-base font-black text-slate-800 leading-tight">
                        {selectedProduct.name}
                      </h2>
                      <div className="text-lg font-black text-purple-700 font-mono pt-1">
                        {selectedProduct.price} ₽
                      </div>
                    </div>

                    {/* Size Selector if available */}
                    {selectedProduct.sizeOptions && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Выберите размер</span>
                        <div className="flex gap-2">
                          {selectedProduct.sizeOptions.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => setSelectedProduct({ ...selectedProduct, selectedSize: opt })}
                              className={`flex-1 py-2 rounded-xl text-xs font-black border transition-colors cursor-pointer text-center ${
                                (selectedProduct.selectedSize || selectedProduct.sizeOptions?.[0]) === opt
                                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                                  : 'bg-white border-slate-150 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description block */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Описание товара</span>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>

                    {/* Guarantees Box */}
                    <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span>Гарантия свежести и качества</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                        Все цветы и сладости собираются индивидуально за 1 час до доставки. Делаем бесплатное фото готового букета перед отправкой курьером.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-5 border-t border-slate-100 bg-white">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        const sizeToUse = selectedProduct.selectedSize || selectedProduct.sizeOptions?.[0];
                        addToCart(selectedProduct, sizeToUse);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-3 rounded-[16px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow"
                    >
                      <ShoppingBag className="w-4.5 h-4.5" />
                      <span>В корзину за {selectedProduct.price} ₽</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
  );
}
