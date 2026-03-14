import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, ScreenHeader, Avatar, Badge } from '../../components/ui';
import { useTrainerRealtime } from '../../services/realtime';

export default function ClientsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [q, setQ] = useState('');
  
  // Connect to live trainer-client relationships
  const { clients } = useTrainerRealtime(user?.id);

  const filtered = useMemo(
    () => (clients.data || []).filter((c) => 
      `${c.name || ''} ${c.email || ''}`.toLowerCase().includes(q.toLowerCase())
    ),
    [clients.data, q],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader 
        title="My Clients" 
        subtitle={`${filtered.length} total active`} 
      />
      
      <View style={styles.searchContainer}>
        <TextInput 
          value={q} 
          onChangeText={setQ} 
          placeholder="Search by name or email..." 
          placeholderTextColor={theme.text.muted} 
          style={[styles.input, { 
            color: theme.text.primary, 
            borderColor: theme.border.default,
            backgroundColor: theme.bg.elevated 
          }]} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.map((client) => (
          <TouchableOpacity key={client.id} activeOpacity={0.7}>
            <Card style={styles.card}>
              <View style={styles.clientRow}>
                <Avatar name={client.name || client.email} size={48} />
                <View style={styles.clientInfo}>
                  <Text style={[styles.clientName, { color: theme.text.primary }]}>
                    {client.name || client.email.split('@')[0]}
                  </Text>
                  <Text style={{ color: theme.text.secondary, fontSize: 13 }}>
                    {client.goal || 'General Fitness'}
                  </Text>
                </View>
                {client.streak > 0 && (
                  <Badge label={`🔥 ${client.streak}d`} color={theme.accent.secondary} />
                )}
              </View>
              
              <View style={styles.statsOverview}>
                <Text style={[styles.statText, { color: theme.text.muted }]}>
                  Last workout: <Text style={{ color: theme.text.primary }}>Today</Text>
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={{ color: theme.text.muted }}>No clients found matching &quot;{q}&quot;</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { paddingHorizontal: 16, marginTop: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  content: { padding: 16, paddingBottom: 40 },
  card: { marginBottom: 12, padding: 16 },
  clientRow: { flexDirection: 'row', alignItems: 'center' },
  clientInfo: { flex: 1, marginLeft: 12 },
  clientName: { fontSize: 17, fontWeight: '700' },
  statsOverview: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  statText: { fontSize: 12 },
  emptyState: { alignItems: 'center', marginTop: 40 },
});