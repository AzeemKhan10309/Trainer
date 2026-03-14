import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, ScreenHeader, StatCard, ProgressBar } from '../../components/ui';
import { useTrainerRealtime } from '../../services/realtime';

Dimensions.get('window');

export default function TrainerAnalytics() {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  // Connect to live backend analytics and client stream
  const { analytics, clients } = useTrainerRealtime(user?.id);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader title="Business Analytics" subtitle="LIVE PERFORMANCE" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Key Performance Indicators */}
        <View style={styles.grid}>
          <StatCard 
            label="TOTAL CLIENTS" 
            value={analytics.totalClients || 0} 
            icon="👥" 
            color={theme.accent.primary} 
            style={styles.statCard} 
          />
          <StatCard 
            label="ACTIVE NOW" 
            value={analytics.activeClients || 0} 
            icon="⚡" 
            color={theme.status.success} 
            style={styles.statCard} 
          />
        </View>

        <View style={styles.grid}>
          <StatCard 
            label="AVG COMPLIANCE" 
            value={`${analytics.avgCompliance || 0}%`} 
            icon="🎯" 
            color={theme.accent.secondary} 
            style={styles.statCard} 
          />
          <StatCard 
            label="EST. REVENUE" 
            value={`$${analytics.revenue || 0}`} 
            icon="💰" 
            color={theme.accent.gold} 
            style={styles.statCard} 
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
          Client Adherence Ranking
        </Text>

        {/* Real-time Client Compliance List */}
        {clients.data.map((client) => (
          <Card key={client.id} style={styles.clientCard}>
            <View style={styles.clientInfo}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.clientName, { color: theme.text.primary }]}>
                  {client.name || client.email.split('@')[0]}
                </Text>
                <Text style={{ color: theme.text.muted, fontSize: 12 }}>
                  Streak: {client.streak || 0} days
                </Text>
              </View>
              <Text style={[styles.percentage, { color: theme.accent.primary }]}>
                {client.compliance || 0}%
              </Text>
            </View>
            
            <View style={styles.progressWrapper}>
              <ProgressBar 
                progress={(client.compliance || 0) / 100} 
                color={client.compliance > 80 ? theme.status.success : theme.accent.secondary} 
              />
            </View>
          </Card>
        ))}

        {clients.data.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={{ color: theme.text.muted }}>No client data available yet.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: { flex: 1 },
  sectionTitle: { 
    fontSize: 13, 
    fontWeight: '800', 
    letterSpacing: 1.2, 
    marginTop: 24, 
    marginBottom: 12, 
    textTransform: 'uppercase' 
  },
  clientCard: { padding: 16, marginBottom: 10 },
  clientInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  clientName: { fontSize: 16, fontWeight: '700' },
  percentage: { fontSize: 18, fontWeight: '800' },
  progressWrapper: { height: 6, borderRadius: 3, overflow: 'hidden' },
  emptyState: { alignItems: 'center', marginTop: 40 },
});