import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { Card, Button, MacroBar, SectionHeader, Avatar, ScreenHeader } from '../../components/ui';
import { DIET_PLANS, CLIENTS } from '../../data/mockData';
import { spacing, typography, radius } from '../../theme/colors';

const MEAL_TYPES = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner'];
const MEAL_ICONS = { 'Breakfast': '🌅', 'Morning Snack': '🍎', 'Lunch': '🥗', 'Afternoon Snack': '🥤', 'Dinner': '🌙' };

export default function DietPlanBuilder() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('plans');
  const [selectedPlan, setSelectedPlan] = useState(DIET_PLANS[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs = ['plans', 'create'];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader title="Diet Plans" subtitle="NUTRITION" rightIcon="➕" onRightPress={() => setActiveTab('create')} />

      {/* Tab Switcher */}
      <View style={[styles.tabBar, { backgroundColor: theme.bg.elevated }]}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            {activeTab === tab ? (
              <LinearGradient colors={['#00F5A0', '#00C47D']} style={styles.tabGradient}>
                <Text style={styles.tabTextActive}>{tab === 'plans' ? '📋 My Plans' : '✏️ Create'}</Text>
              </LinearGradient>
            ) : (
              <Text style={[styles.tabText, { color: theme.text.muted }]}>
                {tab === 'plans' ? '📋 My Plans' : '✏️ Create'}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'plans' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Plans List */}
          <View style={styles.padded}>
            <SectionHeader title="Active Plans" />
            {DIET_PLANS.map(plan => (
              <TouchableOpacity key={plan.id} onPress={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}>
                <Card style={[styles.planCard, selectedPlan?.id === plan.id && { borderColor: theme.accent.primary, borderWidth: 1.5 }]}>
                  <View style={styles.planHeader}>
                    <View style={[styles.planIcon, { backgroundColor: theme.accent.primary + '20' }]}>
                      <Text style={{ fontSize: 24 }}>🥗</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[typography.h4, { color: theme.text.primary }]}>{plan.name}</Text>
                      <Text style={[typography.caption, { color: theme.text.secondary, marginTop: 2 }]}>
                        {plan.meals.length} meals • {plan.assignedTo.length} clients
                      </Text>
                    </View>
                    <View>
                      <Text style={[typography.h3, { color: theme.accent.primary }]}>{plan.calories}</Text>
                      <Text style={[typography.caption, { color: theme.text.muted }]}>kcal</Text>
                    </View>
                  </View>

                  {/* Macros */}
                  <View style={styles.macros}>
                    <MacroBar label="Protein" value={plan.protein} max={250} color="#00F5A0" />
                    <MacroBar label="Carbs" value={plan.carbs} max={400} color="#00D9F5" />
                    <MacroBar label="Fat" value={plan.fat} max={150} color="#FF6B35" />
                  </View>

                  {/* Assigned clients */}
                  {plan.assignedTo.length > 0 && (
                    <View style={styles.assignedRow}>
                      <Text style={[typography.label, { color: theme.text.muted }]}>ASSIGNED TO</Text>
                      <View style={styles.assignedClients}>
                        {plan.assignedTo.map(cid => {
                          const client = CLIENTS.find(c => c.id === cid);
                          return client ? (
                            <View key={cid} style={[styles.assignedBadge, { backgroundColor: theme.bg.elevated }]}>
                              <Avatar name={client.name} size={20} color={theme.accent.primary} />
                              <Text style={[{ color: theme.text.secondary, fontSize: 12, marginLeft: 6 }]}>
                                {client.name.split(' ')[0]}
                              </Text>
                            </View>
                          ) : null;
                        })}
                      </View>
                    </View>
                  )}
                </Card>

                {/* Expanded Meal List */}
                {selectedPlan?.id === plan.id && (
                  <View style={styles.mealsList}>
                    {plan.meals.map(meal => (
                      <Card key={meal.id} style={styles.mealItem}>
                        <View style={styles.mealRow}>
                          <View style={[styles.mealTypeIcon, { backgroundColor: theme.bg.elevated }]}>
                            <Text style={{ fontSize: 20 }}>{MEAL_ICONS[meal.type]}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={styles.mealTitleRow}>
                              <Text style={[typography.h4, { color: theme.text.primary }]}>{meal.type}</Text>
                              <Text style={[typography.caption, { color: theme.text.muted }]}>{meal.time}</Text>
                            </View>
                            <Text style={[typography.caption, { color: theme.accent.primary, marginTop: 2 }]}>
                              {meal.calories} kcal • {meal.protein}g protein
                            </Text>
                            <View style={styles.foodItems}>
                              {meal.items.map((item, i) => (
                                <View key={i} style={styles.foodItem}>
                                  <Text style={{ color: theme.text.muted, fontSize: 10 }}>•</Text>
                                  <Text style={[typography.caption, { color: theme.text.secondary, marginLeft: 6 }]}>{item}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                          <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.bg.elevated }]}>
                            <Text style={{ fontSize: 14 }}>✏️</Text>
                          </TouchableOpacity>
                        </View>
                      </Card>
                    ))}
                    <Button title="+ Add Meal" variant="outline" size="sm" style={{ marginTop: 4 }} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <CreatePlanForm theme={theme} onSave={() => setActiveTab('plans')} />
      )}
    </View>
  );
}

function CreatePlanForm({ theme, onSave }) {
  const [planName, setPlanName] = useState('');
  const [calories, setCalories] = useState('');
  const [meals, setMeals] = useState([]);

  const addMeal = (type) => {
    setMeals(p => [...p, {
      id: Date.now(), type, time: '12:00 PM',
      calories: '', protein: '', carbs: '', fat: '',
      items: [],
    }]);
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.padded}>
      <Card style={{ marginBottom: 16 }}>
        <Text style={[typography.h3, { color: theme.text.primary, marginBottom: 16 }]}>Plan Details</Text>
        <View style={[styles.formInput, { backgroundColor: theme.bg.input, borderColor: theme.border.default }]}>
          <TextInput value={planName} onChangeText={setPlanName} placeholder="Plan name (e.g. Keto Cutting)" placeholderTextColor={theme.text.muted} style={{ color: theme.text.primary, fontSize: 15 }} />
        </View>
        <View style={[styles.formInput, { backgroundColor: theme.bg.input, borderColor: theme.border.default }]}>
          <TextInput value={calories} onChangeText={setCalories} placeholder="Daily calories target" placeholderTextColor={theme.text.muted} keyboardType="numeric" style={{ color: theme.text.primary, fontSize: 15 }} />
        </View>

        {/* Macro inputs */}
        <View style={styles.macroRow}>
          {['Protein', 'Carbs', 'Fat'].map((m, i) => (
            <View key={m} style={{ flex: 1, marginHorizontal: i === 1 ? 8 : 0 }}>
              <Text style={[typography.label, { color: theme.text.muted, marginBottom: 4 }]}>{m} (g)</Text>
              <View style={[styles.formInput, { backgroundColor: theme.bg.input, borderColor: theme.border.default }]}>
                <TextInput keyboardType="numeric" placeholder="0" placeholderTextColor={theme.text.muted} style={{ color: theme.text.primary, fontSize: 15 }} />
              </View>
            </View>
          ))}
        </View>
      </Card>

      <SectionHeader title="Add Meals" />
      <Text style={[typography.body, { color: theme.text.secondary, marginBottom: 12 }]}>Select meal slots to add:</Text>

      <View style={styles.mealTypeGrid}>
        {MEAL_TYPES.map(type => {
          const added = meals.some(m => m.type === type);
          return (
            <TouchableOpacity
              key={type}
              onPress={() => !added && addMeal(type)}
              style={[
                styles.mealTypePill,
                { backgroundColor: added ? theme.accent.primary + '20' : theme.bg.elevated, borderColor: added ? theme.accent.primary : theme.border.default }
              ]}
            >
              <Text style={{ fontSize: 18 }}>{MEAL_ICONS[type]}</Text>
              <Text style={[{ fontSize: 12, fontWeight: '600', marginTop: 4, color: added ? theme.accent.primary : theme.text.secondary }]}>
                {type}
              </Text>
              {added && <Text style={{ color: theme.accent.primary, fontSize: 10, marginTop: 2 }}>Added ✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {meals.map((meal, i) => (
        <Card key={meal.id} style={{ marginTop: 12 }}>
          <View style={styles.mealHeader2}>
            <Text style={{ fontSize: 20 }}>{MEAL_ICONS[meal.type]}</Text>
            <Text style={[typography.h4, { color: theme.text.primary, marginLeft: 8 }]}>{meal.type}</Text>
          </View>
          <View style={[styles.formInput, { backgroundColor: theme.bg.input, borderColor: theme.border.default, marginTop: 8 }]}>
            <TextInput placeholder="Food items (one per line)" placeholderTextColor={theme.text.muted} multiline style={{ color: theme.text.primary, fontSize: 14, minHeight: 60 }} />
          </View>
          <View style={styles.macroRow}>
            {['Calories', 'Protein', 'Carbs'].map((m, idx) => (
              <View key={m} style={{ flex: 1, marginRight: idx < 2 ? 8 : 0 }}>
                <View style={[styles.formInput, { backgroundColor: theme.bg.input, borderColor: theme.border.default }]}>
                  <TextInput keyboardType="numeric" placeholder={m} placeholderTextColor={theme.text.muted} style={{ color: theme.text.primary, fontSize: 13 }} />
                </View>
              </View>
            ))}
          </View>
        </Card>
      ))}

      <Button title="Save Plan" onPress={onSave} size="lg" style={{ width: '100%', marginTop: 24, marginBottom: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, borderRadius: 10 },
  tabActive: {},
  tabGradient: { borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  tabText: { textAlign: 'center', paddingVertical: 10, fontWeight: '600', fontSize: 14 },
  tabTextActive: { fontWeight: '700', color: '#000', fontSize: 14 },
  padded: { paddingHorizontal: 20 },
  planCard: { marginBottom: 8, padding: 16 },
  planHeader: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 14 },
  planIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  macros: { marginBottom: 12 },
  assignedRow: {},
  assignedClients: { flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' },
  assignedBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  mealsList: { paddingLeft: 16, marginBottom: 8 },
  mealItem: { marginBottom: 8, padding: 12 },
  mealRow: { flexDirection: 'row', gap: 10 },
  mealTypeIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  mealTitleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  foodItems: { marginTop: 6, gap: 2 },
  foodItem: { flexDirection: 'row', alignItems: 'flex-start' },
  editBtn: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  formInput: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  macroRow: { flexDirection: 'row' },
  mealTypeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  mealTypePill: { width: '30%', borderRadius: 12, borderWidth: 1, padding: 12, alignItems: 'center' },
  mealHeader2: { flexDirection: 'row', alignItems: 'center' },
});
