import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, ScreenHeader } from '../../components/ui';
import { useConversations, subscribeConversationMessages, sendChatMessage } from '../../services/realtime';

export default function ClientChat() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { data: conversations } = useConversations(user?.id);
  const current = conversations[0];
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (current?.id) {
      const unsub = subscribeConversationMessages(current.id, setMessages);
      return unsub;
    }
  }, [current?.id]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScreenHeader title="Chat" subtitle="Real-time messaging" />
      
      <ScrollView contentContainerStyle={styles.content}>
        {messages.map((m) => (
          <Card key={m.id} style={styles.card}>
            <Text style={{ color: theme.text.primary }}>{m.text}</Text>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput 
          value={text} 
          onChangeText={setText} 
          placeholder="Type message" 
          placeholderTextColor={theme.text.muted}
          style={[styles.input, { color: theme.text.primary, borderColor: theme.border.default }]} 
        />
        <TouchableOpacity 
          style={[styles.send, { backgroundColor: theme.accent.primary }]} 
          onPress={async () => { 
            if (!text.trim() || !current?.id) return; 
            await sendChatMessage({ 
              conversationId: current.id, 
              senderId: user.id, 
              text 
            }); 
            setText(''); 
          }}
        >
          <Text style={{ color: '#000', fontWeight: 'bold' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { marginBottom: 8 },
  inputRow: { flexDirection: 'row', padding: 12, gap: 8 },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10 },
  send: { borderRadius: 8, justifyContent: 'center', paddingHorizontal: 14 },
});