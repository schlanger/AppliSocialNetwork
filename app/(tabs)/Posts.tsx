import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, Button, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Header from '@/components/header';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import MyButton from '@/components/MyButton';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Posts() {

  const [text, onChangeText] = React.useState('');

  const router = useRouter();

   const handleRedirect = () => {
    router.push({
      pathname: '/(tabs)/index',
      params: { name: text },
    });
  };
  

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fonction pour ouvrir la galerie d'images/vidéos
  const pickImage = async () => {
    // Demander la permission d'accès aux médias
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access media library is required!");
      return;
    }

    // Ouvrir la galerie pour sélectionner une image ou une vidéo
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Permet de sélectionner des images et des vidéos
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>

    <><Header></Header>

    <ThemedView>
      <ThemedText style={styles.title}>Posts</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Write a post..." 
        onChangeText={onChangeText}
        value={ text }/>

     <ThemedText style={styles.title}>Upload Image or Video</ThemedText>
      <Button title="Select Image or Video" onPress={pickImage} />

      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}
    </ThemedView></>

    <View style={styles.button}>
    <MyButton handleRedirect={handleRedirect} buttonText="Post" />
    </View>
    
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({

  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
  button : {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center', 

  },
});
