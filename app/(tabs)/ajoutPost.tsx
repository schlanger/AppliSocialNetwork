import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, Button, View, Alert,Text } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Header from '@/components/header';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import MyButton from '@/components/MyButton';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// Import Firebase
import { firestore, storage,auth } from '@/config/firebaseConfig';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';



export default function Posts() {
  const [text, onChangeText] = React.useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  //console.log(auth.currentUser.uid.);

  // Fonction pour ouvrir la galerie d'images/vidéos
  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Fonction pour stocker l'image dans Firebase Storage
  const uploadImageToFirebase = async (uri: string | URL | Request) => {
    try {
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `posts/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setUploading(false);
      return downloadURL;
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image :', error);
      setUploading(false);
      return null;
    }
  };

  // Fonction pour sauvegarder le post dans Firestore
  const savePostToFirestore = async (imageUrl: string | null) => {
    try {
      const uid = auth.currentUser?.uid; // Récupérer l'UID de l'utilisateur connecté
      if (!uid) {
        throw new Error('Utilisateur non connecté');
      }
      
      // Ajouter le post à Firestore
      await addDoc(collection(firestore, 'posts'), {
        text: text,
        imageUrl: imageUrl || '',
        createdAt: new Date(),
        userID: uid,
      });
  
      Alert.alert('Succès', 'Le post a été ajouté avec succès !');
      onChangeText('');
      setSelectedImage(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du post dans Firestore :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du post.');
    }
  };

   
  const handlePost = async () => {
    let imageUrl = null;
    if (auth.currentUser != null) {
    if (selectedImage) {
      imageUrl = await uploadImageToFirebase(selectedImage);
    }
    savePostToFirestore(imageUrl);
  }else {
      alert('veuillez vous connecter pour faire un post')
      router.push({ pathname: '/(tabs)/login' });
    }
  };
/*
  if (loading) {
    return <Text>Chargement...</Text>;
  }*/

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Header />
      <ThemedView>
        <ThemedText style={styles.title}>Posts</ThemedText>


        <TextInput
          style={styles.input}
          placeholder="Write a post..."
          onChangeText={onChangeText}
          value={text}
        />
        <ThemedText style={styles.title}>Upload Image or Video</ThemedText>
        <Button title="Select Image or Video" onPress={pickImage} />
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        )}
      </ThemedView>

      <View style={styles.button}>
        <MyButton handleRedirect={handlePost} buttonText="Post" />
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
  input2: {
    height: 40,
    width: 300,
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
  button: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
