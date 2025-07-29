import React, { useEffect, useRef, useState } from "react";
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from "react-native";
import Message from "./Message";
import { useChatStore } from "../store/chatStore";

const MessageList = () => {
  const messages = useChatStore((state) => state.messages);
  const participantsByUuid = useChatStore((state) => state.participantsByUuid);
  const loadingOlderMessages = useChatStore((state) => state.loadingOlderMessages);
  const hasMoreOlderMessages = useChatStore((state) => state.hasMoreOlderMessages);
  const scrollViewRef = useRef(null);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  useEffect(() => {
    if (scrollViewRef.current && !initialScrollDone) {
      scrollViewRef.current.scrollToEnd({ animated: false });
      setInitialScrollDone(true);
    }
  }, [messages, initialScrollDone]);

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    setContentHeight(contentSize.height);
    setScrollViewHeight(layoutMeasurement.height);

    if (contentOffset.y < 100 && !loadingOlderMessages && hasMoreOlderMessages) { // 100px from top
      const oldestMessage = messages[0];
      if (oldestMessage) {
        useChatStore.getState().actions.fetchOlderMessages(oldestMessage.uuid);
      }
    }
  };

  const messageElements = [];
  let lastDate = null;

  if (!messages) {
    return null; // Or a loading indicator if appropriate
  }

  messages.forEach((message, index) => {
    const messageDate = new Date(message.sentAt).toLocaleDateString();
    if (messageDate !== lastDate) {
      messageElements.push(
        <View key={messageDate} style={styles.dateSeparator}>
          <Text style={styles.dateText}>{messageDate}</Text>
        </View>
      );
      lastDate = messageDate;
    }

    const participant = participantsByUuid[message.authorUuid];
    const prevMessage = messages[index - 1];
    const nextMessage = messages[index + 1];

    const isFirst = !prevMessage || prevMessage.authorUuid !== message.authorUuid;
    const isLast = !nextMessage || nextMessage.authorUuid !== message.authorUuid;

    let groupPosition = null;
    if (isFirst && isLast) {
      groupPosition = 'single';
    } else if (isFirst) {
      groupPosition = 'start';
    } else if (isLast) {
      groupPosition = 'end';
    } else {
      groupPosition = 'middle';
    }

    messageElements.push(
      <Message
        key={message.uuid}
        message={message}
        participant={participant}
        showHeader={isFirst}
        groupPosition={groupPosition}
      />
    );
  });

  

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {loadingOlderMessages && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#800080" />
        </View>
      )}
      {messageElements}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  contentContainer: {
    justifyContent: "flex-end",
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#333',
    overflow: 'hidden',
  },
  loadingContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
});

export default React.memo(MessageList);
