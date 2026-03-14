import { useEffect, useMemo, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { db } from './firebase';

export function useRealtimeQuery(buildQuery, deps = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};
    setLoading(true);

    try {
      const query = buildQuery();
      if (!query) {
        setData([]);
        setLoading(false);
        return () => {};
      }

      unsubscribe = query.onSnapshot(
        (snap) => {
          setData(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        },
      );
    } catch (err) {
      setError(err);
      setLoading(false);
    }

    return () => unsubscribe();
  }, deps);

  return { data, loading, error };
}

export function useTrainerRealtime(trainerId) {
  const clients = useRealtimeQuery(
    () => (trainerId ? db.collection('users').where('role', '==', 'client').where('trainerId', '==', trainerId) : null),
    [trainerId],
  );

  const notifications = useRealtimeQuery(
    () => (trainerId ? db.collection('notifications').where('recipientId', '==', trainerId).orderBy('createdAt', 'desc').limit(20) : null),
    [trainerId],
  );

  const mealCompletions = useRealtimeQuery(
    () => (trainerId ? db.collection('mealCompletions').where('trainerId', '==', trainerId).orderBy('completedAt', 'desc').limit(200) : null),
    [trainerId],
  );

  const analytics = useMemo(() => {
    const allClients = clients.data;
    const activeClients = allClients.filter((c) => c.status !== 'inactive').length;
    const avgStreak = allClients.length
      ? Math.round(allClients.reduce((sum, c) => sum + (c.streak || 0), 0) / allClients.length)
      : 0;
    const mealsCompleted = mealCompletions.data.length;

    const thisMonthRevenue = allClients.reduce((sum, c) => sum + (c.monthlyFee || 0), 0);

    return {
      totalClients: allClients.length,
      activeClients,
      avgCompliance: allClients.length ? Math.round((mealsCompleted / (allClients.length * 5 || 1)) * 100) : 0,
      revenue: thisMonthRevenue,
      mealsCompleted,
      totalMeals: allClients.length * 5,
      avgStreak,
    };
  }, [clients.data, mealCompletions.data]);

  return {
    clients,
    notifications,
    mealCompletions,
    analytics,
  };
}

export function useClientRealtime(clientId) {
  const dietPlans = useRealtimeQuery(
    () => (clientId ? db.collection('dietPlans').where('assignedTo', 'array-contains', clientId).orderBy('updatedAt', 'desc').limit(1) : null),
    [clientId],
  );

  const workoutPlans = useRealtimeQuery(
    () => (clientId ? db.collection('workoutPlans').where('assignedTo', 'array-contains', clientId).orderBy('updatedAt', 'desc').limit(1) : null),
    [clientId],
  );

  const progress = useRealtimeQuery(
    () => (clientId ? db.collection('progressEntries').where('clientId', '==', clientId).orderBy('createdAt', 'asc').limit(60) : null),
    [clientId],
  );

  const mealCompletions = useRealtimeQuery(
    () => (clientId ? db.collection('mealCompletions').where('clientId', '==', clientId).orderBy('completedAt', 'desc').limit(100) : null),
    [clientId],
  );

  return {
    dietPlan: dietPlans.data[0] || null,
    workoutPlan: workoutPlans.data[0] || null,
    progress,
    mealCompletions,
    loading: dietPlans.loading || workoutPlans.loading || progress.loading,
  };
}

export async function completeMeal({ clientId, trainerId, planId, mealId, mealType }) {
  await db.collection('mealCompletions').add({
    clientId,
    trainerId,
    planId,
    mealId,
    mealType,
    completedAt: firestore.FieldValue.serverTimestamp(),
  });
}

export async function completeExercise({ clientId, trainerId, planId, exerciseId, exerciseName }) {
  await db.collection('workoutCompletions').add({
    clientId,
    trainerId,
    planId,
    exerciseId,
    exerciseName,
    completedAt: firestore.FieldValue.serverTimestamp(),
  });
}

export function useConversations(userId) {
  return useRealtimeQuery(
    () => (userId ? db.collection('messages').where('participants', 'array-contains', userId).orderBy('lastMessageAt', 'desc') : null),
    [userId],
  );
}

export function subscribeConversationMessages(conversationId, onUpdate) {
  if (!conversationId) return () => {};
  return db
    .collection('messages')
    .doc(conversationId)
    .collection('chat')
    .orderBy('sentAt', 'asc')
    .onSnapshot((snapshot) => {
      onUpdate(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
}

export async function sendChatMessage({ conversationId, senderId, text }) {
  const message = {
    senderId,
    text,
    sentAt: firestore.FieldValue.serverTimestamp(),
    read: false,
  };

  await db.collection('messages').doc(conversationId).collection('chat').add(message);
  await db.collection('messages').doc(conversationId).set(
    {
      lastMessage: text,
      lastMessageAt: firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}