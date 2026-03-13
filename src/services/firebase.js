// src/services/firebase.js
// Firebase v10 configuration for FitPro Trainer

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

// TODO: Replace with your Firebase project config
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

/*
 ═══════════════════════════════════════════════════════════════
  FIRESTORE DATA STRUCTURE
 ═══════════════════════════════════════════════════════════════

  /users/{userId}
    - role: 'trainer' | 'client'
    - name: string
    - email: string
    - phone: string
    - createdAt: timestamp
    - trainerId: string (for clients only)
    - clientIds: string[] (for trainers only)

  /dietPlans/{planId}
    - name: string
    - trainerId: string
    - calories: number
    - protein: number
    - carbs: number
    - fat: number
    - assignedTo: string[] (clientIds)
    - createdAt: timestamp
    - updatedAt: timestamp

  /dietPlans/{planId}/meals/{mealId}
    - type: 'Breakfast' | 'Lunch' | etc.
    - time: string
    - calories: number
    - protein, carbs, fat: number
    - items: string[]

  /mealCompletions/{completionId}
    - clientId: string
    - planId: string
    - mealId: string
    - mealType: string
    - completedAt: timestamp
    - photoUrl: string | null

  /workoutPlans/{planId}
    - name: string
    - trainerId: string
    - assignedTo: string[]

  /workoutPlans/{planId}/exercises/{exerciseId}
    - name: string
    - sets: number
    - reps: string
    - weight: string
    - rest: string
    - notes: string

  /workoutCompletions/{completionId}
    - clientId: string
    - planId: string
    - exerciseId: string
    - completedAt: timestamp

  /messages/{conversationId}
    - participants: string[] [trainerId, clientId]
    - lastMessage: string
    - lastMessageAt: timestamp

  /messages/{conversationId}/chat/{messageId}
    - senderId: string
    - text: string
    - imageUrl: string | null
    - sentAt: timestamp
    - read: boolean

  /notifications/{notifId}
    - recipientId: string
    - type: 'meal_completed' | 'meal_missed' | 'photo_uploaded' | 'plan_updated' | 'message'
    - title: string
    - body: string
    - data: object
    - read: boolean
    - createdAt: timestamp

 ═══════════════════════════════════════════════════════════════
*/
