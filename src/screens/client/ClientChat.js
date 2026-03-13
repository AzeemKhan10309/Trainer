import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { Avatar, ScreenHeader } from '../../components/ui';
import { MESSAGES } from '../../data/mockData';
import { typography, spacing, radius } from '../../theme/colors';

const QUICK_REPLIES = [
  'Got it! 👍', 'On my way 🏃', 'Completed! ✅', 'Question about my plan?', 'Feeling great 💪',
];

export default function ClientChat() {
  const { theme } = useTheme();
  const myConvo = MESSAGES[0]; // Client sees their own convo with trainer
  const [conversation, setConversation] = useState(myConvo.conversation);
  const [message, setMessage] = useState('');
  const listRef = useRef(null);

  const sendMessage = (text) => {
    const msg = text || message.trim();
    if (!msg) return;
    const newMsg = { id: Date.now(), sender: 'client', text: msg, time: 'Just now' };
    setConversation(prev => [...prev, newMsg]);
    setMessage('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.bg.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border.subtle }]}>
        <View style={{ position: 'relative' }}>
          <Avatar name="Marcus Chen" size={44} color={theme.accent.primary} />
          <View style={[styles.onlineDot, { backgroundColor: theme.status.success }]} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[typography.h4, { color: theme.text.primary }]}>Marcus Chen</Text>
          <Text style={[typography.caption, { color: theme.status.success }]}>● Your Trainer • Online</Text>
        </View>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.bg.elevated }]}>
          <Text style={{ fontSize: 18 }}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* Trainer Info Banner */}
      <View style={[styles.trainerBanner, { backgroundColor: theme.accent.primary + '10', borderColor: theme.accent.primary + '30' }]}>
        <Text style={{ fontSize: 16, marginRight: 8 }}>⚡</Text>
        <Text style={[typography.caption, { color: theme.accent.primary, flex: 1 }]}>
          Marcus typically replies within 2 hours. Feel free to ask anything about your plan!
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={conversation}
        keyExtractor={m => String(m.id)}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item: msg }) => {
          const isMe = msg.sender === 'client';
          return (
            <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
              {!isMe && <Avatar name="Marcus Chen" size={30} color={theme.accent.primary} />}
              <View style={[
                styles.bubble,
                isMe
                  ? { backgroundColor: theme.accent.primary, borderBottomRightRadius: 4 }
                  : { backgroundColor: theme.bg.card, borderBottomLeftRadius: 4, borderColor: theme.border.subtle, borderWidth: 1 }
              ]}>
                <Text style={[{ fontSize: 14, lineHeight: 20 }, { color: isMe ? '#000' : theme.text.primary }]}>
                  {msg.text}
                </Text>
                <Text style={[{ fontSize: 10, marginTop: 4 }, { color: isMe ? '#00000060' : theme.text.muted }]}>
                  {msg.time} {isMe ? '✓✓' : ''}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Quick Replies */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.quickReplies}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {QUICK_REPLIES.map(r => (
          <TouchableOpacity
            key={r}
            onPress={() => sendMessage(r)}
            style={[styles.quickBtn, { backgroundColor: theme.bg.elevated, borderColor: theme.border.default }]}
          >
            <Text style={[{ color: theme.text.secondary, fontSize: 13 }]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input Bar */}
      <View style={[styles.inputBar, { backgroundColor: theme.bg.secondary, borderTopColor: theme.border.subtle }]}>
        <TouchableOpacity style={[styles.attachBtn, { backgroundColor: theme.bg.elevated }]}>
          <Text style={{ fontSize: 18 }}>📎</Text>
        </TouchableOpacity>
        <View style={[styles.inputWrap, { backgroundColor: theme.bg.input, borderColor: theme.border.default }]}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Message Marcus..."
            placeholderTextColor={theme.text.muted}
            style={[{ color: theme.text.primary, fontSize: 14, flex: 1 }]}
            multiline
            onSubmitEditing={() => sendMessage()}
          />
        </View>
        <TouchableOpacity onPress={() => sendMessage()} disabled={!message.trim()}>
          <LinearGradient
            colors={message.trim() ? ['#00F5A0', '#00C47D'] : [theme.bg.elevated, theme.bg.elevated]}
            style={styles.sendBtn}
          >
            <Text style={{ fontSize: 20 }}>➤</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 14, borderBottomWidth: 1 },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#080810' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  trainerBanner: { flexDirection: 'row', alignItems: 'center', margin: 12, borderRadius: 10, borderWidth: 1, padding: 10 },
  messagesList: { paddingHorizontal: 16, paddingVertical: 8, gap: 12 },
  msgRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  msgRowMe: { flexDirection: 'row-reverse' },
  bubble: { maxWidth: '75%', borderRadius: 18, padding: 12 },
  quickReplies: { maxHeight: 52, marginBottom: 4 },
  quickBtn: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, borderTopWidth: 1, gap: 8 },
  attachBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  inputWrap: { flex: 1, borderRadius: 21, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});
