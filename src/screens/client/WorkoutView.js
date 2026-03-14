import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, ScreenHeader } from '../../components/ui';
import { useClientRealtime, completeExercise } from '../../services/realtime';

export default function WorkoutView() {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  // Real-time workout plan fetch
  const { workoutPlan } = useClientRealtime(user?.id);

  const handleComplete = async (ex) => {
    try {
      await completeExercise({
        clientId: user.id,
        trainerId: user.trainerId,
        planId: workoutPlan.id,
        exerciseId: ex.id,
        exerciseName: ex.name
      });
    } catch (error) {
      console.error("Error logging exercise:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader 
        title="Workout" 
        subtitle={workoutPlan?.name || 'No assigned workout'} 
      />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {(workoutPlan?.exercises || []).map((ex) => (
          <Card key={ex.id} style={styles.card}>
            <View style={styles.exerciseInfo}>
              <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: 18 }}>
                {ex.name}
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.accent.primary }]}>{ex.sets}</Text>
                  <Text style={[styles.statLabel, { color: theme.text.muted }]}>SETS</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.accent.primary }]}>{ex.reps}</Text>
                  <Text style={[styles.statLabel, { color: theme.text.muted }]}>REPS</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.accent.primary }]}>{ex.rest}</Text>
                  <Text style={[styles.statLabel, { color: theme.text.muted }]}>REST</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.accent.primary }]}
              onPress={() => handleComplete(ex)}
            >
              <Text style={styles.buttonText}>Log Complete 💪</Text>
            </TouchableOpacity>
          </Card>
        ))}

        {(!workoutPlan?.exercises || workoutPlan.exercises.length === 0) && (
          <View style={styles.emptyState}>
            <Text style={{ color: theme.text.muted }}>Your trainer hasn&apos;t assigned a workout yet.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { marginBottom: 16, padding: 16 },
  exerciseInfo: { marginBottom: 16 },
  statsRow: { flexDirection: 'row', marginTop: 12, gap: 24 },
  statItem: { alignItems: 'flex-start' },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  button: { borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#000', fontWeight: '800', fontSize: 15 },
  emptyState: { alignItems: 'center', marginTop: 60 },
});