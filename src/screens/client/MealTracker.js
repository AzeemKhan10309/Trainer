import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, ScreenHeader } from '../../components/ui';
import { useClientRealtime, completeMeal } from '../../services/realtime';

export default function MealTracker() {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  // Real-time diet plan aur completion status fetch kar rahe hain
  const { dietPlan, mealCompletions } = useClientRealtime(user?.id);
  
  // Completed meals ki IDs ka set bana rahe hain for fast lookup
  const completed = new Set((mealCompletions.data || []).map((m) => m.mealId));

  const markDone = async (meal) => {
    try {
      await completeMeal({
        clientId: user.id,
        trainerId: user.trainerId,
        planId: dietPlan?.id,
        mealId: meal.id,
        mealType: meal.type,
      });
    } catch (error) {
      console.error("Error marking meal as complete:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader 
        title="Meal Tracker" 
        subtitle={dietPlan?.name || 'No assigned plan'} 
      />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {(dietPlan?.meals || []).map((meal) => {
          const isDone = completed.has(meal.id);
          
          return (
            <Card key={meal.id} style={styles.card}>
              <View style={styles.mealInfo}>
                <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: 16 }}>
                  {meal.type} • {meal.time}
                </Text>
                <Text style={{ color: theme.text.secondary, marginTop: 4 }}>
                  {(meal.items || []).join(', ')}
                </Text>
                <Text style={{ color: theme.accent.primary, fontSize: 12, marginTop: 4 }}>
                  {meal.calories} kcal | P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                </Text>
              </View>

              <TouchableOpacity 
                onPress={() => !isDone && markDone(meal)} 
                disabled={isDone}
                style={[
                  styles.button, 
                  { backgroundColor: isDone ? theme.status.success : theme.accent.primary }
                ]}
              >
                <Text style={styles.buttonText}>
                  {isDone ? '✅ Completed' : 'Mark as complete'}
                </Text>
              </TouchableOpacity>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { marginBottom: 12, padding: 16 },
  mealInfo: { marginBottom: 12 },
  button: { borderRadius: 8, padding: 12, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#000', fontWeight: '700', fontSize: 14 },
});