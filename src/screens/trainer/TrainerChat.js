import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, ScreenHeader, Avatar } from '../../components/ui';
import { useConversations, subscribeConversationMessages, sendChatMessage } from '../../services/realtime';

export default function TrainerChat() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const scrollViewRef = useRef();
  
  // Fetch active conversations for this trainer
  const { data: conversations } = useConversations(user?.id);
  const current = conversations[0]; // Logic for first active client
  
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!current?.id) return;
    const unsub = subscribeConversationMessages(current.id, (newMessages) => {
      setMessages(newMessages);
      // Auto-scroll to bottom on new message
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return unsub;
  }, [current?.id]);

  const handleSend = async () => {
    if (!text.trim() || !current?.id) return;
    const messageContent = text;
    setText(''); // Clear input immediately for UX
    
    await sendChatMessage({ 
      conversationId: current.id, 
      senderId: user.id, 
      text: messageContent 
    });
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.bg.primary }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScreenHeader 
        title={current?.clientName || "Chat"} 
        subtitle={current?.isOnline ? "● Online" : "Last seen recently"} 
      />

      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => {
          const isMe = m.senderId === user.id;
          return (
            <View key={m.id} style={[styles.messageWrapper, isMe ? styles.myMessage : styles.theirMessage]}>
              {!isMe && <Avatar name={current?.clientName} size={28} style={styles.chatAvatar} />}
              <Card style={[
                styles.bubble, 
                isMe ? { backgroundColor: theme.accent.primary } : { backgroundColor: theme.bg.elevated }
              ]}>
                <Text style={{ color: isMe ? '#000' : theme.text.primary, fontSize: 15 }}>
                  {m.text}
                </Text>
              </Card>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.inputRow, { borderTopColor: theme.border.subtle, backgroundColor: theme.bg.primary }]}>
        <TextInput 
          value={text} 
          onChangeText={setText} 
          placeholder="Type a message..." 
          placeholderTextColor={theme.text.muted}
          multiline
          style={[styles.input, { color: theme.text.primary, borderColor: theme.border.default, backgroundColor: theme.bg.input }]} 
        />
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: text.trim() ? theme.accent.primary : theme.bg.elevated }]} 
          onPress={handleSend}
          disabled={!text.trim()}
        >
          <Text style={{ fontWeight: '700', color: text.trim() ? '#000' : theme.text.muted }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  messageWrapper: { flexDirection: 'row', marginBottom: 12, maxWidth: '80%' },
  myMessage: { alignSelf: 'flex-end' },
  theirMessage: { alignSelf: 'flex-start' },
  chatAvatar: { marginRight: 8, alignSelf: 'flex-end' },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  inputRow: { flexDirection: 'row', padding: 16, gap: 10, borderTopWidth: 1, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, maxHeight: 100 },
  sendButton: { borderRadius: 20, paddingVertical: 10, paddingHorizontal: 18, justifyContent: 'center' },
});