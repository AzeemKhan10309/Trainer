import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { Card, Avatar, ScreenHeader } from '../../components/ui';
import { MESSAGES } from '../../data/mockData';
import { spacing, typography, radius } from '../../theme/colors';

export default function TrainerChat() {
  const { theme } = useTheme();
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState(MESSAGES);

  const sendMessage = () => {
    if (!message.trim() || !selectedConvo) return;
    const newMsg = { id: Date.now(), sender: 'trainer', text: message.trim(), time: 'Just now' };
    setConversations(prev => prev.map(c =>
      c.id === selectedConvo.id
        ? { ...c, conversation: [...c.conversation, newMsg], lastMessage: message.trim(), unread: 0 }
        : c
    ));
    setSelectedConvo(prev => ({ ...prev, conversation: [...prev.conversation, newMsg] }));
    setMessage('');
  };

  if (selectedConvo) {
    return (
      <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.bg.primary }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Chat Header */}
        <View style={[styles.chatHeader, { borderBottomColor: theme.border.subtle }]}>
          <TouchableOpacity onPress={() => setSelectedConvo(null)} style={{ marginRight: 12 }}>
            <Text style={{ fontSize: 24, color: theme.text.primary }}>←</Text>
          </TouchableOpacity>
          <Avatar name={selectedConvo.clientName} size={40} color={theme.accent.primary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[typography.h4, { color: theme.text.primary }]}>{selectedConvo.clientName}</Text>
            <Text style={[typography.caption, { color: theme.status.success }]}>● Online</Text>
          </View>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: theme.bg.elevated }]}>
            <Text style={{ fontSize: 16 }}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: theme.bg.elevated, marginLeft: 8 }]}>
            <Text style={{ fontSize: 16 }}>📋</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          data={selectedConvo.conversation}
          keyExtractor={m => String(m.id)}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: msg }) => {
            const isTrainer = msg.sender === 'trainer';
            return (
              <View style={[styles.messageRow, isTrainer && styles.messageRowRight]}>
                {!isTrainer && (
                  <Avatar name={selectedConvo.clientName} size={32} color={theme.accent.primary} />
                )}
                <View style={[
                  styles.messageBubble,
                  isTrainer
                    ? { backgroundColor: theme.accent.primary, borderBottomRightRadius: 4 }
                    : { backgroundColor: theme.bg.card, borderBottomLeftRadius: 4, borderColor: theme.border.subtle, borderWidth: 1 }
                ]}>
                  <Text style={[{ fontSize: 14, lineHeight: 20 }, { color: isTrainer ? '#000' : theme.text.primary }]}>
                    {msg.text}
                  </Text>
                  <Text style={[{ fontSize: 10, marginTop: 4 }, { color: isTrainer ? '#00000060' : theme.text.muted }]}>
                    {msg.time}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* Input Bar */}
        <View style={[styles.inputBar, { backgroundColor: theme.bg.secondary, borderTopColor: theme.border.subtle }]}>
          <TouchableOpacity style={[styles.attachBtn, { backgroundColor: theme.bg.elevated }]}>
            <Text style={{ fontSize: 18 }}>📎</Text>
          </TouchableOpacity>
          <View style={[styles.messageInput, { backgroundColor: theme.bg.input, borderColor: theme.border.default }]}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor={theme.text.muted}
              style={[{ color: theme.text.primary, fontSize: 14, flex: 1 }]}
              multiline
            />
          </View>
          <TouchableOpacity onPress={sendMessage} disabled={!message.trim()}>
            <LinearGradient
              colors={message.trim() ? ['#00F5A0', '#00C47D'] : [theme.bg.elevated, theme.bg.elevated]}
              style={styles.sendBtn}
            >
              <Text style={{ fontSize: 18 }}>➤</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader title="Messages" subtitle="CHAT" />

      {/* Quick Actions */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActions} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
        {['Send meal plan 📋', 'Great job! 🎉', 'Check your macros 🧮', 'Training at 6PM? ⏰'].map(action => (
          <TouchableOpacity key={action} style={[styles.quickChip, { backgroundColor: theme.bg.elevated, borderColor: theme.border.default }]}>
            <Text style={[{ color: theme.text.secondary, fontSize: 13 }]}>{action}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Conversations */}
      <FlatList
        data={conversations}
        keyExtractor={c => c.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 10 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: convo }) => (
          <Card onPress={() => setSelectedConvo(convo)} style={styles.convoCard}>
            <View style={styles.convoRow}>
              <View style={{ position: 'relative' }}>
                <Avatar name={convo.clientName} size={50} color={theme.accent.primary} />
                <View style={[styles.onlineDot, { backgroundColor: theme.status.success }]} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.convoHeader}>
                  <Text style={[typography.h4, { color: theme.text.primary }]}>{convo.clientName}</Text>
                  <Text style={[typography.caption, { color: theme.text.muted }]}>{convo.time}</Text>
                </View>
                <Text style={[typography.body, { color: convo.unread > 0 ? theme.text.primary : theme.text.muted, marginTop: 2 }]} numberOfLines={1}>
                  {convo.lastMessage}
                </Text>
              </View>
              {convo.unread > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: theme.accent.primary }]}>
                  <Text style={styles.unreadText}>{convo.unread}</Text>
                </View>
              )}
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1 },
  headerBtn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  messageRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  messageRowRight: { flexDirection: 'row-reverse' },
  messageBubble: { maxWidth: '75%', borderRadius: 16, padding: 12 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, borderTopWidth: 1, gap: 8 },
  attachBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  messageInput: { flex: 1, borderRadius: 21, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  quickActions: { marginBottom: 12 },
  quickChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8 },
  convoCard: { padding: 14 },
  convoRow: { flexDirection: 'row', alignItems: 'center' },
  convoHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 13, height: 13, borderRadius: 7, borderWidth: 2, borderColor: '#13131F' },
  unreadBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  unreadText: { color: '#000', fontSize: 11, fontWeight: '800' },
});
