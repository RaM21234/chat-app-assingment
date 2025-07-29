import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import ReactionsBottomSheet from "./ReactionsBottomSheet";
import ParticipantBottomSheet from "./ParticipantBottomSheet";
import { useChatStore } from "../store/chatStore";
import AttachmentImage from "./AttachmentImage";

const Message = ({ message, participant, showHeader, groupPosition }) => {
  const participantsByUuid = useChatStore((state) => state.participantsByUuid);
  const isYou = participant.uuid === "you";
  const hasReactions = message.reactions && message.reactions.length > 0;
  const [isReactionsSheetVisible, setReactionsSheetVisible] = useState(false);
  const [isParticipantSheetVisible, setParticipantSheetVisible] =
    useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [avatarSource, setAvatarSource] = useState({ uri: participant?.avatarUrl });

  useEffect(() => {
    setAvatarSource({ uri: participant?.avatarUrl });
  }, [participant?.avatarUrl]);

  const onImageError = () => {
    setAvatarSource(participant.fallbackImage);
  };

  return (
    <>
      <View
        style={[
          styles.messageContainer,
          isYou ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View style={styles.stackContainer}>
          <View style={styles.avatarPlaceholder}>
            {!isYou && showHeader && (
              <TouchableOpacity
                onPress={() => setParticipantSheetVisible(true)}
              >
                <Image
                  source={avatarSource}
                  style={styles.avatar}
                  onError={onImageError}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.messageContent}>
            {showHeader && (
              <TouchableOpacity
                onPress={() => setParticipantSheetVisible(true)}
              >
                <Text
                  style={[
                    styles.participantName,
                    isYou
                      ? styles.myParticipantName
                      : styles.otherParticipantName,
                  ]}
                >
                  {participant.name}
                </Text>
              </TouchableOpacity>
            )}
            <View
              style={[
                styles.messageBubble,
                isYou ? styles.myMessageBubble : styles.otherMessageBubble,
                groupPosition === "start" &&
                  (isYou ? styles.myStartBubble : styles.otherStartBubble),
                groupPosition === "middle" &&
                  (isYou ? styles.myMiddleBubble : styles.otherMiddleBubble),
                groupPosition === "end" &&
                  (isYou ? styles.myEndBubble : styles.otherEndBubble),
              ]}
            >
              {message.replyToMessage && (
                <View style={styles.quotedMessageContainer}>
                  <Text style={styles.quotedParticipantName}>
                    {participantsByUuid[message.replyToMessage.authorUuid]
                      ?.name || "Unknown User"}
                  </Text>
                  <Text style={styles.quotedMessageText} numberOfLines={1}>
                    {message.replyToMessage.text}
                  </Text>
                </View>
              )}
              <Text
                style={isYou ? styles.myMessageText : styles.otherMessageText}
              >
                {message.text.split(/(@\w+)/g).map((part, index) =>
                  part.startsWith("@") ? (
                    <Text key={index} style={styles.mentionHighlight}>
                      {part}
                    </Text>
                  ) : (
                    part
                  )
                )}
              </Text>
              {message.attachments &&
                message.attachments.map((attachment) =>
                  attachment.type === "image" ? (
                    <AttachmentImage
                      key={attachment.uuid}
                      attachment={attachment}
                      setModalVisible={setModalVisible}
                      setSelectedImage={setSelectedImage}
                    />
                  ) : null
                )}
              <Text style={styles.timestamp}>
                {new Date(message.sentAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              {message.updatedAt !== message.sentAt && (
                <Text style={styles.editedText}>(edited)</Text>
              )}
              {hasReactions && (
                <TouchableOpacity
                  onPress={() => setReactionsSheetVisible(true)}
                >
                  <View style={styles.reactionsContainer}>
                    {message.reactions.map((reaction) => (
                      <Text key={reaction.uuid} style={styles.reactionEmoji}>
                        {reaction.value}
                      </Text>
                    ))}
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.avatarPlaceholder}>
            {isYou && showHeader && (
              <TouchableOpacity
                onPress={() => setParticipantSheetVisible(true)}
              >
                <Image
                  source={avatarSource}
                  style={styles.avatar}
                  onError={onImageError}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {hasReactions && (
        <ReactionsBottomSheet
          visible={isReactionsSheetVisible}
          onClose={() => setReactionsSheetVisible(false)}
          reactions={message.reactions}
        />
      )}
      <ParticipantBottomSheet
        visible={isParticipantSheetVisible}
        onClose={() => setParticipantSheetVisible(false)}
        participant={participant}
      />
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={selectedImage}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 8,
  },
  myMessageContainer: {
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
    marginBottom: 2,
  },
  stackContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    marginRight: 8,
    marginLeft: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginLeft: 8,
  },
  messageContent: {
    flexShrink: 1,
  },
  participantName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  myParticipantName: {
    textAlign: "right",
  },
  otherParticipantName: {
    textAlign: "left",
  },
  messageBubble: {
    borderRadius: 10,
    padding: 12,
    maxWidth: 300,
  },
  myMessageBubble: {
    backgroundColor: "#800080",
  },
  otherMessageBubble: {
    backgroundColor: "#e0e0e0",
  },
  myStartBubble: {
    borderBottomRightRadius: 4,
  },
  otherStartBubble: {
    borderBottomLeftRadius: 4,
  },
  myMiddleBubble: {
    borderRadius: 4,
  },
  otherMiddleBubble: {
    borderRadius: 4,
  },
  myEndBubble: {
    borderTopRightRadius: 4,
  },
  otherEndBubble: {
    borderTopLeftRadius: 4,
  },
  myMessageText: {
    color: "#fff",
  },
  otherMessageText: {
    color: "#333",
  },
  editedText: {
    fontStyle: "italic",
    opacity: 0.7,
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
    color: "#FDF4DC",
  },
  reactionsContainer: {
    flexDirection: "row",
    marginTop: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 4,
    alignSelf: "flex-start",
  },
  reactionEmoji: {
    fontSize: 16,
    marginHorizontal: 4,
  },
  timestamp: {
    fontSize: 10,
    color: "#888",
    marginTop: 4,
    textAlign: "right",
  },
  attachmentImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "90%",
    height: "90%",
  },
  mentionHighlight: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  quotedMessageContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 8,
    borderRadius: 8,
    marginBottom: 5,
    borderLeftWidth: 3,
    borderLeftColor: "#800080",
  },
  quotedParticipantName: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  quotedMessageText: {
    fontSize: 12,
    color: "#555",
  },
});

export default React.memo(Message);
