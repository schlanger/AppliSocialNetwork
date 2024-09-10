import { View, Image, StyleSheet, FlatList, Text, TouchableOpacity, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Header from '@/components/header';
import { useLocalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainNavigator from './';

export default function SocialApp() {

  const params = useLocalSearchParams();

  const [likeCount, setLikeCount] = useState(0);

  const handleLikePress = () => {
    setLikeCount(likeCount + 1);
  };

const posts = [
  {
    id: '1',
    user: 'John Doe',
    jobTitle: 'Software Engineer',
    avatar: require('@/assets/images/profil.png'),
    content: 'What do you think about my last vacation at California? 🌞',
    image : require('@/assets/images/horse.png')
  },
  {
    id: '2',
    user: 'Jane Smith',
    jobTitle: 'Product Manager',
    avatar: require('@/assets/images/profil.png'),
    content: 'Looking for a UI/UX designer to join our team. DM me!',
    image : require('@/assets/images/UX.png')
  },

  {
    id: '3',  
    user: 'Joe Bloggs',
    jobTitle: 'Frontend Developer',
    avatar: require('@/assets/images/me.png'),
    content: 'Just published my new portfolio website. Check it out!',
    image : require('@/assets/images/portfolio.png')
  }
  // Add more posts here
];


  return (

    <GestureHandlerRootView style={{ flex: 1 }}>

     <><Header

        /><FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image source={item.avatar} style={styles.avatar} />
              <View>
                <Text style={styles.username}>{item.user}</Text>
                <Text style={styles.jobTitle}>{item.jobTitle}</Text>
              </View>
            </View>
            <Text style={styles.postContent}>{item.content}</Text>

            <Image source={item.image} style={styles.image} />

            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleLikePress}>
                <Text>👍 Like {likeCount} </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Text>💬 Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text>🔄 Share</Text>
              </TouchableOpacity>

              <Text> {params.name}</Text>
            </View>
          </ThemedView>



        )} /></>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 25,
    width: 25,
    marginLeft: 15,
  },
  profilePic: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginLeft: 15,
  },
  postContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  jobTitle: {
    color: '#555',
  },
  postContent: {
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    padding: 5,
    backgroundColor: '#EAEAEA',
    borderRadius: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },
  image : {
    height: 200,
    width: '100%'
  },
  separator: {
    height: 15, 
    backgroundColor: '#F0F0F0',
  },
  likeCountText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
