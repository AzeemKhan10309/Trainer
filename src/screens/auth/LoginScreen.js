/* eslint-disable react/prop-types */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/ui';

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('marcus@fitpro.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('trainer');

  const handleLogin = async () => {
    await login(email, password, role);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.bg.primary }]}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 24, color: theme.text.primary }}>←</Text>
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <LinearGradient colors={['#00F5A0', '#00C47D']} style={styles.logo}>
              <Text style={{ fontSize: 22 }}>⚡</Text>
            </LinearGradient>

            <Text style={[styles.appName, { color: theme.text.primary }]}>
              FitPro
            </Text>
          </View>

          <Text style={[styles.title, { color: theme.text.primary }]}>
            Welcome back
          </Text>

          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            Sign in to continue your journey
          </Text>
        </View>

        {/* Role Toggle */}
        <View
          style={[
            styles.roleToggle,
            { backgroundColor: theme.bg.elevated },
          ]}
        >
          {['trainer', 'client'].map(r => (
            <TouchableOpacity
              key={r}
              onPress={() => setRole(r)}
              style={{ flex: 1 }}
            >
              {role === r ? (
                <LinearGradient
                  colors={['#00F5A0', '#00C47D']}
                  style={styles.roleActive}
                >
                  <Text style={styles.roleActiveText}>
                    {r === 'trainer' ? '🏋️ Trainer' : '💪 Client'}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.roleInactive}>
                  <Text
                    style={[
                      styles.roleInactiveText,
                      { color: theme.text.muted },
                    ]}
                  >
                    {r === 'trainer' ? '🏋️ Trainer' : '💪 Client'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="📧"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="🔒"
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text
              style={{
                color: theme.accent.primary,
                fontSize: 13,
                fontWeight: '600',
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Sign In"
          onPress={handleLogin}
          size="lg"
          loading={loading}
          style={{ width: '100%' }}
        />

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View
            style={[
              styles.dividerLine,
              { backgroundColor: theme.border.default },
            ]}
          />
          <Text
            style={[styles.dividerText, { color: theme.text.muted }]}
          >
            or continue with
          </Text>
          <View
            style={[
              styles.dividerLine,
              { backgroundColor: theme.border.default },
            ]}
          />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialRow}>
          {[
            { icon: '🍎', label: 'Apple' },
            { icon: '🔵', label: 'Google' },
            { icon: '📱', label: 'Phone' },
          ].map(social => (
            <TouchableOpacity
              key={social.label}
              style={[
                styles.socialBtn,
                {
                  backgroundColor: theme.bg.elevated,
                  borderColor: theme.border.default,
                },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{social.icon}</Text>

              <Text
                style={{
                  color: theme.text.secondary,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {social.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('RoleSelect')}
          style={{ alignItems: 'center', marginTop: 24 }}
        >
          <Text style={{ color: theme.text.secondary, fontSize: 14 }}>
            Don&apos;t have an account?{' '}
            <Text
              style={{
                color: theme.accent.primary,
                fontWeight: '700',
              }}
            >
              Sign Up
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Demo hint */}
        <View
          style={[
            styles.demoHint,
            {
              backgroundColor: theme.accent.primary + '15',
              borderColor: theme.accent.primary + '40',
            },
          ]}
        >
          <Text
            style={{
              color: theme.accent.primary,
              fontSize: 12,
              textAlign: 'center',
            }}
          >
            💡 Demo: Toggle between Trainer/Client role above and tap Sign In
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  content: {
    padding: 24,
    paddingTop: 60,
  },

  header: {
    marginBottom: 32,
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  appName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.8,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
  },

  roleToggle: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },

  roleActive: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },

  roleActiveText: {
    fontWeight: '700',
    color: '#000',
    fontSize: 14,
  },

  roleInactive: {
    paddingVertical: 10,
    alignItems: 'center',
  },

  roleInactiveText: {
    fontWeight: '500',
    fontSize: 14,
  },

  form: {
    marginBottom: 8,
  },

  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  dividerLine: {
    flex: 1,
    height: 1,
  },

  dividerText: {
    fontSize: 12,
    fontWeight: '500',
    marginHorizontal: 12,
  },

  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },

  socialBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },

  demoHint: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
});