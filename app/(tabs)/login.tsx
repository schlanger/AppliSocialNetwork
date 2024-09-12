import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import MyButton from "@/components/MyButton";
import { auth } from '@/config/firebaseConfig';  
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import the signInWithEmailAndPassword method

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmail = (text: string) => {
    setEmail(text);
  };

  const handlePassword = (text: string) => {
    setPassword(text);
  };

  const handleLogin = async () => {
    try {
      // Connexion avec Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password); // Use the signInWithEmailAndPassword method from the 'auth' object
      alert('Connexion réussie !');
    } catch (error) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
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
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <MyButton handleRedirect={handleLogin} buttonText="login" />
    </View>
  );
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
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
