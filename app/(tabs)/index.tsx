import { View, Image, StyleSheet, FlatList, Text, TouchableOpacity,Linking, RefreshControl } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import { collection, getDocs } from 'firebase/firestore';
import { firestore,storage } from '@/config/firebaseConfig';
import {useRouter} from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { getMetadata,ref } from 'firebase/storage';
import { ScrollView } from 'react-native-virtualized-view'

export default function Index() {
  const [posts, setPosts] = useState<{ id: string; createdAt: string; name: string; firstName: string; job: string; photoURL: string; text: string; imageUrl: string | null; }[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mediaTypes, setMediaTypes] = useState<{ [key: string]: string }>({});
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const handleLikePress = () => {
    setLikeCount(likeCount + 1);
  };


  const fetchFileType = async (imageUrl: string | undefined, id: any) => {
    const fileRef = ref(storage, imageUrl); // Crée une référence vers le fichier
    try {
      const metadata = await getMetadata(fileRef); // Récupère les métadonnées du fichier
      setMediaTypes((prev) => ({
        ...prev,
        [id]: metadata.contentType, // Stocke le type MIME en fonction de l'ID du post
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées :', error);
    }
  };
  
  // Récupérer les posts de Firestore
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(firestore, 'posts');
        const postsSnapshot = await getDocs(postsCollection);

        const postsData = postsSnapshot.docs.map(doc => {
          const data = doc.data();

          // Convertir le Timestamp en Date lisible
          const createdAt = data.createdAt ? data.createdAt.toDate().toLocaleString() : 'Date inconnue';

          return {
            id: doc.id,
            createdAt, // Utiliser la date formatée
            name: data.name,
            firstName: data.firstName,
            job: data.job,
            photoURL: data.photoURL,
            text: data.text || 'Aucun contenu',
            imageUrl: data.imageUrl || null,
          };
        });

        setPosts(postsData);

        postsData.forEach((post) => {
          if (post.imageUrl) {
            fetchFileType(post.imageUrl, post.id);
          }
        });

      } catch (error) {
        console.error("Erreur lors de la récupération des posts :", error);
        alert("Impossible de se connecter à Firestore. Vérifiez votre connexion Internet.");
      } finally {
        setLoading(false);
      }
    };

    const onRefresh = async () => {
      setRefreshing(true);
      await fetchPosts();
      setRefreshing(false);
    };

    useEffect(() => {
      fetchPosts();
    }, []);

  if (loading) {
    return <Text>Chargement...</Text>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <ThemedView style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image source={{ uri: item.photoURL }} style={styles.avatar} />
              <View>
              <Text style={styles.username}>{item.firstName} {item.name}</Text>
              <Text style={styles.jobTitle}>{item.job}</Text>
              <Text style={styles.jobTitle}>{item.createdAt}</Text>
            </View>
            </View>

            <Text style={styles.postContent}>{item.text}</Text>

            <TouchableOpacity
              onPress={() => item.imageUrl && Linking.openURL(item.imageUrl)}
            >

              {mediaTypes[item.id]?.startsWith('image/') && (
                <Image
                  source={{ uri: item.imageUrl || undefined }}
                  style={styles.image}
                />
              )}

              {mediaTypes[item.id]?.startsWith('video/') && (
                <Video
                  source={{ uri: item.imageUrl || '' }}
                  rate={1.0}
                  volume={1.0}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay
                  isLooping
                  style={styles.image}
                />
              )}
            </TouchableOpacity>

           {/* 
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
            </View>
            */}
          </ThemedView>
        )}
        keyExtractor={(item) => item.id}
      />
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  image: {
    height: 360,
    width: 360
  },
});
