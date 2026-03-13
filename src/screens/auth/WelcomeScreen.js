import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui';
import { typography, spacing } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      {/* Background glow orbs */}
      <View style={[styles.orb1, { backgroundColor: '#00F5A0' }]} />
      <View style={[styles.orb2, { backgroundColor: '#8B5CF6' }]} />
      <View style={[styles.orb3, { backgroundColor: '#00D9F5' }]} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={['#00F5A0', '#00C47D']}
            style={styles.logoGradient}
          >
            <Text style={styles.logoIcon}>⚡</Text>
          </LinearGradient>
          <Text style={[styles.logoText, { color: theme.text.primary }]}>FitPro</Text>
          <Text style={[styles.logoTag, { color: theme.accent.primary }]}>TRAINER</Text>
        </Animated.View>

        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={[styles.headline, { color: theme.text.primary }]}>
            Train Smarter,{'\n'}Achieve More
          </Text>
          <Text style={[styles.subheadline, { color: theme.text.secondary }]}>
            The complete platform for fitness trainers and their clients. Track meals, assign plans, and monitor progress in real-time.
          </Text>
        </View>

        {/* Feature pills */}
        <View style={styles.pillsRow}>
          {['🍎 Meal Tracking', '💪 Workouts', '📊 Analytics', '💬 Chat'].map(pill => (
            <View key={pill} style={[styles.pill, { backgroundColor: theme.bg.elevated, borderColor: theme.border.default }]}>
              <Text style={[styles.pillText, { color: theme.text.secondary }]}>{pill}</Text>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('RoleSelect')}
            size="lg"
            style={{ width: '100%', marginBottom: spacing.md }}
          />
          <Button
            title="Sign In"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
            size="lg"
            style={{ width: '100%' }}
          />
        </View>

        <Text style={[styles.legal, { color: theme.text.muted }]}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  orb1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, top: -80, right: -100, opacity: 0.08, filter: 'blur(60px)' },
  orb2: { position: 'absolute', width: 250, height: 250, borderRadius: 125, top: height * 0.3, left: -100, opacity: 0.06, filter: 'blur(60px)' },
  orb3: { position: 'absolute', width: 200, height: 200, borderRadius: 100, bottom: 100, right: -50, opacity: 0.07, filter: 'blur(60px)' },
  content: { flex: 1, paddingHorizontal: 32, paddingTop: 80, paddingBottom: 40, justifyContent: 'space-between' },
  logoContainer: { alignItems: 'center', flexDirection: 'row', gap: 12, marginBottom: 8 },
  logoGradient: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  logoIcon: { fontSize: 26 },
  logoText: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  logoTag: { fontSize: 12, fontWeight: '700', letterSpacing: 3, alignSelf: 'flex-end', marginBottom: 6 },
  taglineContainer: { flex: 1, justifyContent: 'center' },
  headline: { fontSize: 44, fontWeight: '800', letterSpacing: -2, lineHeight: 52, marginBottom: 16 },
  subheadline: { fontSize: 16, lineHeight: 26, opacity: 0.85 },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 24 },
  pill: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  pillText: { fontSize: 12, fontWeight: '500' },
  buttons: { gap: 0 },
  legal: { textAlign: 'center', fontSize: 11, marginTop: 16 },
});
