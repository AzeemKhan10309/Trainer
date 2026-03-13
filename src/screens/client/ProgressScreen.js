import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, StatCard, SectionHeader, ScreenHeader, Button } from '../../components/ui';
import { PROGRESS_DATA } from '../../data/mockData';
import { spacing, typography, radius } from '../../theme/colors';

const { width } = Dimensions.get('window');

const chartConfig = (theme) => ({
  backgroundColor: theme.bg.card,
  backgroundGradientFrom: theme.bg.card,
  backgroundGradientTo: theme.bg.card,
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 245, 160, ${opacity})`,
  labelColor: () => theme.text.muted,
  style: { borderRadius: 16 },
  propsForDots: { r: '5', strokeWidth: '2', stroke: '#00F5A0' },
});

const BODY_PARTS = [
  { label: 'Chest', start: 102, current: 98, unit: 'cm' },
  { label: 'Waist', start: 95, current: 89, unit: 'cm' },
  { label: 'Hips', start: 108, current: 104, unit: 'cm' },
  { label: 'Arms', start: 36, current: 38, unit: 'cm' },
  { label: 'Thighs', start: 62, current: 59, unit: 'cm' },
];

export default function ProgressScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('weight');

  const tabs = ['weight', 'nutrition', 'body'];

  const weightChange = PROGRESS_DATA.weight[PROGRESS_DATA.weight.length - 1].value - PROGRESS_DATA.weight[0].value;
  const totalLost = user.weight - (user.weight + weightChange);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader title="My Progress" subtitle="TRANSFORMATION" rightIcon="📤" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Progress Card */}
        <LinearGradient colors={['#1A1A2E', '#0F0F1A']} style={styles.heroBanner}>
          <View style={styles.heroLeft}>
            <Text style={[typography.label, { color: theme.accent.primary }]}>TOTAL PROGRESS</Text>
            <Text style={[typography.display, { color: '#fff', marginTop: 4 }]}>
              {Math.abs(weightChange).toFixed(1)} kg
            </Text>
            <Text style={[typography.body, { color: '#A0A0C0' }]}>Lost since Jan 15</Text>

            {/* Goal Progress */}
            <View style={styles.goalTrack}>
              <View style={styles.goalHeader}>
                <Text style={[typography.caption, { color: '#A0A0C0' }]}>Goal: {user.targetWeight} kg</Text>
                <Text style={[typography.caption, { color: theme.accent.primary }]}>42%</Text>
              </View>
              <View style={[styles.goalBar, { backgroundColor: '#2A2A40' }]}>
                <LinearGradient
                  colors={['#00F5A0', '#00C47D']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.goalFill, { width: '42%' }]}
                />
              </View>
            </View>
          </View>

          <View style={styles.heroRight}>
            {/* Weight Journey */}
            <View style={styles.weightJourney}>
              <View style={styles.weightPoint}>
                <Text style={[typography.h3, { color: '#fff' }]}>{PROGRESS_DATA.weight[0].value}</Text>
                <Text style={[typography.caption, { color: '#A0A0C0' }]}>Start</Text>
              </View>
              <Text style={{ color: theme.accent.primary, fontSize: 24 }}>→</Text>
              <View style={styles.weightPoint}>
                <Text style={[typography.h3, { color: theme.accent.primary }]}>
                  {PROGRESS_DATA.weight[PROGRESS_DATA.weight.length - 1].value}
                </Text>
                <Text style={[typography.caption, { color: theme.accent.primary }]}>Now</Text>
              </View>
              <Text style={{ color: '#A0A0C0', fontSize: 24 }}>→</Text>
              <View style={styles.weightPoint}>
                <Text style={[typography.h3, { color: '#A0A0C0' }]}>{user.targetWeight}</Text>
                <Text style={[typography.caption, { color: '#A0A0C0' }]}>Goal</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Tab Bar */}
        <View style={[styles.tabBar, { backgroundColor: theme.bg.elevated }]}>
          {tabs.map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={{ flex: 1 }}>
              {activeTab === tab ? (
                <LinearGradient colors={['#00F5A0', '#00C47D']} style={styles.tabActive}>
                  <Text style={styles.tabActiveText}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactive}>
                  <Text style={[styles.tabInactiveText, { color: theme.text.muted }]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.padded}>
          {/* Weight Tab */}
          {activeTab === 'weight' && (
            <>
              <SectionHeader title="Weight History" />
              <Card style={styles.chartCard}>
                <LineChart
                  data={{
                    labels: PROGRESS_DATA.weight.map(p => p.date.split(' ')[1]),
                    datasets: [{ data: PROGRESS_DATA.weight.map(p => p.value) }],
                  }}
                  width={width - 64}
                  height={220}
                  chartConfig={chartConfig(theme)}
                  bezier
                  style={{ borderRadius: 12 }}
                  yAxisSuffix=" kg"
                />
              </Card>

              <SectionHeader title="Weight Log" />
              {PROGRESS_DATA.weight.map((entry, i) => {
                const prev = PROGRESS_DATA.weight[i - 1];
                const change = prev ? (entry.value - prev.value).toFixed(1) : null;
                const isGain = change > 0;
                return (
                  <Card key={entry.date} style={styles.logRow}>
                    <View style={styles.logContent}>
                      <View style={[styles.logDot, { backgroundColor: i === PROGRESS_DATA.weight.length - 1 ? theme.accent.primary : theme.bg.elevated }]} />
                      <Text style={[typography.body, { color: theme.text.secondary, flex: 1 }]}>{entry.date}</Text>
                      <Text style={[typography.h4, { color: theme.text.primary }]}>{entry.value} kg</Text>
                      {change && (
                        <Text style={[typography.caption, {
                          color: isGain ? theme.status.error : theme.accent.primary,
                          marginLeft: 8, fontWeight: '700',
                        }]}>
                          {isGain ? '+' : ''}{change}
                        </Text>
                      )}
                    </View>
                  </Card>
                );
              })}
            </>
          )}

          {/* Nutrition Tab */}
          {activeTab === 'nutrition' && (
            <>
              <SectionHeader title="Weekly Calories" />
              <Card style={styles.chartCard}>
                <BarChart
                  data={{
                    labels: PROGRESS_DATA.calories.map(c => c.day),
                    datasets: [{
                      data: PROGRESS_DATA.calories.map(c => c.consumed),
                    }],
                  }}
                  width={width - 64}
                  height={200}
                  chartConfig={{
                    ...chartConfig(theme),
                    color: (opacity = 1) => `rgba(0, 217, 245, ${opacity})`,
                  }}
                  fromZero
                  showValuesOnTopOfBars={false}
                  style={{ borderRadius: 12 }}
                />
              </Card>

              <SectionHeader title="Daily Breakdown" />
              {PROGRESS_DATA.calories.map((day, i) => {
                const pct = Math.round((day.consumed / day.target) * 100);
                const color = pct >= 90 && pct <= 110 ? theme.accent.primary : pct > 110 ? theme.status.error : theme.accent.gold;
                return (
                  <Card key={day.day} style={styles.calRow}>
                    <View style={styles.calRowContent}>
                      <Text style={[typography.body, { color: theme.text.secondary, width: 40 }]}>{day.day}</Text>
                      <View style={[styles.calBarTrack, { backgroundColor: theme.bg.elevated, flex: 1, marginHorizontal: 12 }]}>
                        <View style={[styles.calBarFill, { backgroundColor: color, width: `${Math.min(pct, 100)}%` }]} />
                      </View>
                      <Text style={[typography.body, { color: theme.text.primary, fontWeight: '700', width: 60, textAlign: 'right' }]}>
                        {day.consumed}
                      </Text>
                      <Text style={[typography.caption, { color, fontWeight: '700', width: 40, textAlign: 'right' }]}>
                        {pct}%
                      </Text>
                    </View>
                  </Card>
                );
              })}
            </>
          )}

          {/* Body Measurements Tab */}
          {activeTab === 'body' && (
            <>
              <SectionHeader title="Body Measurements" action="Update →" />
              {BODY_PARTS.map(part => {
                const change = part.current - part.start;
                const isBetter = part.label === 'Arms' ? change > 0 : change < 0;
                return (
                  <Card key={part.label} style={styles.measureCard}>
                    <View style={styles.measureHeader}>
                      <Text style={[typography.h4, { color: theme.text.primary, flex: 1 }]}>{part.label}</Text>
                      <Text style={[typography.caption, {
                        color: isBetter ? theme.accent.primary : theme.status.error,
                        fontWeight: '700',
                      }]}>
                        {isBetter ? '' : '+'}{change} {part.unit}
                      </Text>
                    </View>
                    <View style={styles.measureValues}>
                      <View style={styles.measureVal}>
                        <Text style={[typography.caption, { color: theme.text.muted }]}>Start</Text>
                        <Text style={[typography.h4, { color: theme.text.secondary }]}>{part.start}{part.unit}</Text>
                      </View>
                      <View style={[styles.measureArrow]}>
                        <Text style={{ color: theme.accent.primary, fontSize: 20 }}>→</Text>
                      </View>
                      <View style={styles.measureVal}>
                        <Text style={[typography.caption, { color: theme.text.muted }]}>Current</Text>
                        <Text style={[typography.h4, { color: isBetter ? theme.accent.primary : theme.status.error }]}>
                          {part.current}{part.unit}
                        </Text>
                      </View>
                    </View>
                    {/* Change bar */}
                    <View style={[styles.changeBarTrack, { backgroundColor: theme.bg.elevated }]}>
                      <View style={[styles.changeBarFill, {
                        backgroundColor: isBetter ? theme.accent.primary : theme.status.error,
                        width: `${Math.abs(change / part.start) * 500}%`,
                        maxWidth: '100%',
                      }]} />
                    </View>
                  </Card>
                );
              })}

              <Button
                title="📸 Add Progress Photo"
                variant="outline"
                size="lg"
                style={{ width: '100%', marginTop: 8 }}
              />
            </>
          )}

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroBanner: { margin: 20, borderRadius: 20, padding: 24 },
  heroLeft: { marginBottom: 20 },
  goalTrack: { marginTop: 16 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  goalBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  goalFill: { height: '100%', borderRadius: 4 },
  heroRight: {},
  weightJourney: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  weightPoint: { alignItems: 'center' },
  tabBar: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 12, padding: 4, marginBottom: 16 },
  tabActive: { borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  tabActiveText: { fontWeight: '700', color: '#000', fontSize: 14 },
  tabInactive: { paddingVertical: 10, alignItems: 'center' },
  tabInactiveText: { fontWeight: '600', fontSize: 14 },
  padded: { paddingHorizontal: 20 },
  chartCard: { padding: 16, marginBottom: 24 },
  logRow: { padding: 14, marginBottom: 8 },
  logContent: { flexDirection: 'row', alignItems: 'center' },
  logDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  calRow: { padding: 14, marginBottom: 8 },
  calRowContent: { flexDirection: 'row', alignItems: 'center' },
  calBarTrack: { height: 10, borderRadius: 5, overflow: 'hidden' },
  calBarFill: { height: '100%', borderRadius: 5 },
  measureCard: { padding: 16, marginBottom: 10 },
  measureHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  measureValues: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  measureVal: { flex: 1 },
  measureArrow: { alignItems: 'center', paddingHorizontal: 12 },
  changeBarTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  changeBarFill: { height: '100%', borderRadius: 3 },
});
