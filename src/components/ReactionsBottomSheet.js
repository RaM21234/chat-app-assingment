import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useChatStore } from "../store/chatStore";

const ReactionsBottomSheet = ({ visible, onClose, reactions }) => {
  const participantsByUuid = useChatStore((state) => state.participantsByUuid);

  const ReactionRow = ({ item }) => {
    const participant = participantsByUuid[item.participantUuid];
    const [avatarSource, setAvatarSource] = useState({ uri: participant?.avatarUrl });

    useEffect(() => {
      setAvatarSource({ uri: participant?.avatarUrl });
    }, [participant?.avatarUrl]);

    const onImageError = () => {
      setAvatarSource(participant.fallbackImage);
    };

    return (
      <View style={styles.reactionRow}>
        <Image
          source={avatarSource}
          style={styles.avatar}
          onError={onImageError}
        />
        <Text style={styles.participantName}>
          {participant?.name || "Unknown User"}
        </Text>
        <Text style={styles.reactionEmoji}>{item.value}</Text>
      </View>
    );
  };

  const renderReaction = ({ item }) => <ReactionRow item={item} />;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={styles.sheetContainer}>
          <SafeAreaView>
            <Text style={styles.title}>Reactions</Text>
            <FlatList
              data={reactions}
              renderItem={renderReaction}
              keyExtractor={(item) => item.uuid}
              contentContainerStyle={styles.listContent}
            />
          </SafeAreaView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "50%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  reactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  participantName: {
    flex: 1,
    fontSize: 16,
  },
  reactionEmoji: {
    fontSize: 24,
  },
});

export default React.memo(ReactionsBottomSheet);
