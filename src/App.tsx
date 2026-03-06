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
  Sparkles,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants & Types ---

const CURRENCY = '৳';

const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food/Mess', icon: '🍲', color: '#FF6B6B' },
  { id: 'transport', name: 'Transport', icon: '🚌', color: '#4D96FF' },
  { id: 'textbooks', name: 'Textbooks', icon: '📚', color: '#FFD93D' },
  { id: 'stationery', name: 'Stationery', icon: '✏️', color: '#6BCB77' },
  { id: 'coaching', name: 'Coaching/Tuition', icon: '🎓', color: '#9B59B6' },
  { id: 'phone', name: 'Phone/Data', icon: '📱', color: '#3498DB' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#F1C40F' },
  { id: 'clothing', name: 'Clothing', icon: '👕', color: '#E67E22' },
  { id: 'health', name: 'Health', icon: '🏥', color: '#E74C3C' },
  { id: 'fees', name: 'University Fees', icon: '🏛️', color: '#1ABC9C' },
  { id: 'other', name: 'Other', icon: '📦', color: '#95A5A6' },
];

const INCOME_CATEGORIES = [
  { id: 'pocket_money', name: 'Pocket Money', icon: '💵', color: '#2ECC71' },
  { id: 'allowance', name: 'Monthly Allowance', icon: '💰', color: '#27AE60' },
  { id: 'job', name: 'Part-time Job', icon: '💼', color: '#3498DB' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#9B59B6' },
  { id: 'scholarship', name: 'Scholarship', icon: '📜', color: '#F1C40F' },
  { id: 'gift', name: 'Gift', icon: '🎁', color: '#E67E22' },
  { id: 'other', name: 'Other', icon: '📦', color: '#95A5A6' },
];

const CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

const PRESET_GOALS = [
  { name: 'Laptop', emoji: '💻', target: 65000 },
  { name: 'Phone', emoji: '📱', target: 35000 },
  { name: 'Admission Fees', emoji: '🎓', target: 25000 },
  { name: 'Travel', emoji: '✈️', target: 15000 },
];

const MOODS = [
  { id: 'stressed', emoji: '😰', label: 'Stressed', color: '#E74C3C' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: '#95A5A6' },
  { id: 'great', emoji: '💰', label: 'Great', color: '#2ECC71' },
  { id: 'splurged', emoji: '🛍️', label: 'Splurged', color: '#F1C40F' },
  { id: 'saved', emoji: '🎉', label: 'Saved', color: '#3498DB' },
];

const FORTUNE_COOKIES = [
  "Chai is life, but don't spend your whole allowance on it. ☕",
  "A rickshaw ride saved is a snack earned. 🛺",
  "University fees are temporary, but financial discipline is forever. 🏛️",
  "The canteen food might be cheap, but your future is expensive. 🍲",
  "Stationery is a trap! Use what you have before buying more. ✏️",
  "Scholarships are the ultimate income. Study hard, save harder. 📜",
  "Freelancing is great, but don't forget to track every Taka. 💻",
  "Monthly allowance is a marathon, not a sprint. Pace yourself. 💰",
  "Textbooks are an investment. Resell them to boost your savings. 📚",
  "Mess food might be boring, but eating out every day is a budget killer. 🍱"
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

const THEMES = [
  { id: 'gold', name: 'Luxury Gold', primary: '#c9a84c', bg: '#0a0a0a' },
  { id: 'emerald', name: 'Emerald Green', primary: '#10b981', bg: '#06100d' },
  { id: 'rose', name: 'Rose Pink', primary: '#f43f5e', bg: '#100608' },
  { id: 'ocean', name: 'Ocean Blue', primary: '#0ea5e9', bg: '#060d10' },
  { id: 'minimal', name: 'Minimal Light', primary: '#6366f1', bg: '#f8fafc' },
];

// --- Main Application ---

export default function App() {
  // --- State ---
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'gold');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [debts, setDebts] = useState([]);
  const [budgets, setBudgets] = useState(EXPENSE_CATEGORIES.map(c => ({ id: c.id, limit: 0 })));
  const [moods, setMoods] = useState({});
  const [bills, setBills] = useState([]);
  const [friends, setFriends] = useState([]);
  const [allowance, setAllowance] = useState({ limit: 0, received: 0 });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showAllowanceModal, setShowAllowanceModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
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
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  const budgetHealthScore = useMemo(() => {
    // If no transactions, score is 0
    if (transactions.length === 0 && goals.length === 0 && bills.length === 0 && debts.length === 0) return 0;

    let score = 0;
    
    // 1. Positive balance
    if (balance > 0) score += 25;
    
    // 2. Spending under limits
    let totalLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
    let totalSpent = transactions
      .filter(t => t.type === 'expense' && budgets.some(b => b.id === t.category))
      .reduce((acc, t) => acc + t.amount, 0);
    if (totalLimit > 0 && totalSpent <= totalLimit) score += 25;
    
    // 3. Active savings goals
    if (goals.length > 0) score += 25;
    
    // 4. Zero unpaid debts
    const unpaidDebts = debts.filter(d => d.total > d.paid).length;
    const unpaidBills = bills.filter(b => !b.paid).length;
    // Only count if there are actually debts or bills
    if ((debts.length > 0 || bills.length > 0) && unpaidDebts === 0 && unpaidBills === 0) score += 25;
    
    return score;
  }, [balance, budgets, transactions, goals, debts, bills]);

  const getHealthColor = (score) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-rose-400';
  };

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

  const handleUpdateAllowance = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAllowance = {
      limit: parseFloat(formData.get('limit') as string) || 0,
      received: parseFloat(formData.get('received') as string) || 0,
    };
    setAllowance(newAllowance);
    setShowAllowanceModal(false);
    addToast('Allowance updated!');
  };

  const handleAddFriendTransaction = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newFriendTransaction = {
      id: Date.now(),
      name: formData.get('name') as string,
      amount: parseFloat(formData.get('amount') as string),
      type: formData.get('type') as 'borrow' | 'lend',
      note: formData.get('note') as string,
      date: formData.get('date') as string,
      settled: false,
    };
    setFriends(prev => [...prev, newFriendTransaction]);
    setShowFriendModal(false);
    addToast('Transaction recorded!');
  };

  const handleAddBill = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBill = {
      id: Date.now(),
      name: formData.get('name') as string,
      amount: parseFloat(formData.get('amount') as string),
      dueDate: formData.get('dueDate') as string,
      frequency: formData.get('frequency') as string,
      paid: false,
    };
    setBills(prev => [...prev, newBill]);
    setShowBillModal(false);
    addToast('Bill reminder added!');
  };

  const settleFriendTransaction = (id) => {
    setFriends(prev => prev.map(f => f.id === id ? { ...f, settled: true } : f));
    addToast('Settled up! 🤝');
  };

  const getFortune = () => {
    const newFortune = FORTUNE_COOKIES[Math.floor(Math.random() * FORTUNE_COOKIES.length)];
    setFortune(newFortune);
    addToast("New wisdom unlocked! 🥠");
  };

  // --- Sub-Components ---

  const Dashboard = () => {
    const allowanceUsed = allowance.limit > 0 ? (allowance.received / allowance.limit) * 100 : 0;
    const allowanceRemaining = allowance.limit - allowance.received;
    const isLowAllowance = allowance.limit > 0 && (allowanceRemaining / allowance.limit) < 0.2;

    return (
      <div className="space-y-6 pb-24">
        <header className="flex justify-between items-center px-4 pt-6">
          <div>
            <h1 className="text-3xl font-bold gold-text-gradient">CHATTERJEE FINANCE</h1>
            <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">Student Edition</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowThemeModal(true)} className="p-2 rounded-full glass-card border-gold/20 text-gold hover:bg-gold/10 transition-colors">
              <Palette size={20} />
            </button>
            <button onClick={getFortune} className="p-2 rounded-full glass-card border-gold/20 text-gold hover:bg-gold/10 transition-colors">
              <Cookie size={20} />
            </button>
            <button onClick={() => setActiveTab('bills')} className="p-2 rounded-full glass-card border-gold/20 text-gold hover:bg-gold/10 transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Fortune Cookie Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 p-4 rounded-2xl bg-gold/5 border border-gold/20 flex gap-4 items-start"
        >
          <div className="p-2 bg-gold/10 rounded-xl text-gold">
            <Cookie size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gold font-bold uppercase tracking-widest mb-1">Daily Wisdom</p>
            <p className="text-sm italic text-gray-300">"{fortune}"</p>
          </div>
        </motion.div>

        {/* Net Worth Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 p-6 rounded-3xl glass-card border-gold/30 relative overflow-hidden gold-glow"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
          <p className="text-gray-400 text-sm font-medium mb-1">Total Balance</p>
          <h2 className="text-4xl font-bold mb-4">
            <NumberCounter value={balance} prefix={CURRENCY + ' '} />
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
              <p className="text-xs text-gray-500 mb-1">Income</p>
              <p className="text-emerald-400 font-bold flex items-center gap-1">
                <ArrowUpRight size={14} />
                {CURRENCY} {totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
              <p className="text-xs text-gray-500 mb-1">Expenses</p>
              <p className="text-rose-400 font-bold flex items-center gap-1">
                <ArrowDownRight size={14} />
                {CURRENCY} {totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Allowance Tracker */}
        <div className="px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowAllowanceModal(true)}
            className="p-5 rounded-3xl glass-card border-white/10 cursor-pointer hover:bg-white/5 transition-all"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Wallet size={18} className="text-gold" />
                Allowance Tracker
              </h3>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {CURRENCY}{allowance.received.toLocaleString()} / {CURRENCY}{allowance.limit.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, allowanceUsed)}%` }}
                className={`h-full ${allowanceUsed > 100 ? 'bg-rose-500' : 'gold-bg-gradient'}`}
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-gray-500">
                {allowanceUsed > 100 ? "Overspent!" : `${Math.round(allowanceUsed)}% received`}
              </p>
              {isLowAllowance && (
                <p className="text-[10px] text-rose-400 font-bold animate-pulse">
                  ⚠️ Low Balance! (Under 20%)
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Health Scores */}
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
            onClick={() => setActiveTab('budget')}
            className="p-4 rounded-3xl glass-card border-gold/20 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gold/5 transition-all"
          >
            <p className="text-xs text-gray-500 uppercase tracking-tighter mb-2">Budget Health</p>
            <div className={`text-4xl font-bold mb-1 ${getHealthColor(budgetHealthScore)}`}>{budgetHealthScore}</div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${budgetHealthScore}%` }}
                className={`h-full ${budgetHealthScore >= 70 ? 'bg-emerald-400' : budgetHealthScore >= 40 ? 'bg-orange-400' : 'bg-rose-400'}`}
              />
            </div>
            <p className="mt-2 text-[10px] text-gray-400">Tap to view details</p>
          </motion.div>
        </div>

        {/* Personality Result */}
        {personality && (
          <div className="px-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-5 rounded-3xl glass-card border-gold/30 gold-glow relative overflow-hidden"
            >
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl"></div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xs text-gold font-bold uppercase tracking-widest">Your Spending DNA</h3>
                <button onClick={() => setShowQuiz(true)} className="text-[8px] text-gray-500 uppercase font-bold hover:text-gold transition-colors">Retake Quiz</button>
              </div>
              <p className="text-2xl font-bold mb-1">{personality.name}</p>
              <p className="text-xs text-gray-400 italic">"{personality.tip}"</p>
            </motion.div>
          </div>
        )}

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
  };

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

      {/* Preset Goals */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {PRESET_GOALS.map(preset => (
          <button 
            key={preset.name}
            onClick={() => {
              const newGoal = {
                id: Date.now(),
                emoji: preset.emoji,
                name: preset.name,
                target: preset.target,
                saved: 0,
                deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days default
              };
              setGoals(prev => [...prev, newGoal]);
              addToast(`Goal added: ${preset.name}!`);
            }}
            className="flex-shrink-0 px-4 py-3 rounded-2xl glass-card border-white/10 flex items-center gap-2 hover:border-gold transition-all"
          >
            <span className="text-xl">{preset.emoji}</span>
            <span className="text-xs font-bold text-gray-300">{preset.name}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {goals.map(goal => {
          const progress = (goal.saved / goal.target) * 100;
          const remaining = goal.target - goal.saved;
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          const dailySaving = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : 0;
          
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
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{daysLeft > 0 ? `${daysLeft} days remaining` : "Deadline passed"}</p>
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

              <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-gray-400 italic">
                    {progress >= 100 ? "Goal reached! 🎊" : progress > 50 ? "You're more than halfway there! 🚀" : "Every bit counts. Keep going! 💪"}
                  </p>
                  <button 
                    onClick={() => {
                      const amount = 1000;
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
                {progress < 100 && daysLeft > 0 && (
                  <div className="bg-white/5 p-3 rounded-xl text-center">
                    <p className="text-[10px] text-gold font-bold uppercase tracking-widest">
                      Save {CURRENCY}{dailySaving}/day to reach this goal in time
                    </p>
                  </div>
                )}
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

  const FriendsView = () => {
    const totalOwedToMe = friends.filter(f => f.type === 'lend' && !f.settled).reduce((acc, f) => acc + f.amount, 0);
    const totalIOwe = friends.filter(f => f.type === 'borrow' && !f.settled).reduce((acc, f) => acc + f.amount, 0);

    return (
      <div className="space-y-6 pb-24 px-4 pt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold gold-text-gradient">Peers</h2>
          <button onClick={() => setShowFriendModal(true)} className="p-2 rounded-full glass-card border-gold/20 text-gold">
            <Plus size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-3xl glass-card border-emerald-500/20 bg-emerald-500/5">
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Owed to Me</p>
            <p className="text-xl font-bold text-emerald-400">{CURRENCY} {totalOwedToMe.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-3xl glass-card border-rose-500/20 bg-rose-500/5">
            <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mb-1">I Owe</p>
            <p className="text-xl font-bold text-rose-400">{CURRENCY} {totalIOwe.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {friends.filter(f => !f.settled).map(f => (
              <motion.div 
                key={f.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -100 }}
                className={`p-4 rounded-2xl glass-card border-white/5 flex items-center justify-between group ${f.type === 'lend' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-rose-500'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.type === 'lend' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{f.name}</p>
                    <p className="text-[10px] text-gray-500">{f.note} • {f.date}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className={`text-sm font-bold ${f.type === 'lend' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {f.type === 'lend' ? '+' : '-'}{CURRENCY}{f.amount.toLocaleString()}
                    </p>
                    <button 
                      onClick={() => settleFriendTransaction(f.id)}
                      className="text-[8px] font-bold uppercase tracking-widest text-gold hover:underline"
                    >
                      Settle Up
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {friends.filter(f => !f.settled).length === 0 && (
            <div className="py-20 text-center text-gray-500">
              <Users size={40} className="mx-auto mb-4 opacity-20" />
              <p>No active borrow/lend records.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const BillsView = () => (
    <div className="space-y-6 pb-24 px-4 pt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold gold-text-gradient">Reminders</h2>
        <button onClick={() => setShowBillModal(true)} className="p-2 rounded-full glass-card border-gold/20 text-gold">
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {bills.map(bill => {
            const daysUntil = Math.ceil((new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const urgency = daysUntil < 0 ? 'red' : daysUntil <= 7 ? 'orange' : 'green';
            
            return (
              <motion.div 
                key={bill.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-2xl glass-card border-white/5 flex justify-between items-center ${bill.paid ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    bill.paid ? 'bg-emerald-500/10 text-emerald-400' : 
                    urgency === 'red' ? 'bg-rose-500/10 text-rose-400' : 
                    urgency === 'orange' ? 'bg-orange-500/10 text-orange-400' : 
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {bill.paid ? <CheckCircle2 size={20} /> : <Calendar size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{bill.name}</p>
                    <p className="text-[10px] text-gray-500">
                      Due: {bill.dueDate} • {bill.frequency}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{CURRENCY}{bill.amount.toLocaleString()}</p>
                  {!bill.paid && (
                    <button 
                      onClick={() => {
                        setBills(prev => prev.map(b => b.id === bill.id ? { ...b, paid: true } : b));
                        addToast(`Bill paid: ${bill.name}!`);
                      }}
                      className="text-[8px] font-bold uppercase tracking-widest text-gold hover:underline"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {bills.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            <Bell size={40} className="mx-auto mb-4 opacity-20" />
            <p>No bill reminders set.</p>
          </div>
        )}
      </div>
    </div>
  );

  const BudgetView = () => (
    <div className="space-y-6 pb-24 px-4 pt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold gold-text-gradient">Budget</h2>
        <button onClick={() => setShowBudgetModal(true)} className="p-2 rounded-full glass-card border-gold/20 text-gold">
          <Settings size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-8 glass-card rounded-[40px] border-gold/30 gold-glow">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Budget Health Score</p>
        <div className={`text-7xl font-bold ${getHealthColor(budgetHealthScore)}`}>
          {budgetHealthScore}
        </div>
        <p className="mt-4 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          {budgetHealthScore >= 70 ? "Excellent Discipline! 💎" : budgetHealthScore >= 40 ? "Steady Progress ⚖️" : "Needs Attention ⚠️"}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Category Limits</h3>
        <div className="space-y-4">
          {budgets.map(budget => {
            const category = EXPENSE_CATEGORIES.find(c => c.id === budget.id);
            const spent = transactions
              .filter(t => t.category === budget.id && t.type === 'expense')
              .reduce((acc, t) => acc + t.amount, 0);
            const progress = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
            
            return (
              <div key={budget.id} className="p-4 rounded-2xl glass-card border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category?.icon}</span>
                    <span className="text-sm font-bold">{category?.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold">
                    {CURRENCY}{spent.toLocaleString()} / {CURRENCY}{budget.limit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, progress)}%` }}
                    className={`h-full ${progress > 100 ? 'bg-rose-500' : 'gold-bg-gradient'}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
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
        {activeTab === 'friends' && <FriendsView />}
        {activeTab === 'bills' && <BillsView />}
        {activeTab === 'budget' && <BudgetView />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 glass-card border-t border-gold/20 flex justify-around items-center px-4 z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-gold scale-110' : 'text-gray-500'}`}>
          <Home size={20} />
          <span className="text-[7px] font-bold uppercase tracking-tighter">Home</span>
        </button>
        <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'transactions' ? 'text-gold scale-110' : 'text-gray-500'}`}>
          <TrendingUp size={20} />
          <span className="text-[7px] font-bold uppercase tracking-tighter">Money</span>
        </button>
        <button onClick={() => setActiveTab('goals')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'goals' ? 'text-gold scale-110' : 'text-gray-500'}`}>
          <Target size={20} />
          <span className="text-[7px] font-bold uppercase tracking-tighter">Goals</span>
        </button>
        <button onClick={() => setActiveTab('friends')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'friends' ? 'text-gold scale-110' : 'text-gray-500'}`}>
          <Users size={20} />
          <span className="text-[7px] font-bold uppercase tracking-tighter">Peers</span>
        </button>
        <button onClick={() => setActiveTab('bills')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'bills' ? 'text-gold scale-110' : 'text-gray-500'}`}>
          <Calendar size={20} />
          <span className="text-[7px] font-bold uppercase tracking-tighter">Bills</span>
        </button>
        <button onClick={() => setActiveTab('budget')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'budget' ? 'text-gold scale-110' : 'text-gray-500'}`}>
          <PieChart size={20} />
          <span className="text-[7px] font-bold uppercase tracking-tighter">Budget</span>
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
                    <select name="type" className="w-full p-3 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all bg-black">
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</label>
                    <select name="category" className="w-full p-3 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all bg-black">
                      {EXPENSE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                      {INCOME_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
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
                      {EXPENSE_CATEGORIES.find(c => c.id === b.id)?.icon} {EXPENSE_CATEGORIES.find(c => c.id === b.id)?.name}
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

      {/* Add Friend Modal */}
      <AnimatePresence>
        {showFriendModal && (
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
              className="w-full max-w-md glass-card border-gold/30 rounded-t-[40px] p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold gold-text-gradient">New Peer Record</h2>
                <button onClick={() => setShowFriendModal(false)} className="p-2 rounded-full bg-white/5 text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newFriend = {
                  id: Date.now(),
                  name: formData.get('name') as string,
                  amount: parseFloat(formData.get('amount') as string),
                  type: formData.get('type') as 'lend' | 'borrow',
                  note: formData.get('note') as string,
                  date: formData.get('date') as string,
                  settled: false,
                };
                setFriends(prev => [newFriend, ...prev]);
                setShowFriendModal(false);
                addToast(`Record added for ${newFriend.name}`);
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</label>
                    <select name="type" className="w-full p-3 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all bg-black">
                      <option value="lend">I Lent Money</option>
                      <option value="borrow">I Borrowed Money</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Name</label>
                    <input name="name" type="text" required placeholder="Friend's Name" className="w-full p-3 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Amount ({CURRENCY})</label>
                  <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-full p-4 rounded-2xl glass-card border-white/10 outline-none focus:border-gold text-2xl font-bold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Note</label>
                  <input name="note" type="text" placeholder="What's this for?" className="w-full p-4 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</label>
                  <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-4 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all" />
                </div>
                <button type="submit" className="w-full py-4 rounded-2xl gold-bg-gradient text-black font-bold uppercase tracking-widest">
                  Save Record
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Bill Modal */}
      <AnimatePresence>
        {showBillModal && (
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
              className="w-full max-w-md glass-card border-gold/30 rounded-t-[40px] p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold gold-text-gradient">New Reminder</h2>
                <button onClick={() => setShowBillModal(false)} className="p-2 rounded-full bg-white/5 text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newBill = {
                  id: Date.now(),
                  name: formData.get('name') as string,
                  amount: parseFloat(formData.get('amount') as string),
                  dueDate: formData.get('dueDate') as string,
                  frequency: formData.get('frequency') as 'monthly' | 'weekly' | 'one-time',
                  paid: false,
                };
                setBills(prev => [newBill, ...prev]);
                setShowBillModal(false);
                addToast(`Reminder set for ${newBill.name}`);
              }} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bill Name</label>
                  <input name="name" type="text" required placeholder="e.g. Mess Fees" className="w-full p-4 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Amount ({CURRENCY})</label>
                    <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-full p-3 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Frequency</label>
                    <select name="frequency" className="w-full p-3 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all bg-black">
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="one-time">One-time</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Due Date</label>
                  <input name="dueDate" type="date" required className="w-full p-4 rounded-2xl glass-card border-white/10 outline-none focus:border-gold transition-all" />
                </div>
                <button type="submit" className="w-full py-4 rounded-2xl gold-bg-gradient text-black font-bold uppercase tracking-widest">
                  Set Reminder
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Allowance Modal */}
      <AnimatePresence>
        {showAllowanceModal && (
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
              className="w-full max-w-md glass-card border-gold/30 rounded-t-[40px] p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold gold-text-gradient">Update Allowance</h2>
                <button onClick={() => setShowAllowanceModal(false)} className="p-2 rounded-full bg-white/5 text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateAllowance} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Monthly Allowance ({CURRENCY})</label>
                  <input name="total" type="number" defaultValue={allowance.total} required className="w-full p-4 rounded-2xl glass-card border-white/10 outline-none focus:border-gold text-2xl font-bold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Received So Far ({CURRENCY})</label>
                  <input name="received" type="number" defaultValue={allowance.received} required className="w-full p-4 rounded-2xl glass-card border-white/10 outline-none focus:border-gold text-2xl font-bold transition-all" />
                </div>
                <button type="submit" className="w-full py-4 rounded-2xl gold-bg-gradient text-black font-bold uppercase tracking-widest">
                  Update Tracker
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

      {/* Theme Modal */}
      <AnimatePresence>
        {showThemeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm glass-card border-gold/30 rounded-[40px] p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold gold-text-gradient">Choose Theme</h2>
                <button onClick={() => setShowThemeModal(false)} className="p-2 rounded-full bg-white/5 text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {THEMES.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setShowThemeModal(false);
                      addToast(`Theme changed to ${t.name}`);
                    }}
                    className={`p-4 rounded-2xl flex items-center justify-between transition-all ${theme === t.id ? 'border-2 border-gold bg-gold/10' : 'border border-white/10 hover:border-gold/50'}`}
                    style={{ backgroundColor: theme === t.id ? undefined : t.bg }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: t.primary }}></div>
                      <span className={`font-bold ${theme === t.id ? 'text-gold' : 'text-white'}`}>{t.name}</span>
                    </div>
                    {theme === t.id && <CheckCircle2 size={18} className="text-gold" />}
                  </button>
                ))}
              </div>
            </motion.div>
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
