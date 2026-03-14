import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, ScreenHeader, MacroBar } from '../../components/ui';
import { useRealtimeQuery } from '../../services/realtime';
import { db } from '../../services/firebase';

export default function DietPlanBuilder() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');

  // Real-time listener for trainer's specific plans
  const plans = useRealtimeQuery(
    () => (user?.id ? db.collection('dietPlans').where('trainerId', '==', user.id).orderBy('updatedAt', 'desc') : null),
    [user?.id],
  );

  const createPlan = async () => {
    if (!name.trim()) return;
    try {
      await db.collection('dietPlans').add({
        trainerId: user.id,
        name: name.trim(),
        calories: Number(calories || 0),
        protein: Number(protein || 0),
        carbs: 0,
        fat: 0,
        meals: [],
        assignedTo: [],
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      setName('');
      setCalories('');
      setProtein('');
    } catch (e) {
      console.error("Error creating plan:", e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader title="Diet Plans" subtitle="Build nutrition programs" />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Create Plan Form */}
        <Card style={styles.createCard}>
          <Text style={[styles.label, { color: theme.text.primary }]}>Create New Plan</Text>
          <TextInput 
            value={name} 
            onChangeText={setName} 
            placeholder="e.g., Lean Bulk 2026" 
            placeholderTextColor={theme.text.muted} 
            style={[styles.input, { color: theme.text.primary, borderColor: theme.border.default, backgroundColor: theme.bg.input }]} 
          />
          <View style={styles.row}>
            <TextInput 
              value={calories} 
              onChangeText={setCalories} 
              placeholder="Calories" 
              keyboardType="numeric" 
              placeholderTextColor={theme.text.muted} 
              style={[styles.input, { flex: 1, marginRight: 8, color: theme.text.primary, borderColor: theme.border.default, backgroundColor: theme.bg.input }]} 
            />
            <TextInput 
              value={protein} 
              onChangeText={setProtein} 
              placeholder="Protein (g)" 
              keyboardType="numeric" 
              placeholderTextColor={theme.text.muted} 
              style={[styles.input, { flex: 1, color: theme.text.primary, borderColor: theme.border.default, backgroundColor: theme.bg.input }]} 
            />
          </View>
          <Button title="Save Plan" onPress={createPlan} />
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>Active Templates ({plans.data.length})</Text>

        {/* Real-time Plan List */}
        {plans.data.map((plan) => (
          <TouchableOpacity key={plan.id} activeOpacity={0.8}>
            <Card style={styles.planCard}>
              <View style={styles.planHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.planName, { color: theme.text.primary }]}>{plan.name}</Text>
                  <Text style={{ color: theme.text.muted, fontSize: 12 }}>
                    Last updated: {plan.updatedAt?.toDate().toLocaleDateString() || 'Just now'}
                  </Text>
                </View>
                <View style={styles.calorieBadge}>
                  <Text style={{ color: theme.accent.primary, fontWeight: '800' }}>{plan.calories}</Text>
                  <Text style={{ color: theme.text.muted, fontSize: 10 }}>KCAL</Text>
                </View>
              </View>
              
              <View style={styles.macroStrip}>
                <MacroBar label="Protein" value={plan.protein || 0} max={250} color={theme.accent.primary} />
              </View>
              
              <View style={[styles.footer, { borderTopColor: theme.border.subtle }]}>
                <Text style={{ color: theme.text.secondary, fontSize: 12 }}>
                  👤 {plan.assignedTo?.length || 0} Clients assigned
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  createCard: { marginBottom: 24, padding: 16 },
  label: { fontWeight: '700', marginBottom: 12, fontSize: 16 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 4 },
  sectionTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  planCard: { marginBottom: 12, padding: 16 },
  planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  planName: { fontSize: 18, fontWeight: '700' },
  calorieBadge: { alignItems: 'center', minWidth: 50 },
  macroStrip: { marginBottom: 12 },
  footer: { marginTop: 4, paddingTop: 12, borderTopWidth: 1 },
});