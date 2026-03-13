// src/data/mockData.js

export const CLIENTS = [
  {
    id: 'c001', name: 'Ahmed Al-Hassan', age: 28, goal: 'Weight Loss',
    weight: 88, targetWeight: 78, progress: 42, status: 'active',
    lastActive: '2 hours ago', streak: 14, avatar: null,
    meals: { completed: 3, total: 5 }, plan: 'Keto Cutting Plan',
  },
  {
    id: 'c002', name: 'Sara Martinez', age: 25, goal: 'Muscle Gain',
    weight: 62, targetWeight: 68, progress: 68, status: 'active',
    lastActive: '15 min ago', streak: 30, avatar: null,
    meals: { completed: 5, total: 5 }, plan: 'High Protein Bulk',
  },
  {
    id: 'c003', name: 'David Kim', age: 34, goal: 'Fat Loss',
    weight: 95, targetWeight: 82, progress: 25, status: 'inactive',
    lastActive: '2 days ago', streak: 0, avatar: null,
    meals: { completed: 0, total: 5 }, plan: 'Calorie Deficit',
  },
  {
    id: 'c004', name: 'Fatima Hassan', age: 30, goal: 'Toning',
    weight: 70, targetWeight: 65, progress: 55, status: 'active',
    lastActive: '1 hour ago', streak: 7, avatar: null,
    meals: { completed: 4, total: 5 }, plan: 'Mediterranean Diet',
  },
  {
    id: 'c005', name: 'James Wilson', age: 42, goal: 'Endurance',
    weight: 80, targetWeight: 75, progress: 80, status: 'active',
    lastActive: 'Just now', streak: 45, avatar: null,
    meals: { completed: 5, total: 5 }, plan: 'Carb Cycling',
  },
];

export const DIET_PLANS = [
  {
    id: 'dp001',
    name: 'Keto Cutting Plan',
    calories: 1800,
    protein: 150,
    carbs: 30,
    fat: 120,
    assignedTo: ['c001'],
    meals: [
      {
        id: 'm001', type: 'Breakfast', time: '07:00 AM', calories: 400,
        protein: 35, carbs: 5, fat: 28,
        items: ['3 Scrambled Eggs', '2 strips Turkey Bacon', '1/2 Avocado', 'Black Coffee'],
        completed: true, completedAt: '07:23 AM',
      },
      {
        id: 'm002', type: 'Morning Snack', time: '10:00 AM', calories: 200,
        protein: 20, carbs: 5, fat: 12,
        items: ['Handful Almonds (30g)', '2 Boiled Eggs'],
        completed: true, completedAt: '10:15 AM',
      },
      {
        id: 'm003', type: 'Lunch', time: '01:00 PM', calories: 550,
        protein: 45, carbs: 8, fat: 38,
        items: ['200g Grilled Chicken Breast', 'Large Mixed Salad', 'Olive Oil Dressing', '1 tbsp Cheese'],
        completed: true, completedAt: '01:15 PM',
      },
      {
        id: 'm004', type: 'Afternoon Snack', time: '04:00 PM', calories: 150,
        protein: 15, carbs: 4, fat: 8,
        items: ['Greek Yogurt (100g)', 'Walnuts (20g)'],
        completed: false,
      },
      {
        id: 'm005', type: 'Dinner', time: '07:00 PM', calories: 500,
        protein: 40, carbs: 8, fat: 34,
        items: ['200g Salmon Fillet', 'Steamed Broccoli (200g)', 'Butter (10g)', 'Lemon & Herbs'],
        completed: false,
      },
    ],
  },
  {
    id: 'dp002', name: 'High Protein Bulk', calories: 3200,
    protein: 220, carbs: 350, fat: 90, assignedTo: ['c002'],
    meals: [
      {
        id: 'm006', type: 'Breakfast', time: '06:30 AM', calories: 700,
        protein: 50, carbs: 80, fat: 20,
        items: ['Oatmeal (100g)', '50g Protein Powder', '2 Bananas', 'Peanut Butter (30g)', '3 Eggs'],
        completed: true, completedAt: '06:45 AM',
      },
    ],
  },
];

export const WORKOUT_PLANS = [
  {
    id: 'wp001',
    name: 'Push Pull Legs - 6 Day',
    assignedTo: ['c001'],
    currentDay: 'Push Day A',
    exercises: [
      { id: 'e001', name: 'Bench Press', sets: 4, reps: '8-10', weight: '70kg', rest: '90s', completed: true, notes: 'Focus on chest contraction' },
      { id: 'e002', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weight: '28kg', rest: '75s', completed: true, notes: 'Control the negative' },
      { id: 'e003', name: 'Overhead Press', sets: 3, reps: '8-10', weight: '50kg', rest: '90s', completed: false, notes: '' },
      { id: 'e004', name: 'Lateral Raises', sets: 4, reps: '15-20', weight: '12kg', rest: '45s', completed: false, notes: 'Slow and controlled' },
      { id: 'e005', name: 'Tricep Pushdown', sets: 3, reps: '12-15', weight: '35kg', rest: '60s', completed: false, notes: '' },
      { id: 'e006', name: 'Dips', sets: 3, reps: '10-12', weight: 'Bodyweight', rest: '75s', completed: false, notes: 'Lean forward slightly' },
    ],
  },
];

