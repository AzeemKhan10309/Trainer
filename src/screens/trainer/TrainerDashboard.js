import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Avatar, StatCard, SectionHeader, ProgressBar } from '../../components/ui';
import { useTrainerRealtime } from '../../services/realtime';

export default function TrainerDashboard() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  
  // Real-time data stream for the entire dashboard
  const { clients, notifications, analytics } = useTrainerRealtime(user?.id);

  // Calculate compliance percentage for the header

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      {/* Dynamic Header */}
      <View style={[styles.header, { borderBottomColor: theme.border.subtle, backgroundColor: theme.bg.primary }]}> 
        <View>
          <Text style={{ color: theme.accent.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>OVERVIEW</Text>
          <Text style={[styles.title, { color: theme.text.primary }]}>Hi {user?.name?.split(' ')[0] || 'Trainer'} 👋</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Avatar name={user?.name || 'Trainer'} size={44} color={theme.accent.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Real-time Business Stats */}
        <View style={styles.row}>
          <StatCard 
            label="CLIENTS" 
            value={analytics.totalClients || 0} 
            icon="👥" 
            color={theme.accent.primary} 
            style={styles.card} 
          />
          <StatCard 
            label="ACTIVE" 
            value={analytics.activeClients || 0} 
            icon="✅" 
            color={theme.status.success} 
            style={styles.card} 
          />
        </View>

        <View style={styles.row}>
          <StatCard 
            label="MEALS" 
            value={`${analytics.mealsCompleted || 0}/${analytics.totalMeals || 0}`} 
            icon="🍽️" 
            color={theme.accent.secondary} 
            style={styles.card} 
          />
          <StatCard 
            label="REVENUE" 
            value={`$${analytics.revenue || 0}`} 
            icon="💰" 
            color={theme.accent.gold} 
            style={styles.card} 
          />
        </View>

        {/* Live Notification Feed */}
        <SectionHeader title="Recent Alerts" action="Clear" />
        {notifications.data?.length > 0 ? (
          notifications.data.slice(0, 3).map((n) => (
            <Card key={n.id} style={styles.listCard}>
              <View style={styles.notifRow}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>{n.icon || '🔔'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text.primary, fontWeight: '700' }}>{n.title}</Text>
                  <Text style={{ color: theme.text.secondary, fontSize: 13 }}>{n.body || n.message}</Text>
                </View>
                <Text style={{ color: theme.text.muted, fontSize: 10 }}>{n.time || 'Just now'}</Text>
              </View>
            </Card>
          ))
        ) : (
          <Text style={{ color: theme.text.muted, textAlign: 'center', marginVertical: 10 }}>No new alerts</Text>
        )}

        {/* Client Performance Quick-View */}
        <SectionHeader title="Top Performers" action="View All" />
        {clients.data?.slice(0, 4).map((c) => (
          <Card key={c.id} style={styles.listCard}>
            <View style={styles.clientRow}>
              <Avatar name={c.name} size={32} color={theme.accent.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: theme.text.primary, fontWeight: '600' }}>{c.name || c.email}</Text>
                <ProgressBar 
                  progress={(c.compliance || 0) / 100} 
                  color={theme.accent.primary} 
                  style={{ marginTop: 8 }} 
                />
              </View>
              <Text style={{ color: theme.text.primary, fontWeight: '700', marginLeft: 12 }}>{c.compliance || 0}%</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  content: { padding: 16, paddingBottom: 40 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  card: { flex: 1 },
  listCard: { marginBottom: 10, padding: 12 },
  notifRow: { flexDirection: 'row', alignItems: 'center' },
  clientRow: { flexDirection: 'row', alignItems: 'center' },
});