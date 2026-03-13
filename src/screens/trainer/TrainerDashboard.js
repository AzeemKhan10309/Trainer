import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Avatar, Badge, StatCard, SectionHeader } from '../../components/ui';
import { CLIENTS, NOTIFICATIONS, ANALYTICS_DATA } from '../../data/mockData';
import { typography } from '../../theme/colors'; // removed spacing, radius

export default function TrainerDashboard() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const unreadNotifs = NOTIFICATIONS.filter(n => !n.read).length;

  const todayStats = {
    mealsCompleted: CLIENTS.reduce((sum, c) => sum + c.meals.completed, 0),
    totalMeals: CLIENTS.reduce((sum, c) => sum + c.meals.total, 0),
    activeClients: CLIENTS.filter(c => c.status === 'active').length,
    avgStreak: Math.round(CLIENTS.reduce((sum, c) => sum + c.streak, 0) / CLIENTS.length),
  };

  const recentNotifs = NOTIFICATIONS.slice(0, 4);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border.subtle }]}>
        <View style={styles.headerLeft}>
          <Text style={[typography.label, { color: theme.accent.primary }]}>GOOD MORNING</Text>
          <Text style={[typography.h1, { color: theme.text.primary }]}>{user.name.split(' ')[0]} 👋</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.bg.elevated }]}>
            <View>
              <Text style={{ fontSize: 18 }}>🔔</Text>
              {unreadNotifs > 0 && (
                <View style={[styles.notifBadge, { backgroundColor: theme.accent.tertiary }]}>
                  <Text style={styles.notifBadgeText}>{unreadNotifs}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={[styles.iconBtn, { backgroundColor: theme.bg.elevated }]}>
            <Avatar name={user.name} size={36} color={theme.accent.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <LinearGradient
          colors={['#00F5A0', '#00C47D']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>TODAY&apos;S OVERVIEW</Text>
            <Text style={styles.heroValue}>{todayStats.mealsCompleted}/{todayStats.totalMeals}</Text>
            <Text style={styles.heroSub}>Meals completed across all clients</Text>
          </View>
          <View style={styles.heroRight}>
            <View style={styles.heroPill}>
              <Text style={{ color: '#000', fontWeight: '700', fontSize: 13 }}>
                {Math.round((todayStats.mealsCompleted / todayStats.totalMeals) * 100)}% compliance
              </Text>
            </View>
            <Text style={{ fontSize: 48, marginTop: 4 }}>🥗</Text>
          </View>
        </LinearGradient>

        <View style={styles.padded}>
          {/* Stat Cards Row */}
          <View style={styles.statsRow}>
            <StatCard
              label="ACTIVE CLIENTS"
              value={todayStats.activeClients}
              icon="👥"
              color={theme.accent.primary}
              subtitle="+2 this week"
              style={{ marginRight: 8 }}
            />
            <StatCard
              label="AVG STREAK"
              value={`${todayStats.avgStreak}d`}
              icon="🔥"
              color={theme.accent.tertiary}
              subtitle="Team average"
            />
          </View>

          <View style={[styles.statsRow, { marginTop: 8 }]}>
            <StatCard
              label="COMPLIANCE"
              value={`${ANALYTICS_DATA.avgCompliance}%`}
              icon="✅"
              color={theme.status.success}
              subtitle="This month"
              style={{ marginRight: 8 }}
            />
            <StatCard
              label="REVENUE"
              value={`$${ANALYTICS_DATA.revenue}`}
              icon="💰"
              color={theme.accent.gold}
              subtitle="This month"
            />
          </View>

          {/* Notifications Feed */}
          <SectionHeader title="Recent Alerts" action="See all" />
          <View style={styles.notifList}>
            {recentNotifs.map(notif => (
              <Card key={notif.id} style={[
                styles.notifCard,
                !notif.read && { borderColor: theme.accent.primary + '40', borderLeftWidth: 3, borderLeftColor: theme.accent.primary }
              ]}>
                <View style={styles.notifRow}>
                  <View style={[styles.notifIcon, { backgroundColor: theme.bg.elevated }]}>
                    <Text style={{ fontSize: 18 }}>{notif.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[{ color: theme.text.primary, fontWeight: '600', fontSize: 14 }]}>
                      {notif.client}
                    </Text>
                    <Text style={[{ color: theme.text.secondary, fontSize: 13, marginTop: 2 }]}>
                      {notif.message}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[{ color: theme.text.muted, fontSize: 11 }]}>{notif.time}</Text>
                    {!notif.read && (
                      <View style={[styles.unreadDot, { backgroundColor: theme.accent.primary }]} />
                    )}
                  </View>
                </View>
              </Card>
            ))}
          </View>

          {/* Client Quick View */}
          <SectionHeader title="Client Activity" action="View all" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clientScroll}>
            {CLIENTS.map(client => (
              <Card key={client.id} style={styles.clientCard} onPress={() => {}}>
                <View style={styles.clientCardHeader}>
                  <Avatar name={client.name} size={44} color={client.status === 'active' ? theme.accent.primary : theme.text.muted} />
                  <View style={[styles.statusDot, { backgroundColor: client.status === 'active' ? theme.status.success : theme.text.muted }]} />
                </View>
                <Text style={[{ color: theme.text.primary, fontWeight: '700', fontSize: 14, marginTop: 8 }]} numberOfLines={1}>
                  {client.name.split(' ')[0]}
                </Text>
                <Text style={[{ color: theme.text.muted, fontSize: 11, marginTop: 2 }]}>{client.goal}</Text>

                {/* Meal progress bar */}
                <View style={styles.mealProgressBar}>
                  <View style={[styles.mealProgressFill, {
                    backgroundColor: theme.accent.primary,
                    width: `${(client.meals.completed / client.meals.total) * 100}%`
                  }]} />
                </View>
                <Text style={[{ color: theme.text.secondary, fontSize: 11, marginTop: 4 }]}>
                  {client.meals.completed}/{client.meals.total} meals
                </Text>
                {client.streak > 0 && (
                  <Badge label={`🔥 ${client.streak}d`} color={theme.accent.tertiary} size="sm" />
                )}
              </Card>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 1 },
  headerLeft: {},
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  notifBadge: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  heroBanner: { margin: 20, borderRadius: 20, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroContent: {},
  heroLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: '#00000080' },
  heroValue: { fontSize: 48, fontWeight: '800', color: '#000', letterSpacing: -2, lineHeight: 56 },
  heroSub: { color: '#00000070', fontSize: 13, marginTop: 2 },
  heroRight: { alignItems: 'center' },
  heroPill: { backgroundColor: '#00000020', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  padded: { paddingHorizontal: 20 },
  statsRow: { flexDirection: 'row' },
  notifList: { marginBottom: 24 },
  notifCard: { padding: 14 },
  notifRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  clientScroll: { marginHorizontal: -20, paddingHorizontal: 20, marginBottom: 24 },
  clientCard: { width: 130, marginRight: 12, padding: 14 },
  clientCardHeader: { position: 'relative' },
  statusDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#13131F' },
  mealProgressBar: { height: 4, backgroundColor: '#2A2A40', borderRadius: 2, overflow: 'hidden', marginTop: 10 },
  mealProgressFill: { height: '100%', borderRadius: 2 },
});