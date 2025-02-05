import { View, Image, StyleSheet, Touchable } from 'react-native';
import { ThemedView } from './ThemedView';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import React from 'react';



export default function Header() {

  const router = useRouter();

  const handleProfileClick = () => {
    router.push({ pathname: '/(tabs)/profile' }); // Redirige vers la page du profil
  };


return (

    <><ThemedView style={styles.container}></ThemedView><ThemedView style={styles.header}>
      <StatusBar hidden={true} />
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={handleProfileClick}>
        <Image source={require('@/assets/images/profil.png')} style={styles.profil} />
        </TouchableOpacity>
    </ThemedView></>)

};

  const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: StatusBar.currentHeight,
      },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2,
    backgroundColor: 'skyblue',
  },
  logo: {
    height: 60,
    width: 100,
    marginLeft: -15,
    marginTop: 30
  },
  profil: {
    height: 50,
    width: 40,
    borderRadius: 15,
    marginLeft: 15,
    marginTop: 50
  },

});