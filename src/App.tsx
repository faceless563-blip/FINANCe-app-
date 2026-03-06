/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  CreditCard, 
  PieChart, 
  Calendar, 
  Plus, 
  Search, 
  Trash2, 
  ChevronRight, 
  Bell, 
  Users, 
  Smile, 
  Cookie, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  X,
  Settings,
  Menu,
  Home,
  LayoutDashboard,
  Zap,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants & Types ---

const CURRENCY = '৳';

const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#FF6B6B' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#4D96FF' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#FFD93D' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#6BCB77' },
  { id: 'bills', name: 'Bills & Utilities', icon: '💡', color: '#9B59B6' },
  { id: 'health', name: 'Health', icon: '🏥', color: '#E74C3C' },
  { id: 'income', name: 'Income', icon: '💰', color: '#2ECC71' },
  { id: 'other', name: 'Other', icon: '📦', color: '#95A5A6' },
];

const MOODS = [
  { id: 'stressed', emoji: '😰', label: 'Stressed', color: '#E74C3C' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: '#95A5A6' },
  { id: 'great', emoji: '💰', label: 'Great', color: '#2ECC71' },
  { id: 'splurged', emoji: '🛍️', label: 'Splurged', color: '#F1C40F' },
  { id: 'saved', emoji: '🎉', label: 'Saved', color: '#3498DB' },
];

const FORTUNE_COOKIES = [
  "A penny saved is a penny earned, but a penny invested is a future secured.",
  "Your wallet is like a garden; water it with savings and pull out the weeds of impulse.",
  "Beware of little expenses; a small leak will sink a great ship.",
  "The best time to save was yesterday. The second best time is today.",
  "Financial freedom is available to those who learn about it and work for it.",
  "Don't tell me where your priorities are. Show me where you spend your money.",
  "Wealth consists not in having great possessions, but in having few wants.",
  "Rich people stay rich by living like they're poor. Poor people stay poor by living like they're rich.",
  "Money is a great servant but a bad master.",
  "Invest in yourself. It pays the best interest."
];

const QUIZ_QUESTIONS = [
  {
    question: "When you see a '50% OFF' sign, what's your first thought?",
    options: [
      { text: "I must have it! It's a steal!", type: 'impulsive' },
      { text: "Do I actually need this?", type: 'planner' },
      { text: "Still too expensive, I'll pass.", type: 'saver' },
      { text: "I'll check my budget first.", type: 'balancer' }
    ]
  },
  {
    question: "How often do you check your bank balance?",
    options: [
      { text: "Every single morning.", type: 'saver' },
      { text: "Once a week.", type: 'planner' },
      { text: "Only when a card gets declined.", type: 'impulsive' },
      { text: "Whenever I make a big purchase.", type: 'balancer' }
    ]
  },
  {
    question: "What's your approach to savings?",
    options: [
      { text: "Save first, spend what's left.", type: 'saver' },
      { text: "Spend first, save what's left.", type: 'balancer' },
      { text: "I have a detailed spreadsheet for goals.", type: 'planner' },
      { text: "Savings? What are those?", type: 'impulsive' }
    ]
  },
  {
    question: "A friend asks you to go on an unplanned expensive trip. You:",
    options: [
      { text: "Say yes immediately! YOLO!", type: 'impulsive' },
      { text: "Politely decline, it's not in the budget.", type: 'saver' },
      { text: "See if I can cut costs elsewhere to make it work.", type: 'balancer' },
      { text: "Check my travel fund and decide.", type: 'planner' }
    ]
  },
  {
    question: "Your ideal financial state is:",
    options: [
      { text: "Having everything I want right now.", type: 'impulsive' },
      { text: "A massive emergency fund and no debt.", type: 'saver' },
      { text: "A balanced life with moderate luxuries.", type: 'balancer' },
      { text: "A perfectly optimized portfolio.", type: 'planner' }
    ]
  }
];

