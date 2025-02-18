import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import MyButton from "@/components/MyButton";
import { auth } from '@/config/firebaseConfig';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged method
import { useRouter } from 'expo-router';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state for authentication status
  const router = useRouter();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is logged in
      } else {
        setIsAuthenticated(false); // User is logged out
      }
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  const handleRedirect = () => { 
    router.push({ pathname: '/(tabs)/signup' }); // Redirect to signup page
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('Déconnexion réussie !');
    } catch (error) {
      console.error('Erreur de déconnexion :', error);
    }
  };

  const handleEmail = (text: string) => {
    setEmail(text);
  };

  const handlePassword = (text: string) => {
    setPassword(text);
  };

  const handleLogin = async () => {
    try {
      // Sign in with Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      alert('Connexion réussie !');
      router.push({pathname: '/(tabs)/' });
    } catch (error) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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

        <TouchableOpacity onPress={handleRedirect}>
          <Text>Pas encore de compte ? Inscrivez-vous</Text>
        </TouchableOpacity>

        {/* Show sign-out button only when user is authenticated */}
        {isAuthenticated && (
          <TouchableOpacity onPress={handleSignOut}>
            <Text>↪️ Se déconnecter</Text>
          </TouchableOpacity>
        )}
      </View>
    </GestureHandlerRootView>
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
