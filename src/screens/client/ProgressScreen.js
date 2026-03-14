import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, ScreenHeader } from '../../components/ui';
import { useClientRealtime } from '../../services/realtime';

export default function ProgressScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  // Real-time progress data fetch kar rahe hain
  const { progress } = useClientRealtime(user?.id);

  // Pehli aur aakhri entry nikaal kar delta (difference) calculate kar rahe hain
  const first = progress.data[0];
  const last = progress.data[progress.data.length - 1];
  const delta = first && last ? (last.weight || 0) - (first.weight || 0) : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader title="Progress" subtitle="Live Transformation Tracking" />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <Card>
          <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: 16 }}>
            Overall Weight Change
          </Text>
          <Text style={{ 
            color: delta <= 0 ? theme.accent.primary : theme.status.error, 
            fontSize: 36, 
            fontWeight: '800',
            marginVertical: 8
          }}>
            {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)} kg
          </Text>
          <View style={styles.journeyRow}>
            <View>
              <Text style={{ color: theme.text.muted, fontSize: 12 }}>START</Text>
              <Text style={{ color: theme.text.secondary, fontWeight: '600' }}>{first?.weight || '--'} kg</Text>
            </View>
            <Text style={{ color: theme.text.muted, fontSize: 20 }}>→</Text>
            <View>
              <Text style={{ color: theme.text.muted, fontSize: 12 }}>CURRENT</Text>
              <Text style={{ color: theme.accent.primary, fontWeight: '600' }}>{last?.weight || '--'} kg</Text>
            </View>
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>History Log</Text>

        {/* List of past entries */}
        {(progress.data || []).slice().reverse().map((entry) => (
          <Card key={entry.id} style={styles.row}>
            <View style={styles.entryHeader}>
              <Text style={{ color: theme.text.primary, fontWeight: '600' }}>
                {new Date(entry.createdAt?.toDate?.() || Date.now()).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </Text>
              <Text style={{ color: theme.accent.primary, fontWeight: '700' }}>
                {entry.weight} kg
              </Text>
            </View>
            <Text style={{ color: theme.text.secondary, fontSize: 13, marginTop: 4 }}>
              Daily Intake: {entry.calories || 'N/A'} kcal
            </Text>
          </Card>
        ))}

        {progress.data.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={{ color: theme.text.muted }}>No progress entries found yet.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  journeyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 12 },
  row: { marginBottom: 10, padding: 16 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  emptyState: { alignItems: 'center', marginTop: 40 },
});