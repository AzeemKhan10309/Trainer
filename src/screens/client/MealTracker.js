import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { Card, MacroBar, Badge, ScreenHeader, Button } from '../../components/ui';
import { DIET_PLANS } from '../../data/mockData';
import { spacing, typography, radius } from '../../theme/colors';

const MEAL_ICONS = { 'Breakfast': '🌅', 'Morning Snack': '🍎', 'Lunch': '🥗', 'Afternoon Snack': '🥤', 'Dinner': '🌙' };
const MEAL_COLORS = { 'Breakfast': '#F59E0B', 'Morning Snack': '#EF4444', 'Lunch': '#00F5A0', 'Afternoon Snack': '#8B5CF6', 'Dinner': '#00D9F5' };

export default function MealTracker() {
  const { theme } = useTheme();
  const [plan, setPlan] = useState(DIET_PLANS[0]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [notification, setNotification] = useState(null);

  const completeMeal = (mealId) => {
    const meal = plan.meals.find(m => m.id === mealId);
    if (!meal || meal.completed) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    // Update meal
    setPlan(prev => ({
      ...prev,
      meals: prev.meals.map(m =>
        m.id === mealId ? { ...m, completed: true, completedAt: timeStr } : m
      ),
    }));

    // Show notification toast
    setNotification(`✅ ${meal.type} marked complete at ${timeStr}!\nYour trainer has been notified.`);
    setTimeout(() => setNotification(null), 3500);

    // Simulated: send to trainer
    console.log(`[NOTIFICATION] Client Ahmed has completed ${meal.type} at ${timeStr}`);
  };

  const completedMeals = plan.meals.filter(m => m.completed).length;
  const totalCalories = plan.meals.filter(m => m.completed).reduce((s, m) => s + m.calories, 0);
  const progressPct = Math.round((completedMeals / plan.meals.length) * 100);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader title="Meal Tracker" subtitle="TODAY'S PLAN" />

      {/* Notification Toast */}
      {notification && (
        <Animated.View style={[styles.toast, { backgroundColor: '#00F5A0' }]}>
          <Text style={[{ color: '#000', fontWeight: '700', fontSize: 14, lineHeight: 20 }]}>{notification}</Text>
        </Animated.View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Daily Summary */}
        <View style={[styles.summaryBand, { backgroundColor: theme.bg.card, borderBottomColor: theme.border.subtle }]}>
          <View style={styles.summaryItem}>
            <Text style={[typography.h2, { color: theme.accent.primary }]}>{completedMeals}/{plan.meals.length}</Text>
            <Text style={[typography.label, { color: theme.text.muted }]}>MEALS DONE</Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: theme.border.default }]} />
          <View style={styles.summaryItem}>
            <Text style={[typography.h2, { color: theme.text.primary }]}>{totalCalories}</Text>
            <Text style={[typography.label, { color: theme.text.muted }]}>KCAL TODAY</Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: theme.border.default }]} />
          <View style={styles.summaryItem}>
            <Text style={[typography.h2, { color: progressPct >= 80 ? theme.accent.primary : theme.accent.gold }]}>{progressPct}%</Text>
            <Text style={[typography.label, { color: theme.text.muted }]}>COMPLIANCE</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBarWrapper, { backgroundColor: theme.bg.elevated }]}>
          <LinearGradient
            colors={['#00F5A0', '#00C47D']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${progressPct}%` }]}
          />
        </View>

        {/* Meal Cards */}
        <View style={styles.padded}>
          {plan.meals.map(meal => (
            <TouchableOpacity key={meal.id} onPress={() => setSelectedMeal(selectedMeal?.id === meal.id ? null : meal)} activeOpacity={0.9}>
              <Card style={[
                styles.mealCard,
                meal.completed && { borderColor: theme.accent.primary + '40', borderWidth: 1.5 },
                selectedMeal?.id === meal.id && { borderColor: MEAL_COLORS[meal.type], borderWidth: 1.5 },
              ]}>
                {/* Meal Header */}
                <View style={styles.mealHeader}>
                  <View style={[styles.mealIcon, { backgroundColor: MEAL_COLORS[meal.type] + '20' }]}>
                    <Text style={{ fontSize: 24 }}>{MEAL_ICONS[meal.type]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.mealTitleRow}>
                      <Text style={[typography.h4, { color: theme.text.primary }]}>{meal.type}</Text>
                      {meal.completed
                        ? <View style={[styles.completedBadge, { backgroundColor: theme.accent.primary }]}>
                            <Text style={{ color: '#000', fontSize: 11, fontWeight: '700' }}>✓ Done {meal.completedAt}</Text>
                          </View>
                        : <View style={[styles.timeBadge, { backgroundColor: theme.bg.elevated }]}>
                            <Text style={{ color: theme.text.secondary, fontSize: 11 }}>⏰ {meal.time}</Text>
                          </View>
                      }
                    </View>
                    <Text style={[typography.caption, { color: MEAL_COLORS[meal.type], marginTop: 2 }]}>
                      {meal.calories} kcal • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g F
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, color: theme.text.muted }}>{selectedMeal?.id === meal.id ? '▼' : '▶'}</Text>
                </View>

                {/* Expanded View */}
                {selectedMeal?.id === meal.id && (
                  <View style={styles.expandedContent}>
                    {/* Food Items */}
                    <View style={styles.foodSection}>
                      <Text style={[typography.label, { color: theme.text.muted, marginBottom: 8 }]}>FOOD ITEMS</Text>
                      {meal.items.map((item, i) => (
                        <View key={i} style={[styles.foodItem, { borderBottomColor: theme.border.subtle }]}>
                          <Text style={{ color: MEAL_COLORS[meal.type], fontSize: 12, marginRight: 10 }}>◆</Text>
                          <Text style={[typography.body, { color: theme.text.secondary, flex: 1 }]}>{item}</Text>
                          {i === 0 && <Text style={{ fontSize: 14 }}>⚖️</Text>}
                        </View>
                      ))}
                    </View>

                    {/* Macros */}
                    <View style={styles.macroSection}>
                      <MacroBar label="Protein" value={meal.protein} max={50} color="#00F5A0" />
                      <MacroBar label="Carbs" value={meal.carbs} max={100} color="#00D9F5" />
                      <MacroBar label="Fat" value={meal.fat} max={50} color="#FF6B35" />
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionRow}>
                      <TouchableOpacity style={[styles.actionBtn, { borderColor: theme.border.default, flex: 1, marginRight: 8 }]}>
                        <Text style={{ fontSize: 16, marginRight: 6 }}>📸</Text>
                        <Text style={[{ color: theme.text.secondary, fontWeight: '600' }]}>Photo</Text>
                      </TouchableOpacity>

                      {!meal.completed ? (
                        <TouchableOpacity
                          onPress={() => completeMeal(meal.id)}
                          style={{ flex: 2 }}
                          activeOpacity={0.85}
                        >
                          <LinearGradient
                            colors={['#00F5A0', '#00C47D']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.completeBtn}
                          >
                            <Text style={{ fontSize: 18, marginRight: 8 }}>✅</Text>
                            <Text style={{ color: '#000', fontWeight: '800', fontSize: 16 }}>Meal Completed!</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.completedState, { borderColor: theme.accent.primary + '40', flex: 2 }]}>
                          <Text style={{ fontSize: 18, marginRight: 8 }}>🎉</Text>
                          <Text style={[{ color: theme.accent.primary, fontWeight: '700' }]}>Completed!</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Plan Info */}
        <View style={styles.padded}>
          <Card style={{ padding: 16, marginBottom: 32 }}>
            <Text style={[typography.label, { color: theme.text.muted, marginBottom: 8 }]}>YOUR PLAN</Text>
            <Text style={[typography.h3, { color: theme.text.primary }]}>{plan.name}</Text>
            <View style={styles.planMacros}>
              {[
                { label: 'Protein', value: `${plan.protein}g`, color: '#00F5A0' },
                { label: 'Carbs', value: `${plan.carbs}g`, color: '#00D9F5' },
                { label: 'Fat', value: `${plan.fat}g`, color: '#FF6B35' },
                { label: 'Calories', value: `${plan.calories}`, color: '#F59E0B' },
              ].map(m => (
                <View key={m.label} style={styles.planMacroItem}>
                  <Text style={[typography.h4, { color: m.color }]}>{m.value}</Text>
                  <Text style={[typography.caption, { color: theme.text.muted }]}>{m.label}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toast: { margin: 16, borderRadius: 12, padding: 14, position: 'absolute', top: 120, left: 16, right: 16, zIndex: 999 },
  summaryBand: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1 },
  progressBarWrapper: { height: 6, marginHorizontal: 0 },
  progressBarFill: { height: '100%' },
  padded: { paddingHorizontal: 20, paddingTop: 20 },
  mealCard: { marginBottom: 12, padding: 16 },
  mealHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  mealIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  mealTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  completedBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  timeBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  expandedContent: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#1E1E30', paddingTop: 16 },
  foodSection: { marginBottom: 16 },
  foodItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1 },
  macroSection: { marginBottom: 16 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, height: 52, paddingHorizontal: 16 },
  completeBtn: { height: 52, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  completedState: { height: 52, borderRadius: 12, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  planMacros: { flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' },
  planMacroItem: { alignItems: 'center' },
});
