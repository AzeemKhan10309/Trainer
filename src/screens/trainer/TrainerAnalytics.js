import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from '../../components/charts';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { Card, StatCard, SectionHeader, Avatar, ScreenHeader } from '../../components/ui';
import { ANALYTICS_DATA, PROGRESS_DATA } from '../../data/mockData';
import { typography } from '../../theme/colors';

const { width } = Dimensions.get('window');

const chartConfig = (theme) => ({
  backgroundColor: theme.bg.card,
  backgroundGradientFrom: theme.bg.card,
  backgroundGradientTo: theme.bg.card,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 245, 160, ${opacity})`,
  labelColor: () => theme.text.muted,
  style: { borderRadius: 16 },
  propsForDots: { r: '4', strokeWidth: '2', stroke: '#00F5A0' },
});

export default function TrainerAnalytics() {
  const { theme } = useTheme();

  const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader title="Analytics" subtitle="PERFORMANCE" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Summary Cards */}
        <View style={styles.statsGrid}>
          <StatCard label="TOTAL CLIENTS" value={ANALYTICS_DATA.totalClients} icon="👥" color={theme.accent.primary} style={styles.statHalf} />
          <StatCard label="ACTIVE" value={ANALYTICS_DATA.activeClients} icon="✅" color={theme.status.success} style={styles.statHalf} />
          <StatCard label="COMPLIANCE" value={`${ANALYTICS_DATA.avgCompliance}%`} icon="🎯" color={theme.accent.secondary} style={styles.statHalf} />
          <StatCard label="REVENUE" value={`$${ANALYTICS_DATA.revenue}`} icon="💰" color={theme.accent.gold} style={styles.statHalf} />
        </View>

        {/* Revenue Chart */}
        <SectionHeader title="Monthly Revenue" />
        <Card style={styles.chartCard}>
          <BarChart
            data={{
              labels: monthlyLabels,
              datasets: [{ data: ANALYTICS_DATA.monthlyRevenue }],
            }}
            width={width - 64}
            height={200}
            chartConfig={{
              ...chartConfig(theme),
              color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
            }}
            style={{ borderRadius: 12 }}
            showValuesOnTopOfBars
            fromZero
          />
        </Card>

        {/* Meal Compliance Chart */}
        <SectionHeader title="Weekly Meal Compliance" />
        <Card style={styles.chartCard}>
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{ data: PROGRESS_DATA.mealCompletion }],
            }}
            width={width - 64}
            height={200}
            chartConfig={chartConfig(theme)}
            bezier
            style={{ borderRadius: 12 }}
          />
        </Card>

        {/* Client Performance Ranking */}
        <SectionHeader title="Client Progress Ranking" />
        {ANALYTICS_DATA.clientProgress.map((client, i) => (
          <Card key={client.name} style={styles.rankCard}>
            <View style={styles.rankRow}>
              <View style={[styles.rankNum, {
                backgroundColor: i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7C2F' : theme.bg.elevated
              }]}>
                <Text style={{ fontWeight: '800', color: i < 3 ? '#000' : theme.text.muted, fontSize: 13 }}>#{i + 1}</Text>
              </View>
              <Avatar name={client.name} size={38} color={theme.accent.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[typography.h4, { color: theme.text.primary }]}>{client.name}</Text>
                <View style={[styles.rankBar, { backgroundColor: theme.bg.elevated }]}>
                  <LinearGradient
                    colors={client.trend === 'up' ? ['#00F5A0', '#00C47D'] : ['#EF4444', '#DC2626']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={[styles.rankFill, { width: `${client.progress}%` }]}
                  />
                </View>
              </View>
              <View style={styles.rankRight}>
                <Text style={[typography.h3, { color: client.trend === 'up' ? theme.accent.primary : theme.status.error }]}>
                  {client.progress}%
                </Text>
                <Text style={{ fontSize: 16 }}>{client.trend === 'up' ? '📈' : '📉'}</Text>
              </View>
            </View>
          </Card>
        ))}

        {/* Meal Compliance per Client */}
        <SectionHeader title="Meal Compliance Rate" />
        <Card style={styles.complianceCard}>
          {ANALYTICS_DATA.mealComplianceByClient.map((entry) => (
            <View key={entry.client} style={styles.complianceRow}>
              <Text style={[typography.body, { color: theme.text.secondary, width: 60 }]}>{entry.client}</Text>
              <View style={[styles.compBar, { backgroundColor: theme.bg.elevated, flex: 1, marginHorizontal: 12 }]}>
                <LinearGradient
                  colors={entry.rate >= 80 ? ['#00F5A0', '#00C47D'] : entry.rate >= 60 ? ['#F59E0B', '#D97706'] : ['#EF4444', '#DC2626']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.compFill, { width: `${entry.rate}%` }]}
                />
              </View>
              <Text style={[typography.body, { color: theme.text.primary, fontWeight: '700', width: 40, textAlign: 'right' }]}>
                {entry.rate}%
              </Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 32 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statHalf: { width: (width - 50) / 2 },
  chartCard: { padding: 16, marginBottom: 24 },
  rankCard: { padding: 14, marginBottom: 10 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankNum: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rankBar: { height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 6 },
  rankFill: { height: '100%', borderRadius: 4 },
  rankRight: { alignItems: 'center' },
  complianceCard: { padding: 16, marginBottom: 32, gap: 14 },
  complianceRow: { flexDirection: 'row', alignItems: 'center' },
  compBar: { height: 10, borderRadius: 5, overflow: 'hidden' },
  compFill: { height: '100%', borderRadius: 5 },
});