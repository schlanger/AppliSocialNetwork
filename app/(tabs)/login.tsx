import MyButton from "@/components/MyButton";
import React from "react";
import { Button, TextInput, View } from "react-native";
import { Text } from "react-native";
import { StyleSheet } from "react-native";

export default function login() {

    const users = [
        {
        id: 1,
        email: 'johndoe@gmail.com',
        password: '123456',
        },

        {
        id: 2,
        email: 'JackSpero@gmail.com',
        password: '7891011',
        },
    ]

    const [email, setEmail] = React.useState('');

    const [password, setPassword] = React.useState('');

    const handleEmail = (text: string) => {
        setEmail(text);
    }

    const handlePassword = (text: string) => {
        setPassword(text);
    }
    const handleLogin = () => {
        users.map((user) => {
            if (email === user.email && password === user.password) {
                alert('connecté');
            } else {
                alert('email ou mot de passe incorrect');
            }
        })
    }

    return (
        
        <><View style={styles.container}>
        <Text style={styles.title}>Connexion</Text>
        <TextInput style={styles.input} placeholder="Email" onChangeText={handleEmail}/>
        <TextInput style={styles.input} placeholder="Password" onChangeText={handlePassword} />
        <MyButton handleRedirect={handleLogin} buttonText="login" />
      </View></>)
    
    };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 20,
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
      button : {
        margin: 20,
        color: 'blue',
        borderBottomColor : 'blue',
        borderBottomWidth : 1,

      },
      text : {
        color: 'black',
        margin: 20,
        fontSize: 12,
        right: 40,
        padding: 10,
      }
    });
