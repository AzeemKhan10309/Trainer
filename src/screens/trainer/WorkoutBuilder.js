import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, ScreenHeader, Badge } from '../../components/ui';
import { useRealtimeQuery } from '../../services/realtime';
import { db } from '../../services/firebase';

export default function WorkoutBuilder() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live subscription to workout plans created by this trainer
  const plans = useRealtimeQuery(
    () => (user?.id ? db.collection('workoutPlans')
      .where('trainerId', '==', user.id)
      .orderBy('updatedAt', 'desc') : null),
    [user?.id],
  );

  const createPlan = async () => {
    if (!name.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await db.collection('workoutPlans').add({
        trainerId: user.id,
        name: name.trim(),
        exercises: [],
        assignedTo: [],
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      setName('');
    } catch (error) {
      console.error("Error creating plan: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader title="Workout Library" subtitle="MANAGE TRAINING PLANS" />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Creation Form */}
        <Card style={styles.createCard}>
          <Text style={[styles.label, { color: theme.text.primary }]}>NEW TEMPLATE</Text>
          <TextInput 
            value={name} 
            onChangeText={setName} 
            placeholder="e.g., Advanced Hypertrophy" 
            placeholderTextColor={theme.text.muted} 
            style={[styles.input, { 
              color: theme.text.primary, 
              borderColor: theme.border.default,
              backgroundColor: theme.bg.input 
            }]} 
          />
          <Button 
            title={isSubmitting ? "Creating..." : "Create Plan"} 
            onPress={createPlan}
            disabled={!name.trim() || isSubmitting}
            variant="primary"
          />
        </Card>

        <View style={styles.listHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
            YOUR PLANS ({plans.data?.length || 0})
          </Text>
        </View>

        {/* Live List of Plans */}
        {plans.data.map((plan) => (
          <TouchableOpacity key={plan.id} activeOpacity={0.7}>
            <Card style={styles.planCard}>
              <View style={styles.planInfo}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.planName, { color: theme.text.primary }]}>{plan.name}</Text>
                  <Text style={{ color: theme.text.muted, fontSize: 13, marginTop: 2 }}>
                    {plan.exercises?.length || 0} Exercises • {plan.assignedTo?.length || 0} Clients
                  </Text>
                </View>
                <View style={[styles.actionCircle, { backgroundColor: theme.bg.elevated }]}>
                  <Text style={{ color: theme.accent.primary }}>✎</Text>
                </View>
              </View>
              
              {plan.assignedTo?.length > 0 && (
                <View style={styles.badgeRow}>
                  <Badge label="Active" color={theme.status.success} size="sm" />
                </View>
              )}
            </Card>
          </TouchableOpacity>
        ))}

        {plans.data.length === 0 && !plans.loading && (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>🏋️‍♂️</Text>
            <Text style={{ color: theme.text.muted }}>No workout plans yet. Create your first one above!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  createCard: { padding: 16, marginBottom: 24, borderStyle: 'dashed', borderWidth: 1 },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  input: { 
    borderWidth: 1, 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    paddingVertical: 12, 
    marginBottom: 12,
    fontSize: 16 
  },
  listHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  planCard: { marginBottom: 10, padding: 16 },
  planInfo: { flexDirection: 'row', alignItems: 'center' },
  planName: { fontSize: 17, fontWeight: '700' },
  actionCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  badgeRow: { marginTop: 12, flexDirection: 'row' },
  emptyState: { alignItems: 'center', marginTop: 40, opacity: 0.6 },
});