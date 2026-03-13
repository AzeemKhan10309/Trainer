// src/services/notifications.js
// Firebase Cloud Messaging + Expo Notifications integration

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { db } from './firebase';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─── Configure notification behavior ───────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ─── Register for push notifications ───────────────────────
export async function registerForPushNotificationsAsync(userId) {
  let token;

  if (Device.isDevice) {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;

    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Push notification permission not granted!');
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    // Save token to Firestore
    if (userId && db) {
      await updateDoc(doc(db, 'users', userId), { expoPushToken: token });
    }
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00F5A0',
    });
  }

  return token;
}

// ─── Send notification to a specific user ───────────────────
export async function sendPushNotification(expoPushToken, title, body, data = {}) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data,
    badge: 1,
  };

  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

// ─── Core notification functions ────────────────────────────

/**
 * Called when a client marks a meal as completed.
 * Notifies the trainer in real-time.
 */
export async function notifyTrainerMealCompleted(trainerId, clientName, mealType, time) {
  const title = '🍽️ Meal Completed!';
  const body = `${clientName} has completed ${mealType} at ${time}`;

  // Save notification to Firestore
  if (db) {
    await addDoc(collection(db, 'notifications'), {
      recipientId: trainerId,
      type: 'meal_completed',
      title,
      body,
      data: { clientName, mealType, time },
      read: false,
      createdAt: serverTimestamp(),
    });
  }

  // In a real app, retrieve trainer's push token and send:
  // const trainerDoc = await getDoc(doc(db, 'users', trainerId));
  // const token = trainerDoc.data()?.expoPushToken;
  // if (token) await sendPushNotification(token, title, body, { type: 'meal_completed' });
  
  console.log(`[NOTIFICATION → Trainer] ${body}`);
}

/**
 * Called when a trainer updates a client's diet plan.
 */
export async function notifyClientPlanUpdated(clientId, clientName, planName) {
  const title = '📋 Plan Updated!';
  const body = `Your trainer updated your diet plan: ${planName}`;

  if (db) {
    await addDoc(collection(db, 'notifications'), {
      recipientId: clientId,
      type: 'plan_updated',
      title,
      body,
      data: { planName },
      read: false,
      createdAt: serverTimestamp(),
    });
  }

  console.log(`[NOTIFICATION → Client] ${body}`);
}

/**
 * Called when a client uploads a meal photo.
 */
export async function notifyTrainerPhotoUploaded(trainerId, clientName, mealType) {
  const title = '📸 Meal Photo!';
  const body = `${clientName} uploaded a photo of their ${mealType}`;

  if (db) {
    await addDoc(collection(db, 'notifications'), {
      recipientId: trainerId,
      type: 'photo_uploaded',
      title,
      body,
      data: { clientName, mealType },
      read: false,
      createdAt: serverTimestamp(),
    });
  }
}

/**
 * Called when a trainer sends a message.
 */
export async function notifyClientNewMessage(clientId, trainerName, messagePreview) {
  const title = `💬 ${trainerName}`;
  const body = messagePreview.length > 60 ? messagePreview.slice(0, 60) + '...' : messagePreview;

  if (db) {
    await addDoc(collection(db, 'notifications'), {
      recipientId: clientId,
      type: 'message',
      title,
      body,
      data: { trainerName },
      read: false,
      createdAt: serverTimestamp(),
    });
  }
}

/**
 * Scheduled check for missed meals — run this server-side or via Cloud Functions.
 */
export async function checkMissedMeals(clientId, trainerId, clientName, scheduledMeals) {
  const now = new Date();
  for (const meal of scheduledMeals) {
    const [time, period] = meal.time.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const mealHour = period === 'PM' && hours !== 12 ? hours + 12 : hours;
    const mealTime = new Date();
    mealTime.setHours(mealHour, parseInt(minutes), 0, 0);

    // If meal time passed by 2 hours and not completed
    const twoHoursAfter = new Date(mealTime.getTime() + 2 * 60 * 60 * 1000);
    if (now > twoHoursAfter && !meal.completed) {
      const title = '⚠️ Missed Meal Alert';
      const body = `${clientName} missed their ${meal.type} (scheduled at ${meal.time})`;

      if (db) {
        await addDoc(collection(db, 'notifications'), {
          recipientId: trainerId,
          type: 'meal_missed',
          title,
          body,
          data: { clientName, mealType: meal.type, scheduledTime: meal.time },
          read: false,
          createdAt: serverTimestamp(),
        });
      }
    }
  }
}

export default {
  registerForPushNotificationsAsync,
  sendPushNotification,
  notifyTrainerMealCompleted,
  notifyClientPlanUpdated,
  notifyTrainerPhotoUploaded,
  notifyClientNewMessage,
  checkMissedMeals,
};
