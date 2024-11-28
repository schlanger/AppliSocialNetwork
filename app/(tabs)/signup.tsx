import MyButton from "@/components/MyButton";
import { auth,firestore,storage } from "@/config/firebaseConfig";
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { StyleSheet, TextInput,Text, View, TouchableOpacity, Image } from "react-native";
import {doc,setDoc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Signup() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [job, setJob] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    
    const handleRedirect = () => { 
        router.push({ pathname: '/(tabs)/login' }); // Redirige vers la page de connexion
    }
    
    const handleEmail = (text: string) => {
        setEmail(text);
    };
    
    const handlePassword = (text: string) => {
        setPassword(text);
    };

    const handleName = (text: string) => {
        setName(text);
    }

    const handlefirstname = (text: string) => { 
        setFirstname(text);
    }
    const handleJob = (text: string) => {
        setJob(text);
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setPhotoURL(result.assets[0].uri); // Enregistrer l'URL de l'image sélectionnée
        }
      };

      // Fonction pour stocker l'image dans Firebase Storage
    const uploadImageToFirebase = async (uri: string | URL | Request) => {
        try {
            setUploading(true);
            const response = await fetch(uri);
            const blob = await response.blob();
            const storageRef = ref(storage, `photo de profil/${Date.now()}`);
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
    
    const handleSignup = async (email: string, password:string  ,additionalData: { name: string, firstName: string , job : string , photoURL: string }) => {
        try {
        // Inscription avec Firebase Authentication
       const userCredential =  await createUserWithEmailAndPassword(auth, email, password); // Utiliser la méthode createUserWithEmailAndPassword de l'objet 'auth'

        const userId = userCredential.user.uid;

        let uploadedPhotoURL: string | null = null;

        if (photoURL) {
            uploadedPhotoURL = await uploadImageToFirebase(photoURL); // Upload l'image et récupère l'URL de téléchargement
        }

        // Ajouter les données supplémentaires dans Firestore

        await setDoc(doc(firestore, 'users', userId), {
            name: additionalData.name,
            firstName: additionalData.firstName,
            job: additionalData.job,
            photoURL: uploadedPhotoURL || '',
        });
        if (photoURL) {
            await uploadImageToFirebase(photoURL);
        }


        alert('Inscription réussie !');

        handleEmail('');
        handlePassword('');
        handleName('');
        handlefirstname('');
        handleJob('');
        setPhotoURL('');
        
        } catch (error) {
        setError('Email ou mot de passe incorrect');
        }
    };
    
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Inscription</Text>

        <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={handleName}
        />

        <TextInput
            style={styles.input}
            placeholder="Firstname"
            onChangeText={handlefirstname}
        />
        <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={handleEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={handlePassword}
            secureTextEntry
        />

        <TextInput
            style={styles.input}
            placeholder="Job"
            onChangeText={handleJob}
        />

        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text>Sélectionner une photo de profile</Text>
        </TouchableOpacity>

      {/* Afficher l'image si elle est sélectionnée */}
      {photoURL ? <Image source={{ uri: photoURL }} style={styles.profileImage} /> : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <MyButton handleRedirect={() => handleSignup(email, password, { name, firstName: firstname, job, photoURL})} buttonText="signup" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    uploadButton: {
        marginTop: 10,
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 30,
    },

    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 10,
      },

    error: {
        color: 'red',
        marginBottom: 20,
    },
});