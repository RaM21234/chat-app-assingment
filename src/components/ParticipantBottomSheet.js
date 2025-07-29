import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";

const ParticipantBottomSheet = ({ visible, onClose, participant }) => {
  const [avatarSource, setAvatarSource] = useState({ uri: participant?.avatarUrl });

  useEffect(() => {
    setAvatarSource({ uri: participant?.avatarUrl });
  }, [participant?.avatarUrl]);

  const onImageError = () => {
    setAvatarSource(participant.fallbackImage);
  };

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
            <Image
              source={avatarSource}
              style={styles.avatar}
              onError={onImageError}
            />
            <Text style={styles.name}>Name: {participant.name}</Text>
            <Text style={styles.bio}>Bio: {participant.bio}</Text>
            <Text style={styles.jobTitle}>Job: {participant.jobTitle}</Text>
            <Text style={styles.email}>Email: {participant.email}</Text>
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
    padding: 24,
    alignItems: "flex-start",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    // textAlign: "center",
    marginBottom: 16,
  },
  email: {
    fontSize: 16,
    color: "#800080",
  },
});

export default React.memo(ParticipantBottomSheet);
