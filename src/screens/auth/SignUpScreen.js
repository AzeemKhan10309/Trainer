import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/ui';

export default function SignUpScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { signup, loading } = useAuth();
  const role = route.params?.role || 'client';

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [step, setStep] = useState(1);

  const updateForm = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleNext = () => {
    if (step === 1) setStep(2);
    else handleSignUp();
  };

  const handleSignUp = async () => {
    await signup({ ...form, role });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={[styles.container, { backgroundColor: theme.bg.primary }]} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => step === 1 ? navigation.goBack() : setStep(1)}>
            <Text style={{ fontSize: 24, color: theme.text.primary }}>←</Text>
          </TouchableOpacity>
          <View style={styles.stepIndicator}>
            {[1, 2].map(s => (
              <View key={s} style={[
                styles.stepDot,
                { backgroundColor: s <= step ? theme.accent.primary : theme.border.default, width: s === step ? 24 : 8 }
              ]} />
            ))}
          </View>
          <Text style={[styles.title, { color: theme.text.primary }]}>
            {step === 1 ? 'Create Account' : 'Your Details'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            {step === 1
              ? `Joining as a ${role === 'trainer' ? 'Fitness Trainer' : 'Client'}`
              : 'Almost there! Complete your profile'
            }
          </Text>
        </View>

        {step === 1 ? (
          <View>
            <Input label="Full Name" placeholder="e.g. Ahmed Al-Hassan" value={form.name} onChangeText={v => updateForm('name', v)} icon="👤" />
            <Input label="Email Address" placeholder="your@email.com" value={form.email} onChangeText={v => updateForm('email', v)} keyboardType="email-address" icon="📧" />
            <Input label="Phone Number" placeholder="+966 xxx xxx xxxx" value={form.phone} onChangeText={v => updateForm('phone', v)} keyboardType="phone-pad" icon="📱" />
          </View>
        ) : (
          <View>
            <Input label="Password" placeholder="Min 8 characters" value={form.password} onChangeText={v => updateForm('password', v)} secureTextEntry icon="🔒" />
            <Input label="Confirm Password" placeholder="Repeat password" value={form.confirmPassword} onChangeText={v => updateForm('confirmPassword', v)} secureTextEntry icon="🔒" />

            {role === 'trainer' && (
              <View style={[styles.specialBox, { backgroundColor: theme.bg.elevated, borderColor: theme.accent.primary + '30' }]}>
                <Text style={{ fontSize: 20, marginBottom: 8 }}>🏆</Text>
                <Text style={[{ color: theme.text.primary, fontWeight: '700', marginBottom: 4 }]}>Trainer Perks</Text>
                <Text style={[{ color: theme.text.secondary, fontSize: 13, lineHeight: 20 }]}>
                  Manage up to unlimited clients, create diet & workout plans, get real-time alerts, and access advanced analytics.
                </Text>
              </View>
            )}

            {role === 'client' && (
              <View style={[styles.specialBox, { backgroundColor: theme.bg.elevated, borderColor: theme.accent.purple + '30' }]}>
                <Text style={{ fontSize: 20, marginBottom: 8 }}>🎯</Text>
                <Text style={[{ color: theme.text.primary, fontWeight: '700', marginBottom: 4 }]}>Ready to Transform?</Text>
                <Text style={[{ color: theme.text.secondary, fontSize: 13, lineHeight: 20 }]}>
                  Follow personalized meal & workout plans, track your progress, and stay connected with your trainer.
                </Text>
              </View>
            )}
          </View>
        )}

        <Button
          title={step === 1 ? 'Continue →' : 'Create Account'}
          onPress={handleNext}
          size="lg"
          loading={loading}
          style={{ width: '100%', marginTop: 8 }}
        />

        <Text style={[styles.legal, { color: theme.text.muted }]}>
          By signing up you agree to our{' '}
          <Text style={{ color: theme.accent.primary }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: theme.accent.primary }}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60 },
  header: { marginBottom: 32 },
  stepIndicator: { flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 24, marginBottom: 20 },
  stepDot: { height: 8, borderRadius: 4 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -1, marginBottom: 6 },
  subtitle: { fontSize: 15 },
  specialBox: { borderRadius: 14, borderWidth: 1, padding: 16, marginTop: 8 },
  legal: { textAlign: 'center', fontSize: 12, marginTop: 24, lineHeight: 18 },
});
