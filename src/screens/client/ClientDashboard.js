import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Avatar, Badge, StatCard, SectionHeader, MacroBar } from '../../components/ui';
import { DIET_PLANS, WORKOUT_PLANS, PROGRESS_DATA } from '../../data/mockData';
import { spacing, typography, radius } from '../../theme/colors';

const { width } = Dimensions.get('window');

const MEAL_ICONS = { 'Breakfast': '🌅', 'Morning Snack': '🍎', 'Lunch': '🥗', 'Afternoon Snack': '🥤', 'Dinner': '🌙' };

export default function ClientDashboard() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const plan = DIET_PLANS[0];
  const workout = WORKOUT_PLANS[0];

  const completedMeals = plan.meals.filter(m => m.completed).length;
  const totalMeals = plan.meals.length;
  const completedExercises = workout.exercises.filter(e => e.completed).length;
  const pct = Math.round((completedMeals / totalMeals) * 100);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const caloriesConsumed = plan.meals.filter(m => m.completed).reduce((sum, m) => sum + m.calories, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border.subtle }]}>
        <View>
          <Text style={[typography.label, { color: theme.accent.primary }]}>{today.toUpperCase()}</Text>
          <Text style={[typography.h1, { color: theme.text.primary }]}>Hey, {user.name.split(' ')[0]}! 👋</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.streakBadge, { backgroundColor: '#FF6B3520' }]}>
            <Text style={{ fontSize: 16 }}>🔥</Text>
            <Text style={[{ color: '#FF6B35', fontWeight: '700', marginLeft: 4 }]}>14d</Text>
          </View>
          <TouchableOpacity onPress={logout} style={[styles.avatarBtn, { backgroundColor: theme.bg.elevated }]}>
            <Avatar name={user.name} size={36} color={theme.accent.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Today's Progress Banner */}
        <LinearGradient
          colors={pct >= 80 ? ['#00F5A0', '#00C47D'] : pct >= 50 ? ['#F59E0B', '#D97706'] : ['#8B5CF6', '#6D28D9']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.progressBanner}
        >
          <View>
            <Text style={styles.bannerLabel}>TODAY'S MEAL PROGRESS</Text>
            <Text style={styles.bannerValue}>{completedMeals}/{totalMeals}</Text>
            <Text style={styles.bannerSub}>{pct}% complete</Text>
          </View>
          <View style={styles.bannerRight}>
            {/* Simple ring visualization */}
            <View style={styles.ringOuter}>
              <View style={[styles.ringInner, { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
                <Text style={styles.ringText}>{pct}%</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.padded}>
          {/* Calorie Summary */}
          <Card style={styles.calCard}>
            <View style={styles.calHeader}>
              <Text style={[typography.h3, { color: theme.text.primary }]}>Today's Nutrition</Text>
              <Badge label={`${plan.calories} kcal target`} color={theme.accent.primary} />
            </View>
            <View style={styles.calNums}>
              <View style={styles.calItem}>
                <Text style={[typography.display, { color: theme.accent.primary }]}>{caloriesConsumed}</Text>
                <Text style={[typography.label, { color: theme.text.muted }]}>CONSUMED</Text>
              </View>
              <View style={[styles.calDivider, { backgroundColor: theme.border.default }]} />
              <View style={styles.calItem}>
                <Text style={[typography.display, { color: theme.text.secondary }]}>{plan.calories - caloriesConsumed}</Text>
                <Text style={[typography.label, { color: theme.text.muted }]}>REMAINING</Text>
              </View>
            </View>
            <MacroBar label="Protein" value={plan.meals.filter(m => m.completed).reduce((s, m) => s + m.protein, 0)} max={plan.protein} color="#00F5A0" />
            <MacroBar label="Carbs" value={plan.meals.filter(m => m.completed).reduce((s, m) => s + m.carbs, 0)} max={plan.carbs} color="#00D9F5" />
            <MacroBar label="Fat" value={plan.meals.filter(m => m.completed).reduce((s, m) => s + m.fat, 0)} max={plan.fat} color="#FF6B35" />
          </Card>

          {/* Next Meal */}
          <SectionHeader title="Up Next" />
          {(() => {
            const nextMeal = plan.meals.find(m => !m.completed);
            if (!nextMeal) return (
              <Card style={[styles.allDoneCard, { borderColor: theme.accent.primary + '40' }]}>
                <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 8 }}>🎉</Text>
                <Text style={[typography.h3, { color: theme.text.primary, textAlign: 'center' }]}>All meals done!</Text>
                <Text style={[typography.body, { color: theme.text.secondary, textAlign: 'center', marginTop: 4 }]}>
                  Amazing consistency today. Your trainer will be impressed!
                </Text>
              </Card>
            );
            return (
              <Card style={[styles.nextMealCard, { borderColor: theme.accent.primary + '30' }]}>
                <View style={styles.nextMealHeader}>
                  <View style={[styles.mealIconBig, { backgroundColor: theme.accent.primary + '20' }]}>
                    <Text style={{ fontSize: 28 }}>{MEAL_ICONS[nextMeal.type]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[typography.h3, { color: theme.text.primary }]}>{nextMeal.type}</Text>
                    <Text style={[typography.body, { color: theme.accent.primary }]}>{nextMeal.time} • {nextMeal.calories} kcal</Text>
                  </View>
                  <View style={[styles.timePill, { backgroundColor: theme.accent.primary + '20' }]}>
                    <Text style={{ color: theme.accent.primary, fontWeight: '700', fontSize: 13 }}>{nextMeal.time}</Text>
                  </View>
                </View>
                <View style={styles.foodList}>
                  {nextMeal.items.map((item, i) => (
                    <View key={i} style={styles.foodListItem}>
                      <Text style={{ color: theme.accent.primary, fontSize: 12 }}>◆</Text>
                      <Text style={[typography.body, { color: theme.text.secondary, marginLeft: 8, flex: 1 }]}>{item}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            );
          })()}

          {/* Today's Workout Preview */}
          <SectionHeader title="Today's Workout" action="Start →" />
          <Card style={styles.workoutPreview} gradient={['#1A1A2E', '#13131F']}>
            <View style={styles.workoutHeader}>
              <Text style={{ fontSize: 32 }}>💪</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[typography.h3, { color: '#fff' }]}>{workout.currentDay}</Text>
                <Text style={[typography.body, { color: '#A0A0C0' }]}>{workout.exercises.length} exercises</Text>
              </View>
              <Badge label={`${completedExercises}/${workout.exercises.length}`} color={theme.accent.primary} />
            </View>
            <View style={[styles.workoutBarTrack, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
              <LinearGradient
                colors={['#00F5A0', '#00C47D']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.workoutBarFill, { width: `${(completedExercises / workout.exercises.length) * 100}%` }]}
              />
            </View>
          </Card>

          {/* Progress Stats */}
          <SectionHeader title="Your Stats" />
          <View style={styles.statsRow}>
            <StatCard label="CURRENT WEIGHT" value={`${user.weight}kg`} icon="⚖️" color={theme.accent.secondary} style={{ marginRight: 8, flex: 1 }} />
            <StatCard label="TARGET" value={`${user.targetWeight}kg`} icon="🎯" color={theme.accent.gold} style={{ flex: 1 }} />
          </View>

          <Card style={styles.weightGoal}>
            <Text style={[typography.body, { color: theme.text.secondary }]}>Weight to lose</Text>
            <Text style={[typography.h2, { color: theme.accent.primary }]}>{user.weight - user.targetWeight} kg</Text>
            <View style={[styles.weightBarTrack, { backgroundColor: theme.bg.elevated }]}>
              <LinearGradient
                colors={['#00F5A0', '#00C47D']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.weightBarFill, { width: '42%' }]}
              />
            </View>
            <Text style={[typography.caption, { color: theme.text.muted, marginTop: 4 }]}>42% of your goal achieved</Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 1 },
  headerRight: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  avatarBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  progressBanner: { margin: 20, borderRadius: 20, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: 'rgba(0,0,0,0.6)' },
  bannerValue: { fontSize: 44, fontWeight: '800', color: '#000', letterSpacing: -2, lineHeight: 52 },
  bannerSub: { color: 'rgba(0,0,0,0.6)', fontSize: 13 },
  bannerRight: {},
  ringOuter: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' },
  ringInner: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  ringText: { fontSize: 16, fontWeight: '800', color: '#000' },
  padded: { paddingHorizontal: 20 },
  calCard: { padding: 16, marginBottom: 24 },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  calNums: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  calItem: { flex: 1, alignItems: 'center' },
  calDivider: { width: 1, height: 50, marginHorizontal: 16 },
  nextMealCard: { padding: 16, marginBottom: 24, borderWidth: 1 },
  nextMealHeader: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 14 },
  mealIconBig: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  timePill: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  foodList: { gap: 8 },
  foodListItem: { flexDirection: 'row', alignItems: 'flex-start' },
  allDoneCard: { padding: 24, marginBottom: 24, borderWidth: 1, borderStyle: 'dashed' },
  workoutPreview: { padding: 16, marginBottom: 24 },
  workoutHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  workoutBarTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  workoutBarFill: { height: '100%', borderRadius: 4 },
  statsRow: { flexDirection: 'row', marginBottom: 12 },
  weightGoal: { padding: 16, marginBottom: 32 },
  weightBarTrack: { height: 10, borderRadius: 5, overflow: 'hidden', marginTop: 10 },
  weightBarFill: { height: '100%', borderRadius: 5 },
});
