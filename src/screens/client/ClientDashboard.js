import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Avatar, MacroBar } from '../../components/ui';
import { useClientRealtime } from '../../services/realtime';

export default function ClientDashboard() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  
  // Real-time data fetch kar rahe hain
  const { dietPlan, mealCompletions } = useClientRealtime(user?.id);

  const meals = dietPlan?.meals || [];
  const completedIds = new Set((mealCompletions.data || []).map((m) => m.mealId));
  const completedMeals = meals.filter((m) => completedIds.has(m.id)).length;
  const totalMeals = meals.length || 1;

  // Totals calculate kar rahe hain based on completed meals
  const totals = meals.reduce((acc, meal) => {
    if (completedIds.has(meal.id)) {
      acc.cal += meal.calories || 0;
      acc.protein += meal.protein || 0;
      acc.carbs += meal.carbs || 0;
      acc.fat += meal.fat || 0;
    }
    return acc;
  }, { cal: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      {/* Simple Header */}
      <View style={styles.header}>
        <Text style={{ color: theme.text.primary, fontSize: 24, fontWeight: '700' }}>
          Hey {user?.name?.split(' ')[0] || 'Client'}
        </Text>
        <TouchableOpacity onPress={logout}>
          <Avatar name={user?.name || 'Client'} size={36} color={theme.accent.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Card */}
        <Card>
          <Text style={{ color: theme.text.primary, fontSize: 18 }}>Meal Progress</Text>
          <Text style={{ color: theme.accent.primary, fontSize: 34, fontWeight: '800' }}>
            {completedMeals}/{totalMeals}
          </Text>
          <Text style={{ color: theme.text.secondary }}>
            Calories: {totals.cal} / {dietPlan?.calories || 0} kcal
          </Text>
        </Card>

        {/* Nutrition/Macros Card */}
        <Card style={{ marginTop: 12 }}>
          <Text style={{ color: theme.text.primary, fontSize: 16, marginBottom: 12, fontWeight: '600' }}>
            Daily Macros
          </Text>
          <MacroBar label="Protein" value={totals.protein} max={dietPlan?.protein || 1} color="#00F5A0" />
          <MacroBar label="Carbs" value={totals.carbs} max={dietPlan?.carbs || 1} color="#00D9F5" />
          <MacroBar label="Fat" value={totals.fat} max={dietPlan?.fat || 1} color="#FF6B35" />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  content: { padding: 16 },
});