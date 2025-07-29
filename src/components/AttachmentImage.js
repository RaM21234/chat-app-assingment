import React, { useState } from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';

const AttachmentImage = ({ attachment, setModalVisible, setSelectedImage }) => {
  const [hasError, setHasError] = useState(false);

  const handleImagePress = () => {
    setSelectedImage(
      hasError ? require("../assets/dummy.jpg") : { uri: attachment.url }
    );
    setModalVisible(true);
  };

  return (
    <TouchableOpacity onPress={handleImagePress}>
      <Image
        source={
          hasError ? require("../assets/dummy.jpg") : { uri: attachment.url }
        }
        style={styles.attachmentImage}
        onError={() => setHasError(true)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  attachmentImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default AttachmentImage;
