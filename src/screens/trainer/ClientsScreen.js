import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { Card, Avatar, Badge, Button, ScreenHeader } from '../../components/ui';
import { CLIENTS } from '../../data/mockData';
import { spacing, typography, radius } from '../../theme/colors';

export default function ClientsScreen() {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filters = ['all', 'active', 'inactive'];
  const filtered = CLIENTS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const getProgressColor = (progress) => {
    if (progress >= 70) return '#00F5A0';
    if (progress >= 40) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader title="My Clients" subtitle={`${CLIENTS.length} TOTAL`} rightIcon="➕" />

      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={[styles.searchBar, { backgroundColor: theme.bg.input, borderColor: theme.border.default }]}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search clients..."
            placeholderTextColor={theme.text.muted}
            style={[typography.body, { color: theme.text.primary, flex: 1 }]}
          />
        </View>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterTab,
              { borderColor: filter === f ? theme.accent.primary : 'transparent' },
              filter === f && { backgroundColor: theme.accent.primary + '15' }
            ]}
          >
            <Text style={[{ fontWeight: '600', fontSize: 13, textTransform: 'capitalize' }, { color: filter === f ? theme.accent.primary : theme.text.muted }]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: client }) => (
          <Card style={styles.clientCard}>
            <View style={styles.clientTop}>
              <View style={styles.clientLeft}>
                <View style={{ position: 'relative' }}>
                  <Avatar name={client.name} size={52} color={client.status === 'active' ? theme.accent.primary : theme.text.muted} />
                  <View style={[
                    styles.onlineDot,
                    { backgroundColor: client.status === 'active' ? theme.status.success : theme.text.muted }
                  ]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.h4, { color: theme.text.primary }]}>{client.name}</Text>
                  <Text style={[typography.caption, { color: theme.text.secondary, marginTop: 2 }]}>{client.goal} • {client.plan}</Text>
                  <Text style={[typography.caption, { color: theme.text.muted, marginTop: 2 }]}>Active {client.lastActive}</Text>
                </View>
              </View>
              {client.streak > 0 && (
                <Badge label={`🔥 ${client.streak}d streak`} color="#FF6B35" />
              )}
            </View>

            {/* Progress */}
            <View style={styles.progressSection}>
              <View style={styles.progressLabelRow}>
                <Text style={[typography.caption, { color: theme.text.secondary }]}>Overall Progress</Text>
                <Text style={[typography.caption, { color: getProgressColor(client.progress), fontWeight: '700' }]}>
                  {client.progress}%
                </Text>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: theme.bg.elevated }]}>
                <LinearGradient
                  colors={client.progress >= 70 ? ['#00F5A0', '#00C47D'] : client.progress >= 40 ? ['#F59E0B', '#D97706'] : ['#EF4444', '#DC2626']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${client.progress}%` }]}
                />
              </View>
            </View>

            {/* Meal Status */}
            <View style={styles.mealsRow}>
              <View style={[styles.mealChip, { backgroundColor: theme.bg.elevated }]}>
                <Text style={{ fontSize: 14 }}>🍽️</Text>
                <Text style={[{ color: theme.text.secondary, fontSize: 12, fontWeight: '500', marginLeft: 4 }]}>
                  {client.meals.completed}/{client.meals.total} meals today
                </Text>
              </View>
              <View style={styles.actionBtns}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.accent.primary + '20' }]}>
                  <Text style={{ fontSize: 14 }}>📋</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.accent.secondary + '20' }]}>
                  <Text style={{ fontSize: 14 }}>💬</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.accent.purple + '20' }]}>
                  <Text style={{ fontSize: 14 }}>📊</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchWrapper: { paddingHorizontal: 20, marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, height: 48 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  filterTab: { borderRadius: 20, borderWidth: 1.5, paddingHorizontal: 16, paddingVertical: 6 },
  list: { paddingHorizontal: 20, paddingBottom: 32, gap: 12 },
  clientCard: { padding: 16 },
  clientTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  clientLeft: { flexDirection: 'row', gap: 12, flex: 1, marginRight: 8 },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 13, height: 13, borderRadius: 7, borderWidth: 2, borderColor: '#13131F' },
  progressSection: { marginBottom: 12 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  mealsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealChip: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  actionBtns: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
