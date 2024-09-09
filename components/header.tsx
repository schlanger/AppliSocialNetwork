import { View, Image, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';


export default function Header() {

return (

    <><ThemedView style={styles.container}></ThemedView><ThemedView style={styles.header}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
    </ThemedView><View style={styles.separator}></View></>)

};

  const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
  },
  logo: {
    height: 60,
    width: 100,
    marginLeft: -15,
    marginTop: 30
  },
  separator: {
    height: 15, 
    backgroundColor: '#F0F0F0',
  },

});