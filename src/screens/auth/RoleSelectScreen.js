/* eslint-disable react/prop-types */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui';
import { radius } from '../../theme/colors';

export default function RoleSelectScreen({ navigation }) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(null);

  const roles = [
    {
      id: 'trainer',
      icon: '🏋️',
      title: "I'm a Trainer",
      description:
        'Manage clients, assign diet & workout plans, track progress, and get real-time notifications.',
      features: [
        'Manage multiple clients',
        'Create custom plans',
        'Real-time notifications',
        'Analytics dashboard',
      ],
      gradient: ['#00F5A0', '#00C47D'],
      glow: '#00F5A0',
    },
    {
      id: 'client',
      icon: '💪',
      title: "I'm a Client",
      description:
        "Follow your trainer's plan, track meals, log workouts, and see your transformation.",
      features: [
        'View your meal plan',
        'Track workouts',
        'Monitor progress',
        'Chat with trainer',
      ],
      gradient: ['#8B5CF6', '#6D28D9'],
      glow: '#8B5CF6',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24, color: theme.text.primary }}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text.primary }]}>
          Choose Your Role
        </Text>

        <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
          {"Select how you'll be using FitPro Trainer"}
        </Text>
      </View>

      <View style={styles.cards}>
        {roles.map(role => {
          const isSelected = selected === role.id;

          return (
            <TouchableOpacity
              key={role.id}
              onPress={() => setSelected(role.id)}
              activeOpacity={0.9}
            >
              <View
                style={[
                  styles.roleCard,
                  {
                    backgroundColor: theme.bg.card,
                    borderColor: isSelected
                      ? role.glow
                      : theme.border.subtle,
                  },
                  isSelected && {
                    borderWidth: 2,
                    shadowColor: role.glow,
                    shadowOpacity: 0.4,
                    shadowRadius: 20,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: 10,
                  },
                ]}
              >
                <View style={styles.roleCardTop}>
                  <LinearGradient
                    colors={role.gradient}
                    style={styles.roleIcon}
                  >
                    <Text style={{ fontSize: 32 }}>{role.icon}</Text>
                  </LinearGradient>

                  {isSelected && (
                    <LinearGradient
                      colors={role.gradient}
                      style={styles.checkmark}
                    >
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 14,
                          fontWeight: '800',
                        }}
                      >
                        ✓
                      </Text>
                    </LinearGradient>
                  )}
                </View>

                <Text
                  style={[styles.roleTitle, { color: theme.text.primary }]}
                >
                  {role.title}
                </Text>

                <Text
                  style={[styles.roleDesc, { color: theme.text.secondary }]}
                >
                  {role.description}
                </Text>

                <View style={styles.featuresList}>
                  {role.features.map(f => (
                    <View key={f} style={styles.featureItem}>
                      <Text
                        style={{
                          color: role.glow,
                          fontSize: 14,
                          marginRight: 8,
                        }}
                      >
                        ✦
                      </Text>

                      <Text
                        style={[
                          styles.featureText,
                          { color: theme.text.secondary },
                        ]}
                      >
                        {f}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Button
          title={
            selected
              ? `Continue as ${selected === 'trainer' ? 'Trainer' : 'Client'}`
              : 'Select a role'
          }
          onPress={() =>
            selected && navigation.navigate('SignUp', { role: selected })
          }
          size="lg"
          style={{ width: '100%', opacity: selected ? 1 : 0.4 }}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{ marginTop: 16, alignItems: 'center' }}
        >
          <Text style={{ color: theme.text.secondary, fontSize: 14 }}>
            Already have an account?{' '}
            <Text
              style={{
                color: theme.accent.primary,
                fontWeight: '600',
              }}
            >
              Sign In
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    paddingTop: 60,
    paddingBottom: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1,
    marginTop: 16,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },

  cards: {
    flex: 1,
  },

  roleCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },

  roleCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  roleIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  roleTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 6,
  },

  roleDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },

  featuresList: {
    marginTop: 4,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  featureText: {
    fontSize: 13,
  },

  footer: {
    paddingVertical: 24,
  },
});