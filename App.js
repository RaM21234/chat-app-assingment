import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useChatStore } from "./src/store/chatStore";
import MessageList from "./src/components/MessageList";
import ChatInput from "./src/components/ChatInput";
import ParticipantsList from "./src/components/ParticipantsList";

function App() {
  console.log("App component rendered!");
  const loading = useChatStore((state) => state.loading);
  const error = useChatStore((state) => state.error);

  useEffect(() => {
    useChatStore.getState().actions.initialize();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>CHAT</Text>
      </View>
      <KeyboardAvoidingView
        style={styles.mainBox}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust as needed
      >
        <View style={styles.chatBox}>
          <MessageList />
          <ChatInput />
        </View>
        {/* <ParticipantsList /> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Corresponds to theme background color
  },
  header: {
    height: 60,
    backgroundColor: "#800080",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    elevation: 4, // For Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  mainBox: {
    flex: 1,
    flexDirection: "row",
    maxWidth: 900,
    marginHorizontal: "auto",
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // For Android shadow
  },
  chatBox: {
    flex: 1,
    flexDirection: "column",
  },
});

export default App;
