import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Avatar, Badge, MacroBar } from '../../components/ui'; // removed unused StatCard, SectionHeader
import { DIET_PLANS} from '../../data/mockData'; // removed unused PROGRESS_DATA

export default function ClientDashboard() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const plan = DIET_PLANS[0];

  const completedMeals = plan.meals.filter(m => m.completed).length;
  const totalMeals = plan.meals.length;
  const pct = Math.round((completedMeals / totalMeals) * 100);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const caloriesConsumed = plan.meals.filter(m => m.completed).reduce((sum, m) => sum + m.calories, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border.subtle }]}>
        <View>
          <Text style={{ color: theme.accent.primary, letterSpacing: 1, fontSize: 12 }}>{today.toUpperCase()}</Text>
          <Text style={{ color: theme.text.primary, fontSize: 28, fontWeight: '700' }}>
            Hey, {user.name.split(' ')[0]}! 👋
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.streakBadge, { backgroundColor: '#FF6B3520' }]}>
            <Text style={{ fontSize: 16 }}>🔥</Text>
            <Text style={{ color: '#FF6B35', fontWeight: '700', marginLeft: 4 }}>14d</Text>
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
            <Text style={styles.bannerLabel}>TODAY&apos;S MEAL PROGRESS</Text>
            <Text style={styles.bannerValue}>{completedMeals}/{totalMeals}</Text>
            <Text style={styles.bannerSub}>{pct}% complete</Text>
          </View>
        </LinearGradient>

        <View style={styles.padded}>
          {/* Calorie Summary */}
          <Card style={styles.calCard}>
            <View style={styles.calHeader}>
              <Text style={{ color: theme.text.primary, fontSize: 18, fontWeight: '600' }}>Today&apos;s Nutrition</Text>
              <Badge label={`${plan.calories} kcal target`} color={theme.accent.primary} />
            </View>
            <View style={styles.calNums}>
              <View style={styles.calItem}>
                <Text style={{ color: theme.accent.primary, fontSize: 24, fontWeight: '700' }}>{caloriesConsumed}</Text>
                <Text style={{ color: theme.text.muted, fontSize: 12 }}>CONSUMED</Text>
              </View>
              <View style={[styles.calDivider, { backgroundColor: theme.border.default }]} />
              <View style={styles.calItem}>
                <Text style={{ color: theme.text.secondary, fontSize: 24, fontWeight: '700' }}>{plan.calories - caloriesConsumed}</Text>
                <Text style={{ color: theme.text.muted, fontSize: 12 }}>REMAINING</Text>
              </View>
            </View>
            <MacroBar label="Protein" value={plan.meals.filter(m => m.completed).reduce((s, m) => s + m.protein, 0)} max={plan.protein} color="#00F5A0" />
            <MacroBar label="Carbs" value={plan.meals.filter(m => m.completed).reduce((s, m) => s + m.carbs, 0)} max={plan.carbs} color="#00D9F5" />
            <MacroBar label="Fat" value={plan.meals.filter(m => m.completed).reduce((s, m) => s + m.fat, 0)} max={plan.fat} color="#FF6B35" />
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
  padded: { paddingHorizontal: 20 },
  calCard: { padding: 16, marginBottom: 24 },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  calNums: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  calItem: { flex: 1, alignItems: 'center' },
  calDivider: { width: 1, height: 50, marginHorizontal: 16 },
});