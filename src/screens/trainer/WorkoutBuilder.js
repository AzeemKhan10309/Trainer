import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Card, ScreenHeader } from '../../components/ui';
import { typography } from '../../theme/colors';

export default function WorkoutBuilder() {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader title="Workout Plans" subtitle="TRAINING" rightIcon="➕" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={[typography.h3, { color: theme.text.primary }]}>Push Pull Legs - 6 Day</Text>
          <Text style={[typography.body, { color: theme.text.secondary, marginTop: 4 }]}>Assigned to 3 clients</Text>
        </Card>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1 }, content: { padding: 20, gap: 12 } });
