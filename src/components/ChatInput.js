import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useChatStore } from "../store/chatStore";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const inputRef = useRef(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      useChatStore.getState().actions.sendMessage(message);
      setMessage("");
      setShowMentions(false);
    }
  };

  const handleMessageChange = (text) => {
    setMessage(text);
    const atIndex = text.lastIndexOf("@");
    if (
      atIndex > -1 &&
      (text.length === atIndex + 1 || text.charAt(atIndex + 1) !== " ")
    ) {
      const query = text.substring(atIndex + 1);
      setMentionQuery(query);
      const allParticipants = Object.values(useChatStore.getState().participantsByUuid);
      const filtered = allParticipants.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) && p.uuid !== "you"
      );
      setFilteredParticipants(filtered);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleSelectMention = (participant) => {
    const atIndex = message.lastIndexOf("@");
    const newMessage = message.substring(0, atIndex) + `@${participant.name} `;
    setMessage(newMessage);
    setShowMentions(false);
    inputRef.current.focus();
  };

  return (
    <View style={styles.outerContainer}>
      {showMentions && filteredParticipants.length > 0 && (
        <FlatList
          data={filteredParticipants}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.mentionItem}
              onPress={() => handleSelectMention(item)}
            >
              <Text style={styles.mentionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.uuid}
          style={styles.mentionsList}
          keyboardShouldPersistTaps="always"
        />
      )}
      <View style={styles.container}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={handleMessageChange}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    // flex: 1, // Removed flex: 1
    // justifyContent: 'flex-end', // Removed justifyContent
  },
  mentionsList: {
    maxHeight: 170,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 70, // Adjusted based on typical input height + padding
    left: 0,
    right: 0,
    zIndex: 10,
  },
  mentionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  mentionText: {
    fontSize: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#800080",
    borderRadius: 20,
    padding: 8,
  },
});

export default React.memo(ChatInput);
