import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { typography, spacing, radius, shadows } from '../theme/colors';

Dimensions.get('window');

// ─── Button ──────────────────────────────────────────────
export function Button({ title, onPress, variant = 'primary', size = 'md', loading, icon, style }) {
  const { theme } = useTheme();
  const sizes = {
    sm: { height: 40, px: 16, fontSize: 13 },
    md: { height: 52, px: 24, fontSize: 15 },
    lg: { height: 60, px: 32, fontSize: 17 },
  };
  const s = sizes[size];

  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={loading} style={style} activeOpacity={0.85}>
        <LinearGradient
          colors={['#00F5A0', '#00C47D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.btn, { height: s.height, paddingHorizontal: s.px, borderRadius: radius.full }]}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              {icon && <Text style={{ marginRight: 8 }}>{icon}</Text>}
              <Text style={[styles.btnTextPrimary, { fontSize: s.fontSize }]}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={loading}
        activeOpacity={0.75}
        style={[
          styles.btn,
          {
            height: s.height,
            paddingHorizontal: s.px,
            borderRadius: radius.full,
            borderWidth: 1.5,
            borderColor: theme.accent.primary,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={theme.accent.primary} />
        ) : (
          <Text style={[styles.btnTextOutline, { fontSize: s.fontSize, color: theme.accent.primary }]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'ghost') {
    return (
      <TouchableOpacity onPress={onPress} disabled={loading} style={style} activeOpacity={0.7}>
        <View style={[styles.btn, { height: s.height, paddingHorizontal: s.px }]}>
          <Text style={{ fontSize: s.fontSize, color: theme.text.secondary, fontWeight: '500' }}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'danger') {
    return (
      <TouchableOpacity onPress={onPress} disabled={loading} style={style} activeOpacity={0.85}>
        <LinearGradient
          colors={['#EF4444', '#DC2626']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.btn, { height: s.height, paddingHorizontal: s.px, borderRadius: radius.full }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.btnTextPrimary, { fontSize: s.fontSize, color: '#fff' }]}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  icon: PropTypes.node,
  style: PropTypes.any,
};

// ─── Card ──────────────────────────────────────────────────
export function Card({ children, style, onPress, gradient, glowColor }) {
  const { theme } = useTheme();
  const content = gradient ? (
    <LinearGradient colors={gradient} style={[styles.card, { backgroundColor: 'transparent' }, style]}>
      {children}
    </LinearGradient>
  ) : (
    <View style={[styles.card, { backgroundColor: theme.bg.card, borderColor: theme.border.subtle }, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={glowColor ? shadows.glow(glowColor) : {}}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.any,
  onPress: PropTypes.func,
  gradient: PropTypes.array,
  glowColor: PropTypes.string,
};

// ─── Input ──────────────────────────────────────────────────
export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  multiline,
  icon,
  error,
}) {
  const { theme } = useTheme();
  return (
    <View style={styles.inputWrapper}>
      {label && <Text style={[styles.inputLabel, { color: theme.text.secondary }]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.bg.input, borderColor: error ? theme.status.error : theme.border.default },
        ]}
      >
        {icon && <Text style={styles.inputIcon}>{icon}</Text>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.text.muted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          style={[styles.input, { color: theme.text.primary, flex: 1 }]}
        />
      </View>
      {error && <Text style={[styles.errorText, { color: theme.status.error }]}>{error}</Text>}
    </View>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  multiline: PropTypes.bool,
  icon: PropTypes.node,
  error: PropTypes.string,
};

// ─── Avatar ──────────────────────────────────────────────────
export function Avatar({ name, size = 44, color = '#00F5A0' }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';
  return (
    <View
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '22', borderColor: color }]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.35, color }]}>{initials}</Text>
    </View>
  );
}

Avatar.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};

// ─── Badge ──────────────────────────────────────────────────
export function Badge({ label, color = '#00F5A0', size = 'sm' }) {
  const sz = size === 'sm' ? { px: 8, py: 3, fs: 10 } : { px: 12, py: 5, fs: 12 };
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', paddingHorizontal: sz.px, paddingVertical: sz.py }]}>
      <Text style={[styles.badgeText, { color, fontSize: sz.fs }]}>{label}</Text>
    </View>
  );
}

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
};
// ─── StatCard ──────────────────────────────────────────────────
export function StatCard({ label, value, icon, color = '#00F5A0', subtitle, style }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.statCard, { backgroundColor: theme.bg.card, borderColor: theme.border.subtle, flex: 1 }, style]}>
      <View style={styles.statCardTop}>
        <Text style={{ fontSize: 22 }}>{icon}</Text>
        <View style={[styles.statColorDot, { backgroundColor: color + '22' }]}>
          <View style={[styles.statColorDotInner, { backgroundColor: color }]} />
        </View>
      </View>
      <Text style={[styles.statValue, { color: theme.text.primary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: color }]}>{label}</Text>
      {subtitle && <Text style={[styles.statSubtitle, { color: theme.text.muted }]}>{subtitle}</Text>}
    </View>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  color: PropTypes.string,
  subtitle: PropTypes.string,
  style: PropTypes.any,
};

// ─── SectionHeader ──────────────────────────────────────────────────
export function SectionHeader({ title, action, onAction }) {
  const { theme } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={[styles.sectionAction, { color: theme.accent.primary }]}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  action: PropTypes.string,
  onAction: PropTypes.func,
};

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnTextPrimary: { fontWeight: '700', color: '#000', letterSpacing: 0.2 },
  btnTextOutline: { fontWeight: '600' },
  card: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.base, ...shadows.sm },
  inputWrapper: { marginBottom: spacing.base },
  inputLabel: { ...typography.label, marginBottom: spacing.xs },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.md, borderWidth: 1, paddingHorizontal: spacing.md, height: 52 },
  inputIcon: { fontSize: 18, marginRight: spacing.sm },
  input: { ...typography.body, paddingVertical: spacing.sm },
  errorText: { ...typography.caption, marginTop: spacing.xs },
  avatar: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  avatarText: { fontWeight: '700' },
  badge: { borderRadius: radius.full, alignSelf: 'flex-start' },
  badgeText: { fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  statCard: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.base, ...shadows.sm },
  statCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statColorDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statColorDotInner: { width: 10, height: 10, borderRadius: 5 },
  statValue: { fontSize: 28, fontWeight: '800', letterSpacing: -1 },
  statLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginTop: 2 },
  statSubtitle: { fontSize: 11, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  sectionAction: { fontSize: 13, fontWeight: '600' },
});