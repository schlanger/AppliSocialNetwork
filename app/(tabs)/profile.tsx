import MyButton from "@/components/MyButton";
import { firestore, auth } from "@/config/firebaseConfig";
import { collection, getDocs,doc, getDoc } from "firebase/firestore";
import React from "react";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Image } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { updateCurrentUser } from "firebase/auth";
import { updateProfile } from "firebase/auth";


export default function profil() {

    const [profil, setProfil] = useState< {id: string; name: string, firstname: string, email: string; job: string, photoURL: string}[] >([]);
    const [text, onChangeText] = React.useState('');

    const updateProfil = async () => {
        
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName: text,
            });
        } else {
            console.error("User is not authenticated");
        }

    }



    useEffect(() => {
        const fetchProfil = async () => {
            try {
                // Récupérer l'UID de l'utilisateur connecté
                const uid = auth.currentUser ? auth.currentUser.uid : null;

                if (!uid) {
                    throw new Error("User is not authenticated");
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
                console.error("Erreur lors de la récupération du profil :", error);
                alert("Impossible de se connecter à Firestore. Vérifiez votre connexion Internet.");
            }
        };
    
        fetchProfil();
    }, []);
    
return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <FlatList
        data={profil}
        renderItem={({ item }) => (
        <View style= {styles.container}>
            <Text style= {styles.title} > Mon Profil</Text>
            <Image style={styles.image} source={{ uri: item.photoURL }} />
            <TextInput style= {styles.input} > {item.name}</TextInput>
            <TextInput style = {styles.input} > {item.firstname}</TextInput>
            <TextInput style = {styles.input} > {item.email}</TextInput>
            <TextInput style = {styles.input} > {item.job}</TextInput>
            <MyButton handleRedirect={() => {updateProfil}} buttonText="Modifier" />
        </View>
        )}
        keyExtractor={(item) => item.id}
        />
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