export const PROGRESS_DATA = {
  weight: [
    { date: 'Jan 15', value: 88 },
    { date: 'Jan 22', value: 87.2 },
    { date: 'Jan 29', value: 86.5 },
    { date: 'Feb 5', value: 85.8 },
    { date: 'Feb 12', value: 85.1 },
    { date: 'Feb 19', value: 84.3 },
    { date: 'Feb 26', value: 83.8 },
  ],
  calories: [
    { day: 'Mon', consumed: 1820, target: 1800 },
    { day: 'Tue', consumed: 1750, target: 1800 },
    { day: 'Wed', consumed: 1900, target: 1800 },
    { day: 'Thu', consumed: 1780, target: 1800 },
    { day: 'Fri', consumed: 1810, target: 1800 },
    { day: 'Sat', consumed: 1690, target: 1800 },
    { day: 'Sun', consumed: 1840, target: 1800 },
  ],
  mealCompletion: [85, 92, 78, 95, 88, 100, 90],
};

export const NOTIFICATIONS = [
  { id: 'n001', type: 'meal_completed', client: 'Ahmed Al-Hassan', message: 'completed Lunch', time: '1:15 PM', read: false, icon: '🍽️' },
  { id: 'n002', type: 'meal_completed', client: 'Sara Martinez', message: 'completed all meals today', time: '8:30 PM', read: false, icon: '✅' },
  { id: 'n003', type: 'photo_uploaded', client: 'Fatima Hassan', message: 'uploaded a meal photo', time: 'Yesterday', read: true, icon: '📸' },
  { id: 'n004', type: 'missed_meal', client: 'David Kim', message: 'missed Breakfast', time: 'Yesterday', read: true, icon: '⚠️' },
  { id: 'n005', type: 'message', client: 'James Wilson', message: 'sent you a message', time: '2 days ago', read: true, icon: '💬' },
];

export const MESSAGES = [
  {
    id: 'msg001', clientId: 'c001', clientName: 'Ahmed Al-Hassan',
    lastMessage: 'Should I eat the snack before or after training?',
    time: '2:30 PM', unread: 2,
    conversation: [
      { id: 1, sender: 'client', text: "Hi Marcus! Just finished my workout 💪", time: '1:00 PM' },
      { id: 2, sender: 'trainer', text: "Great work Ahmed! How did you feel during the session?", time: '1:05 PM' },
      { id: 3, sender: 'client', text: "Really good! Increased bench by 5kg", time: '1:08 PM' },
      { id: 4, sender: 'trainer', text: "Excellent progression! Keep that up. Remember to hit your protein target today.", time: '1:10 PM' },
      { id: 5, sender: 'client', text: "Should I eat the snack before or after training?", time: '2:30 PM' },
    ],
  },
  {
    id: 'msg002', clientId: 'c002', clientName: 'Sara Martinez',
    lastMessage: 'Perfect! See you Thursday 🏋️',
    time: '8:15 PM', unread: 0,
    conversation: [
      { id: 1, sender: 'trainer', text: "Sara, I've updated your meal plan. Check the new macros.", time: '3:00 PM' },
      { id: 2, sender: 'client', text: "Got it! Looks great. The new carb increase should help with training.", time: '3:45 PM' },
      { id: 3, sender: 'trainer', text: "Exactly. Try this for 2 weeks and we'll assess. Session Thursday at 6PM?", time: '4:00 PM' },
      { id: 4, sender: 'client', text: "Perfect! See you Thursday 🏋️", time: '8:15 PM' },
    ],
  },
];

export const ANALYTICS_DATA = {
  totalClients: 12,
  activeClients: 9,
  avgCompliance: 87,
  revenue: 3600,
  clientProgress: [
    { name: 'Ahmed', progress: 42, trend: 'up' },
    { name: 'Sara', progress: 68, trend: 'up' },
    { name: 'David', progress: 25, trend: 'down' },
    { name: 'Fatima', progress: 55, trend: 'up' },
    { name: 'James', progress: 80, trend: 'up' },
  ],
  monthlyRevenue: [2800, 3100, 2900, 3400, 3200, 3600],
  mealComplianceByClient: [
    { client: 'Ahmed', rate: 85 },
    { client: 'Sara', rate: 98 },
    { client: 'David', rate: 45 },
    { client: 'Fatima', rate: 88 },
    { client: 'James', rate: 96 },
  ],
};
