import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

// Initialize instances
export const firebaseAuth = auth();
export const db = firestore();
export const pushMessaging = messaging();

/**
 * Utility for server-side timestamps.
 * Using a function wrapper to ensure a fresh instance if needed.
 */
export const nowTimestamp = () => firestore.FieldValue.serverTimestamp();

// Default export for generic use cases
export default { 
  auth: firebaseAuth, 
  db, 
  messaging: pushMessaging 
};