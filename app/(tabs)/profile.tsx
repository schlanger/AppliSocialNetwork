import MyButton from "@/components/MyButton";
import { firestore, auth } from "@/config/firebaseConfig";
import { collection, getDocs,doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Image } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { updateCurrentUser } from "firebase/auth";
import { updateProfile } from "firebase/auth";


export default function profil() {

    const [profil, setProfil] = useState< {id: string; name: string, firstname: string, email: string; job: string, photoURL: string}[] >([]);
    const [text, onChangeText] = React.useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [job, setJob] = useState('');
    const [photoURL, setPhotoURL] = useState('');

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

    if(auth.currentUser === null) {
        alert("Vous n'êtes pas connecté");
    }

    const userID = auth.currentUser?.uid;


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

        // Mettre à jour seulement les champs modifiés
        await updateDoc(userDocRef, {
            
            name: name || userData.name,           
            firstName: firstName || userData.firstName,
            job: job || userData.job,
            photoURL: photoURL || userData.photoURL,
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
        <FlatList
        data={profil}
        renderItem={({ item }) => (
        <View style= {styles.container}>
            <Text style= {styles.title} > Mon Profil</Text>
            <Image style={styles.image} source={{ uri: item.photoURL }} />
            <TextInput style= {styles.input} onChangeText={handleName} > {item.name}</TextInput>
            <TextInput style = {styles.input} onChangeText={handlefirstname} > {item.firstname}</TextInput>
            <TextInput style = {styles.input} onChangeText={handleEmail} > {item.email}</TextInput>
            <TextInput style = {styles.input} onChangeText={handleJob} > {item.job}</TextInput>
            <MyButton handleRedirect={() => {updateUser (name,firstname, job, photoURL)}} buttonText="Modifier" />
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


