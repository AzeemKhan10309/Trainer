import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { Card, Badge, SectionHeader, ScreenHeader } from '../../components/ui';
import { WORKOUT_PLANS } from '../../data/mockData';
import { typography } from '../../theme/colors';

const MUSCLE_ICONS = {
  'Bench Press': '🏋️', 'Incline Dumbbell Press': '💪', 'Overhead Press': '🙆',
  'Lateral Raises': '🦅', 'Tricep Pushdown': '💪', 'Dips': '⬇️',
};

export default function WorkoutView() {
  const { theme } = useTheme();
  const [plan, setPlan] = useState(WORKOUT_PLANS[0]);
  const [activeExercise, setActiveExercise] = useState(null);
  const [notification, setNotification] = useState(null);

  const completedCount = plan.exercises.filter(e => e.completed).length;
  const totalCount = plan.exercises.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  const completeExercise = (id) => {
    setPlan(prev => ({
      ...prev,
      exercises: prev.exercises.map(e => e.id === id ? { ...e, completed: true } : e),
    }));
    setNotification('Exercise marked complete! 💪');
    setTimeout(() => setNotification(null), 2500);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader title="Workout" subtitle="TODAY&apos;S TRAINING" />

      {notification && (
        <View style={[styles.toast, { backgroundColor: theme.accent.primary }]}>
          <Text style={{ color: '#000', fontWeight: '700', fontSize: 14 }}>{notification}</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Workout Banner */}
        <LinearGradient
          colors={['#1A1A2E', '#0F0F1A']}
          style={styles.banner}
        >
          <View style={styles.bannerContent}>
            <Text style={[typography.label, { color: theme.accent.primary }]}>TODAY&apos;S SESSION</Text>
            <Text style={[typography.h1, { color: '#fff', marginTop: 4 }]}>{plan.currentDay}</Text>
            <Text style={[typography.body, { color: '#A0A0C0', marginTop: 4 }]}>{totalCount} exercises • ~45 min</Text>

            {/* Progress Ring */}
            <View style={styles.progressInfo}>
              <View style={[styles.progressCircle, { borderColor: theme.accent.primary }]}>
                <Text style={[typography.h2, { color: theme.accent.primary }]}>{pct}%</Text>
                <Text style={[typography.caption, { color: '#A0A0C0' }]}>done</Text>
              </View>
              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <Text style={[typography.h3, { color: '#fff' }]}>{completedCount}</Text>
                  <Text style={[typography.caption, { color: '#A0A0C0' }]}>Completed</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: '#2A2A40' }]} />
                <View style={styles.progressStat}>
                  <Text style={[typography.h3, { color: '#fff' }]}>{totalCount - completedCount}</Text>
                  <Text style={[typography.caption, { color: '#A0A0C0' }]}>Remaining</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: '#2A2A40' }]} />
                <View style={styles.progressStat}>
                  <Text style={[typography.h3, { color: '#fff' }]}>~45</Text>
                  <Text style={[typography.caption, { color: '#A0A0C0' }]}>Minutes</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={[styles.workoutProgressTrack, { backgroundColor: '#2A2A40' }]}>
            <LinearGradient
              colors={['#00F5A0', '#00C47D']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.workoutProgressFill, { width: `${pct}%` }]}
            />
          </View>
        </LinearGradient>

        <View style={styles.padded}>
          <SectionHeader title="Exercise List" />

          {plan.exercises.map((exercise, index) => {
            const isActive = activeExercise === exercise.id;
            const isCompleted = exercise.completed;
            const isNext = !isCompleted && plan.exercises.slice(0, index).every(e => e.completed);

            return (
              <TouchableOpacity
                key={exercise.id}
                onPress={() => setActiveExercise(isActive ? null : exercise.id)}
                activeOpacity={0.9}
              >
                <Card style={[
                  styles.exerciseCard,
                  isCompleted && { borderColor: theme.accent.primary + '40', borderWidth: 1.5, opacity: 0.8 },
                  isNext && { borderColor: theme.accent.secondary + '60', borderWidth: 1.5 },
                  isActive && { borderColor: theme.accent.primary, borderWidth: 2 },
                ]}>
                  <View style={styles.exerciseHeader}>
                    {/* Number */}
                    <View style={[
                      styles.exerciseNum,
                      { backgroundColor: isCompleted ? theme.accent.primary : isNext ? theme.accent.secondary + '30' : theme.bg.elevated }
                    ]}>
                      {isCompleted
                        ? <Text style={{ color: '#000', fontWeight: '800', fontSize: 14 }}>✓</Text>
                        : <Text style={[{ fontWeight: '800', fontSize: 14 }, { color: isNext ? theme.accent.secondary : theme.text.muted }]}>
                            {index + 1}
                          </Text>
                      }
                    </View>

                    {/* Exercise Info */}
                    <View style={{ flex: 1 }}>
                      <View style={styles.exerciseTitleRow}>
                        <Text style={[typography.h4, {
                          color: isCompleted ? theme.text.secondary : theme.text.primary,
                          textDecorationLine: isCompleted ? 'line-through' : 'none',
                        }]}>
                          {exercise.name}
                        </Text>
                        {isNext && <Badge label="UP NEXT" color={theme.accent.secondary} size="sm" />}
                        {isCompleted && <Badge label="DONE" color={theme.accent.primary} size="sm" />}
                      </View>

                      {/* Sets/Reps/Weight chips */}
                      <View style={styles.exerciseChips}>
                        <View style={[styles.chip, { backgroundColor: theme.bg.elevated }]}>
                          <Text style={[typography.caption, { color: theme.text.secondary }]}>🔁 {exercise.sets} sets</Text>
                        </View>
                        <View style={[styles.chip, { backgroundColor: theme.bg.elevated }]}>
                          <Text style={[typography.caption, { color: theme.text.secondary }]}>🔢 {exercise.reps} reps</Text>
                        </View>
                        <View style={[styles.chip, { backgroundColor: theme.bg.elevated }]}>
                          <Text style={[typography.caption, { color: theme.text.secondary }]}>⚖️ {exercise.weight}</Text>
                        </View>
                        <View style={[styles.chip, { backgroundColor: theme.bg.elevated }]}>
                          <Text style={[typography.caption, { color: theme.text.secondary }]}>⏱ {exercise.rest}</Text>
                        </View>
                      </View>
                    </View>

                    <Text style={{ fontSize: 20, color: theme.text.muted, marginLeft: 8 }}>
                      {MUSCLE_ICONS[exercise.name] || '💪'}
                    </Text>
                  </View>

                  {/* Expanded */}
                  {isActive && (
                    <View style={[styles.expandedExercise, { borderTopColor: theme.border.subtle }]}>
                      {exercise.notes ? (
                        <View style={[styles.notesBox, { backgroundColor: theme.accent.gold + '15', borderColor: theme.accent.gold + '40' }]}>
                          <Text style={{ fontSize: 14, marginRight: 8 }}>📝</Text>
                          <Text style={[typography.body, { color: theme.accent.gold, flex: 1 }]}>{exercise.notes}</Text>
                        </View>
                      ) : null}

                      {/* Set Tracker */}
                      <Text style={[typography.label, { color: theme.text.muted, marginBottom: 10, marginTop: 8 }]}>SET TRACKER</Text>
                      <View style={styles.setTracker}>
                        {Array.from({ length: exercise.sets }).map((_, i) => (
                          <TouchableOpacity
                            key={i}
                            style={[styles.setBox, {
                              backgroundColor: theme.bg.elevated,
                              borderColor: theme.border.default,
                            }]}
                          >
                            <Text style={[typography.label, { color: theme.text.muted }]}>SET {i + 1}</Text>
                            <Text style={[typography.body, { color: theme.text.primary, marginTop: 2 }]}>{exercise.reps}</Text>
                            <Text style={[typography.caption, { color: theme.text.muted }]}>{exercise.weight}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      {!isCompleted && (
                        <TouchableOpacity onPress={() => completeExercise(exercise.id)} activeOpacity={0.85}>
                          <LinearGradient
                            colors={['#00F5A0', '#00C47D']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.completeBtn}
                          >
                            <Text style={{ fontSize: 18, marginRight: 8 }}>✅</Text>
                            <Text style={{ color: '#000', fontWeight: '800', fontSize: 15 }}>
                              Mark Exercise Complete
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            );
          })}

          {/* Finish Workout Button */}
          {completedCount === totalCount && (
            <View style={[styles.finishBanner, { borderColor: theme.accent.primary + '50' }]}>
              <LinearGradient colors={['#00F5A0', '#00C47D']} style={styles.finishGradient}>
                <Text style={{ fontSize: 40, marginBottom: 8 }}>🏆</Text>
                <Text style={{ fontWeight: '800', fontSize: 22, color: '#000' }}>Workout Complete!</Text>
                <Text style={{ color: '#00000080', marginTop: 4 }}>Your trainer has been notified. Amazing work!</Text>
              </LinearGradient>
            </View>
          )}

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toast: { position: 'absolute', top: 120, left: 16, right: 16, zIndex: 999, borderRadius: 12, padding: 14 },
  banner: { margin: 20, borderRadius: 20, overflow: 'hidden' },
  bannerContent: { padding: 24 },
  progressInfo: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 20 },
  progressCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  progressStats: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  progressStat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 30 },
  workoutProgressTrack: { height: 6, marginHorizontal: 24, marginBottom: 24, borderRadius: 3, overflow: 'hidden' },
  workoutProgressFill: { height: '100%', borderRadius: 3 },
  padded: { paddingHorizontal: 20 },
  exerciseCard: { marginBottom: 12, padding: 16 },
  exerciseHeader: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  exerciseNum: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  exerciseTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 },
  exerciseChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
  expandedExercise: { marginTop: 14, paddingTop: 14, borderTopWidth: 1 },
  notesBox: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 10, borderWidth: 1, padding: 12, marginBottom: 4 },
  setTracker: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 14 },
  setBox: { borderRadius: 10, borderWidth: 1, padding: 10, alignItems: 'center', minWidth: 70 },
  completeBtn: { height: 50, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  finishBanner: { borderRadius: 20, overflow: 'hidden', borderWidth: 2, marginTop: 8 },
  finishGradient: { padding: 32, alignItems: 'center' },
});