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
    
    return (

        
        <><View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput style={styles.input} placeholder="Email" />
        <TextInput style={styles.input} placeholder="Password" />
        <Button title="Login" onPress={() => alert('Login')} />
        <Button title="Sign up" onPress={() => alert('Sign up')} />
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
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
    });
