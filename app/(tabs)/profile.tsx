import MyButton from "@/components/MyButton";
import { firestore, auth, storage } from "@/config/firebaseConfig";
import { collection, getDocs,doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Touchable, TouchableOpacity, RefreshControl } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { updateCurrentUser } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ScrollView } from "react-native-virtualized-view";


export default function profil() {

    const [profil, setProfil] = useState< {id: string; name: string, firstname: string, email: string; job: string, photoURL: string}[] >([]);
    const [text, onChangeText] = React.useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [job, setJob] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const handleName = (text: string) => {
        setName(text);
    }

    const handlefirstname = (text: string) => { 
        setFirstname(text);
    }

    const handleJob = (text: string) => {
        setJob(text);
    }

    const handleEmail = (text: string) => {
        setEmail(text);
    };
    const handlePhotoURL = (text: string) => {  
        setPhotoURL(text);
    }

    const RedirectToLogin = () => {
        router.push({ pathname: '/(tabs)/login' });
    };

    if(auth.currentUser === null) {
        alert("Vous n'êtes pas connecté");
    }

    const userID = auth.currentUser?.uid;


        const fetchProfil = async () => {
            try {
                // Récupérer l'UID de l'utilisateur connecté
                const uid = auth.currentUser ? auth.currentUser.uid : null;

                if (!uid) {
                    throw new Error("User is not authenticated");
                    RedirectToLogin();
                }
    
                // Accéder directement au document utilisateur dans la collection 'users'
                const userDocRef = doc(firestore, 'users', uid);
                const profilSnapshot = await getDoc(userDocRef);
    
                if (profilSnapshot.exists()) {
                    const data = profilSnapshot.data();
                    const email = auth.currentUser && auth.currentUser.email ? auth.currentUser.email : "";
    
                    const ProfilData = {
                        id: profilSnapshot.id,
                        name: data.name,
                        firstname: data.firstName,
                        email: email,
                        job: data.job,
                        photoURL: data.photoURL,
                    };
    
                    // Mettre à jour le profil dans l'état
                    setProfil([ProfilData]);
                } else {
                    console.log('Aucun profil trouvé pour cet utilisateur');
                }
            } catch (error) {
                alert("Veuillez vous connecter pour accéder à cette page");
                RedirectToLogin();

            }
        };
    
        const onRefresh = async () => {
            setRefreshing(true);
            await fetchProfil();
            setRefreshing(false);
          };
      
          useEffect(() => {
            fetchProfil();
          }, []);

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
    const uploadImageToFirebase = async (uri: string | URL | Request ) => {
        try {
            setUploading(true);
            const response = await fetch(uri);
            const blob = await response.blob();
            const storageRef = ref(storage, `users/${userID}/${Date.now()}`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            setUploading(false);
            setPhotoURL(downloadURL);
            return downloadURL;
        } catch (error) {
            console.error('Erreur lors du téléchargement de l\'image :', error);
            setUploading(false);
            return null;
        }
  };
    

    const updateUser = async ( name: string, firstName: string , job : string , photoURL: string ) => {
            if (!userID) {
                console.error("User ID is undefined");
                return;
            }
            const userDocRef = doc(firestore, 'users', userID);
            const email = auth.currentUser && auth.currentUser.email ? auth.currentUser.email : "";

        try {

        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        const imageURL = await uploadImageToFirebase(photoURL);


        // Mettre à jour seulement les champs modifiés
        await updateDoc(userDocRef, {
            
            name: name || userData.name,           
            firstName: firstName || userData.firstName,
            job: job || userData.job,
            photoURL: imageURL || userData.photoURL,
        });

        console.log('Profil mis à jour');
        alert('Profil mis à jour');

        } else {
        console.error("Le document utilisateur n'existe pas");
        }

        

        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil :', error);
            alert('Erreur lors de la mise à jour du profil');
        }
};
    
return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >
        <FlatList
        data={profil}
        renderItem={({ item }) => (
        <View style= {styles.container}>
            <Text style= {styles.title} > Mon Profil</Text>
            <TouchableOpacity onPress={pickImage}>
            <Image style={styles.image} source={{ uri: item.photoURL }} />
            </TouchableOpacity>
            <TextInput style= {styles.input} onChangeText={handleName} > {item.name}</TextInput>
            <TextInput style = {styles.input} onChangeText={handlefirstname} > {item.firstname}</TextInput>
            <TextInput style = {styles.input} onChangeText={handleEmail} > {item.email}</TextInput>
            <TextInput style = {styles.input} onChangeText={handleJob} > {item.job}</TextInput>
            <MyButton handleRedirect={() => {updateUser (name,firstname, job, photoURL)}} buttonText="Modifier" />
        </View>
        )}
        keyExtractor={(item) => item.id}
        />
        </ScrollView>
    </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 100,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      image: {
        width: 150,
        height: 150,
        marginTop: 20,
        borderRadius : 100,
      },
      button : {
        marginTop: 20,
      },
});


