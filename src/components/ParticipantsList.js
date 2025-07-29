import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { useChatStore } from '../store/chatStore';

const ParticipantsList = () => {
  const participants = useChatStore((state) => state.participants);
  const participantArray = Object.values(participants);

  const renderItem = ({ item: participant }) => (
    <View style={styles.listItem}>
      <Image source={{ uri: participant.avatarUrl }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{participant.name}</Text>
        <Text style={styles.jobTitle}>{participant.jobTitle}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Participants</Text>
      <FlatList
        data={participantArray}
        renderItem={renderItem}
        keyExtractor={(item) => item.uuid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
    width: 250,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  jobTitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default ParticipantsList;