const PERSONALITIES = {
  planner: { name: "The Planner 📋", tip: "Your discipline is your strength. Don't forget to enjoy the fruits of your labor occasionally!" },
  impulsive: { name: "The Impulsive Buyer 🛍️", tip: "Try the 24-hour rule: wait a day before any non-essential purchase. Your wallet will thank you." },
  saver: { name: "The Saver 🏦", tip: "You're great at accumulating wealth. Consider low-risk investments to make your money work harder." },
  balancer: { name: "The Balancer ⚖️", tip: "You have a healthy relationship with money. Keep fine-tuning your habits for long-term growth." }
};

// --- Helper Components ---

const NumberCounter = ({ value, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    
    let totalDuration = 1500;
    let increment = end / (totalDuration / 16);
    
    let timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full glass-card border-gold/30 flex items-center gap-3 ${type === 'error' ? 'text-red-400' : 'text-gold'}`}
    >
      {type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
};

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: '100%', 
            left: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 0.5,
            rotate: 0
          }}
          animate={{ 
            top: '-10%',
            left: `${Math.random() * 100}%`,
            rotate: 360 * 2
          }}
          transition={{ 
            duration: Math.random() * 2 + 1,
            ease: "easeOut"
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ 
            backgroundColor: ['#c9a84c', '#e6c97a', '#a68a3d', '#ffffff'][Math.floor(Math.random() * 4)] 
          }}
        />
      ))}
    </div>
  );
};

// --- Main Application ---

export default function App() {
  // --- State ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [debts, setDebts] = useState([]);
  const [budgets, setBudgets] = useState([
    { id: 'food', limit: 0 },
    { id: 'transport', limit: 0 },
    { id: 'shopping', limit: 0 },
  ]);
  const [moods, setMoods] = useState({});
  const [bills, setBills] = useState([]);
  const [splits, setSplits] = useState([]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fortune, setFortune] = useState(FORTUNE_COOKIES[0]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizScores, setQuizScores] = useState({ planner: 0, impulsive: 0, saver: 0, balancer: 0 });
  const [personality, setPersonality] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // --- Effects ---
  useEffect(() => {
    const savedPersonality = localStorage.getItem('kosh_personality');
    if (!savedPersonality) {
      setShowQuiz(true);
    } else {
      setPersonality(JSON.parse(savedPersonality));
    }
    
    const savedMoods = localStorage.getItem('kosh_moods');
    if (savedMoods) setMoods(JSON.parse(savedMoods));

    // Initial fortune
    setFortune(FORTUNE_COOKIES[Math.floor(Math.random() * FORTUNE_COOKIES.length)]);
  }, []);

  // --- Calculations ---
  const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0), [transactions]);
  const balance = totalIncome - totalExpenses;
  const totalDebt = debts.reduce((acc, d) => acc + (d.total - d.paid), 0);
  const netWorth = balance - totalDebt;

  const budgetHealth = useMemo(() => {
    let totalLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
    let totalSpent = transactions
      .filter(t => t.type === 'expense' && budgets.some(b => b.id === t.category))
      .reduce((acc, t) => acc + t.amount, 0);
    
    if (totalLimit === 0) return 0;
    const score = Math.max(0, 100 - (totalSpent / totalLimit * 100));
    return Math.round(score);
  }, [budgets, transactions]);

  const financialHealthScore = useMemo(() => {
    if (transactions.length === 0 && debts.length === 0) return 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    const debtToIncome = totalIncome > 0 ? (totalDebt / (totalIncome * 12)) * 100 : 0;
    
    let score = 50;
    score += Math.min(30, savingsRate);
    score -= Math.min(30, debtToIncome);
    return Math.max(0, Math.min(100, Math.round(score)));
  }, [totalIncome, totalExpenses, totalDebt, transactions, debts]);

  const getHealthEmoji = (score) => {
    if (score > 80) return '💎 Excellent';
    if (score > 60) return '🌟 Good';
    if (score > 40) return '⚖️ Stable';
    return '⚠️ Needs Attention';
  };

  // --- Handlers ---
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTransaction = {
      id: Date.now(),
      type: formData.get('type') as string,
      category: formData.get('category') as string,
      amount: parseFloat(formData.get('amount') as string),
      note: formData.get('note') as string,
      date: formData.get('date') as string,
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setShowAddModal(false);
    addToast('Transaction added successfully!');
    
    // Check budget alerts
    const categoryBudget = budgets.find(b => b.id === newTransaction.category);
    if (categoryBudget) {
      const spentInCategory = transactions
        .filter(t => t.category === newTransaction.category && t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0) + newTransaction.amount;
      
      if (spentInCategory >= categoryBudget.limit * 0.8) {
        addToast(`Alert: You've spent 80% of your ${newTransaction.category} budget!`, 'error');
      }
    }
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    addToast('Transaction deleted', 'success');
  };

  const handleMoodSelect = (moodId) => {
    const today = new Date().toISOString().split('T')[0];
    const newMoods = { ...moods, [today]: moodId };
    setMoods(newMoods);
    localStorage.setItem('kosh_moods', JSON.stringify(newMoods));
    addToast(`Mood tracked: ${MOODS.find(m => m.id === moodId).label}`);
  };

  const handleQuizAnswer = (type) => {
    const newScores = { ...quizScores, [type]: quizScores[type] + 1 };
    setQuizScores(newScores);
    
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      const winner = Object.keys(newScores).reduce((a, b) => newScores[a] > newScores[b] ? a : b);
      const result = PERSONALITIES[winner];
      setPersonality(result);
      localStorage.setItem('kosh_personality', JSON.stringify(result));
      setShowQuiz(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newGoal = {
      id: Date.now(),
      emoji: formData.get('emoji') as string,
      name: formData.get('name') as string,
      target: parseFloat(formData.get('target') as string),
      saved: parseFloat(formData.get('saved') as string) || 0,
      deadline: formData.get('deadline') as string,
    };
    setGoals(prev => [...prev, newGoal]);
    setShowGoalModal(false);
    addToast('Goal created! Time to save. 🚀');
  };

  const handleUpdateBudget = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBudgets = budgets.map(b => ({
      ...b,
      limit: parseFloat(formData.get(b.id) as string) || 0
    }));
    setBudgets(newBudgets);
    setShowBudgetModal(false);
    addToast('Budgets updated successfully!');
  };

  const getFortune = () => {
    const newFortune = FORTUNE_COOKIES[Math.floor(Math.random() * FORTUNE_COOKIES.length)];
    setFortune(newFortune);
    addToast("New wisdom unlocked! 🥠");
  };

  // --- Sub-Components ---

  const Dashboard = () => (
    <div className="space-y-6 pb-24">
      <header className="flex justify-between items-center px-4 pt-6">
        <div>
          <h1 className="text-3xl font-bold gold-text-gradient">TANHA</h1>
          <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">Luxury Finance</p>
        </div>
        <div className="flex gap-3">
          <button onClick={getFortune} className="p-2 rounded-full glass-card border-gold/20 text-gold hover:bg-gold/10 transition-colors">
            <Cookie size={20} />
          </button>
          <button className="p-2 rounded-full glass-card border-gold/20 text-gold hover:bg-gold/10 transition-colors">
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* Net Worth Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 p-6 rounded-3xl glass-card border-gold/30 relative overflow-hidden gold-glow"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
        <p className="text-gray-400 text-sm font-medium mb-1">Total Net Worth</p>
        <h2 className="text-4xl font-bold mb-4">
          <NumberCounter value={netWorth} prefix={CURRENCY + ' '} />
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <p className="text-xs text-gray-500 mb-1">Monthly Income</p>
            <p className="text-emerald-400 font-bold flex items-center gap-1">
              <ArrowUpRight size={14} />
              {CURRENCY} {totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <p className="text-xs text-gray-500 mb-1">Monthly Expenses</p>
            <p className="text-rose-400 font-bold flex items-center gap-1">
              <ArrowDownRight size={14} />
              {CURRENCY} {totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Health Score */}
      <div className="px-4 grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-3xl glass-card border-gold/20 flex flex-col items-center justify-center text-center"
        >
          <p className="text-xs text-gray-500 uppercase tracking-tighter mb-2">Health Score</p>
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle 
                cx="40" cy="40" r="36" fill="transparent" stroke="#c9a84c" strokeWidth="8" 
                strokeDasharray={226}
                initial={{ strokeDashoffset: 226 }}
                animate={{ strokeDashoffset: 226 - (226 * financialHealthScore / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute text-xl font-bold">{financialHealthScore}</span>
          </div>
          <p className="mt-2 text-[10px] font-bold text-gold">{getHealthEmoji(financialHealthScore)}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => setShowBudgetModal(true)}
          className="p-4 rounded-3xl glass-card border-gold/20 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gold/5 transition-all"
        >
          <p className="text-xs text-gray-500 uppercase tracking-tighter mb-2">Budget Health</p>
          <div className="text-4xl font-bold gold-text-gradient mb-1">{budgetHealth}%</div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${budgetHealth}%` }}
              className="h-full gold-bg-gradient"
            />
          </div>
          <p className="mt-2 text-[10px] text-gray-400">Tap to set limits</p>
        </motion.div>
      </div>

      {/* Fortune Cookie */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mx-4 p-4 rounded-2xl bg-gold/5 border border-gold/20 flex gap-4 items-start"
      >
        <div className="p-2 bg-gold/10 rounded-xl text-gold">
          <Cookie size={24} />
        </div>
        <div>
          <p className="text-[10px] text-gold font-bold uppercase tracking-widest mb-1">Financial Fortune</p>
          <p className="text-sm italic text-gray-300">"{fortune}"</p>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <div className="px-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Recent Activity</h3>
          <button onClick={() => setActiveTab('transactions')} className="text-gold text-xs font-bold hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((t, idx) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-2xl glass-card border-white/5 flex items-center justify-between group hover:border-gold/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                  {CATEGORIES.find(c => c.id === t.category)?.icon || '📦'}
                </div>
                <div>
                  <p className="font-bold text-sm">{t.note}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
                    {CATEGORIES.find(c => c.id === t.category)?.name} • {t.date}
                  </p>
                </div>
              </div>
              <p className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                {t.type === 'income' ? '+' : '-'}{CURRENCY}{t.amount.toLocaleString()}
              </p>
            </motion.div>
          ))}
          {transactions.length === 0 && (
            <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center text-gray-500 text-xs">
              No recent activity. Tap + to add your first transaction.
            </div>
          )}
        </div>
      </div>

      {/* Mood Tracker Mini */}
      <div className="px-4 space-y-4">
        <h3 className="text-xl font-bold">How's your money mood?</h3>
        <div className="flex justify-between gap-2">
          {MOODS.map(mood => (
            <button 
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={`flex-1 aspect-square rounded-2xl glass-card border-white/5 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 ${moods[new Date().toISOString().split('T')[0]] === mood.id ? 'border-gold bg-gold/10' : ''}`}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-[8px] uppercase font-bold text-gray-400">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const TransactionsView = () => {
    const filteredTransactions = transactions.filter(t => {
      const matchesSearch = t.note.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           CATEGORIES.find(c => c.id === t.category)?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    });

    return (
      <div className="space-y-6 pb-24 px-4 pt-6">
        <h2 className="text-3xl font-bold gold-text-gradient">Ledger</h2>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl glass-card border-white/10 focus:border-gold outline-none text-sm transition-all"
            />
          </div>
          <button 
            onClick={() => setFilterType(prev => prev === 'all' ? 'expense' : prev === 'expense' ? 'income' : 'all')}
            className="p-3 rounded-2xl glass-card border-white/10 text-gold"
          >
            <Filter size={20} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['all', 'income', 'expense'].map(type => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${filterType === type ? 'gold-bg-gradient text-black' : 'glass-card border-white/10 text-gray-400'}`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.map((t) => (
              <motion.div 
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -100 }}
                className="p-4 rounded-2xl glass-card border-white/5 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                    {CATEGORIES.find(c => c.id === t.category)?.icon || '📦'}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.note}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
                      {CATEGORIES.find(c => c.id === t.category)?.name} • {t.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                    {t.type === 'income' ? '+' : '-'}{CURRENCY}{t.amount.toLocaleString()}
                  </p>
                  <button 
                    onClick={() => deleteTransaction(t.id)}
                    className="p-2 text-gray-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredTransactions.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <Zap size={40} className="mx-auto mb-4 opacity-20" />
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const GoalsView = () => (
    <div className="space-y-6 pb-24 px-4 pt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold gold-text-gradient">Vaults</h2>
        <button onClick={() => setShowGoalModal(true)} className="p-2 rounded-full glass-card border-gold/20 text-gold">
          <Plus size={20} />
        </button>
      </div>

      <div className="grid gap-6">
        {goals.map(goal => {
          const progress = (goal.saved / goal.target) * 100;
          const remaining = goal.target - goal.saved;
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <motion.div 
              key={goal.id}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-3xl glass-card border-gold/20 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-3xl">
                    {goal.emoji}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{goal.name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{daysLeft} days remaining</p>
                  </div>
                </div>
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                    <motion.circle 
                      cx="32" cy="32" r="28" fill="transparent" stroke="#c9a84c" strokeWidth="4" 
                      strokeDasharray={176}
                      initial={{ strokeDashoffset: 176 }}
                      animate={{ strokeDashoffset: 176 - (176 * progress / 100) }}
                      transition={{ duration: 1.5 }}
                    />
                  </svg>
                  <span className="absolute text-xs font-bold">{Math.round(progress)}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                  <span className="text-gold">Saved: {CURRENCY}{goal.saved.toLocaleString()}</span>
                  <span className="text-gray-500">Target: {CURRENCY}{goal.target.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full gold-bg-gradient"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                <p className="text-[10px] text-gray-400 italic">
                  {progress >= 100 ? "Goal reached! 🎊" : progress > 50 ? "You're more than halfway there! 🚀" : "Every bit counts. Keep going! 💪"}
                </p>
                <button 
                  onClick={() => {
                    const amount = 5000;
                    setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, saved: Math.min(g.target, g.saved + amount) } : g));
                    addToast(`Added ${CURRENCY}${amount} to ${goal.name}`);
                    if (goal.saved + amount >= goal.target) {
                      setShowConfetti(true);
                      setTimeout(() => setShowConfetti(false), 3000);
                    }
                  }}
                  className="px-4 py-1.5 rounded-full gold-bg-gradient text-black text-[10px] font-bold uppercase tracking-widest"
                >
                  Add Funds
                </button>
              </div>
            </motion.div>
          );
        })}
        {goals.length === 0 && (
          <div className="py-20 text-center glass-card rounded-3xl border-dashed border-white/10">
            <Target size={40} className="mx-auto mb-4 text-gray-600 opacity-20" />
            <p className="text-gray-500 text-sm">No savings goals yet.</p>
            <button onClick={() => setShowGoalModal(true)} className="mt-4 text-gold text-xs font-bold uppercase tracking-widest">Create Your First Goal</button>
          </div>
        )}
      </div>
    </div>
  );

  const DebtView = () => (
    <div className="space-y-6 pb-24 px-4 pt-6">
      <h2 className="text-3xl font-bold gold-text-gradient">Obligations</h2>
      
      <div className="grid gap-4">
        {debts.map(debt => {
          const remaining = debt.total - debt.paid;
          const progress = (debt.paid / debt.total) * 100;
          const urgency = new Date(debt.dueDate) < new Date() ? 'red' : 'yellow';
          
          return (
            <div key={debt.id} className="p-6 rounded-3xl glass-card border-white/10 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{debt.name}</h3>
                  <p className="text-xs text-gray-500">Interest: {debt.interest}% APR</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${urgency === 'red' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-gold/20 text-gold border border-gold/30'}`}>
                  {urgency === 'red' ? 'Overdue' : 'Due Soon'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-2xl">
                  <p className="text-[10px] text-gray-500 uppercase mb-1">Remaining</p>
                  <p className="text-lg font-bold">{CURRENCY} {remaining.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl">
                  <p className="text-[10px] text-gray-500 uppercase mb-1">Total Interest</p>
                  <p className="text-lg font-bold text-rose-400">{CURRENCY} {Math.round(remaining * (debt.interest/100)).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span>Paid: {Math.round(progress)}%</span>
                  <span>Due: {debt.dueDate}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }}></div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] text-gray-500 mb-2">Payoff Estimator (Monthly: {CURRENCY}{debt.monthlyPayment})</p>
                <div className="p-3 rounded-xl bg-gold/5 border border-gold/10 text-center">
                  <p className="text-xs font-bold text-gold">Estimated Payoff: June 2032</p>
                </div>
              </div>
            </div>
          );
        })}
        {debts.length === 0 && (
          <div className="p-8 text-center glass-card rounded-3xl border-dashed border-white/10 text-gray-500 text-sm">
            No active debts. You're debt-free! ✨
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Split Expenses</h3>
        {splits.map(split => (
          <div key={split.id} className="p-4 rounded-2xl glass-card border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <Users size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">{split.name}</p>
                <p className="text-[10px] text-gray-500">With: {split.splitWith}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gold">{CURRENCY}{split.perPerson}</p>
              <button className="text-[8px] font-bold uppercase tracking-widest text-emerald-400 hover:underline">Settle Up</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MoreView = () => (
    <div className="space-y-6 pb-24 px-4 pt-6">
      <h2 className="text-3xl font-bold gold-text-gradient">Insights</h2>

      {/* Mood Calendar */}
      <div className="p-6 rounded-3xl glass-card border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Smile size={20} className="text-gold" />
            Money Moods
          </h3>
          <span className="text-[10px] text-gray-500 uppercase font-bold">Last 7 Days</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dateStr = date.toISOString().split('T')[0];
            const moodId = moods[dateStr];
            const mood = MOODS.find(m => m.id === moodId);
            
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-xl transition-all ${mood ? 'bg-gold/20 border border-gold/30' : 'bg-white/5 border border-white/5'}`}>
                  {mood ? mood.emoji : '•'}
                </div>
                <span className="text-[8px] text-gray-500 uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[10px] text-gray-400 italic text-center">
          "You tend to feel <span className="text-gold font-bold">Great</span> after salary days!"
        </p>
      </div>

      {/* Bill Reminders */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Calendar size={20} className="text-gold" />
          Upcoming Bills
        </h3>
        <div className="space-y-3">
          {bills.map(bill => (
            <div key={bill.id} className="p-4 rounded-2xl glass-card border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bill.paid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {bill.paid ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold">{bill.name}</p>
                  <p className="text-[10px] text-gray-500">Due: {bill.dueDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{CURRENCY}{bill.amount.toLocaleString()}</p>
                {!bill.paid && <button className="text-[8px] font-bold uppercase tracking-widest text-gold hover:underline">Mark Paid</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personality Card */}
      {personality && (
        <div className="p-6 rounded-3xl glass-card border-gold/30 gold-glow relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl"></div>
          <h3 className="text-xs text-gold font-bold uppercase tracking-widest mb-2">Your Personality</h3>
          <p className="text-2xl font-bold mb-2">{personality.name}</p>
          <p className="text-sm text-gray-400 italic">"{personality.tip}"</p>
          <button onClick={() => setShowQuiz(true)} className="mt-4 text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-1">
            Retake Quiz <ChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  );

  // --- Main Render ---

  return (
    <div className="max-w-md mx-auto min-h-screen relative overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a]"></div>
      <div className="fixed top-[-10%] left-[-20%] w-[80%] h-[40%] bg-gold/5 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-20%] w-[80%] h-[40%] bg-gold/5 rounded-full blur-[120px] -z-10"></div>

      {/* Content */}
      <main className="min-h-screen">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'transactions' && <TransactionsView />}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'debts' && <DebtView />}
        {activeTab === 'more' && <MoreView />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 glass-card border-t border-gold/20 flex justify-around items-center px-6 z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-gold scale-110' : 'text-gray-500'}`}>
          <LayoutDashboard size={24} />
          <span className="text-[8px] font-bold uppercase tracking-tighter">Home</span>
        </button>
        <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'transactions' ? 'text-gold scale-110' : 'text-gray-500'}`}>
          <PieChart size={24} />
          <span className="text-[8px] font-bold uppercase tracking-tighter">Ledger</span>
        </button>
        
        {/* FAB Placeholder */}
        <div className="w-12"></div>

        <button onClick={() => setActiveTab('goals')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'goals' ? 'text-gold scale-110' : 'text-gray-500'}`}>
          <Target size={24} />
          <span className="text-[8px] font-bold uppercase tracking-tighter">Vaults</span>
        </button>
        <button onClick={() => setActiveTab('more')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'more' ? 'text-gold scale-110' : 'text-gray-500'}`}>
          <Sparkles size={24} />
          <span className="text-[8px] font-bold uppercase tracking-tighter">Insights</span>
        </button>
      </nav>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full gold-bg-gradient text-black flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.5)] z-50 hover:scale-110 active:scale-95 transition-all"
      >
        <Plus size={32} />
      </button>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md glass-card border-gold/30 rounded-t-[40px] p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold gold-text-gradient">New Entry</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full bg-white/5 text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</label>
                    <select name="type" className="w-full p-3 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all">
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</label>
                    <select name="category" className="w-full p-3 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all">
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Amount ({CURRENCY})</label>
                  <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-full p-4 rounded-2xl glass-card border-white/10 outline-none focus:border-gold text-2xl font-bold transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Note</label>
                  <input name="note" type="text" required placeholder="What was this for?" className="w-full p-4 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</label>
                  <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-4 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all" />
                </div>

                <button type="submit" className="w-full py-4 rounded-2xl gold-bg-gradient text-black font-bold uppercase tracking-widest shadow-lg shadow-gold/20">
                  Confirm Transaction
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md glass-card border-gold/30 rounded-t-[40px] p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold gold-text-gradient">New Goal</h2>
                <button onClick={() => setShowGoalModal(false)} className="p-2 rounded-full bg-white/5 text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddGoal} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Icon</label>
                    <input name="emoji" type="text" placeholder="🚗" className="w-full p-3 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Goal Name</label>
                    <input name="name" type="text" required placeholder="e.g. Dream Car" className="w-full p-3 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target Amount ({CURRENCY})</label>
                  <input name="target" type="number" step="0.01" required placeholder="0.00" className="w-full p-4 rounded-2xl glass-card border-white/10 outline-none focus:border-gold text-2xl font-bold transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Deadline</label>
                  <input name="deadline" type="date" required className="w-full p-4 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all" />
                </div>

                <button type="submit" className="w-full py-4 rounded-2xl gold-bg-gradient text-black font-bold uppercase tracking-widest shadow-lg shadow-gold/20">
                  Create Goal
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Set Budget Modal */}
      <AnimatePresence>
        {showBudgetModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md glass-card border-gold/30 rounded-t-[40px] p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold gold-text-gradient">Set Budgets</h2>
                <button onClick={() => setShowBudgetModal(false)} className="p-2 rounded-full bg-white/5 text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateBudget} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                {budgets.map(b => (
                  <div key={b.id} className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {CATEGORIES.find(c => c.id === b.id)?.icon} {CATEGORIES.find(c => c.id === b.id)?.name}
                    </label>
                    <input 
                      name={b.id} 
                      type="number" 
                      defaultValue={b.limit} 
                      placeholder="0.00" 
                      className="w-full p-3 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all" 
                    />
                  </div>
                ))}

                <button type="submit" className="w-full py-4 rounded-2xl gold-bg-gradient text-black font-bold uppercase tracking-widest shadow-lg shadow-gold/20 sticky bottom-0">
                  Save Limits
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personality Quiz Overlay */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6"
          >
            <div className="w-full max-w-sm space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold gold-text-gradient">Financial DNA</h2>
                <p className="text-gray-400 text-sm">Let's discover your spending personality.</p>
                <div className="flex justify-center gap-1 pt-4">
                  {QUIZ_QUESTIONS.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all ${i <= quizStep ? 'w-8 bg-gold' : 'w-4 bg-white/10'}`}></div>
                  ))}
                </div>
              </div>

              <motion.div 
                key={quizStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-center leading-relaxed">
                  {QUIZ_QUESTIONS[quizStep].question}
                </h3>
                <div className="space-y-3">
                  {QUIZ_QUESTIONS[quizStep].options.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => handleQuizAnswer(opt.type)}
                      className="w-full p-5 rounded-2xl glass-card border-white/10 hover:border-gold hover:bg-gold/5 transition-all text-left text-sm font-medium"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>

      {/* Confetti */}
      {showConfetti && <Confetti />}
    </div>
  );
}
