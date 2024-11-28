import { View, Image, StyleSheet, FlatList, Text, TouchableOpacity,Linking, RefreshControl } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, firestore,storage } from '@/config/firebaseConfig';
import { useRouter } from 'expo-router';
import { ResizeMode, Video } from 'expo-av';
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
  
  const fetchPosts = async () => {
    try {
      const postsCollection = collection(firestore, 'posts');
      const postsSnapshot = await getDocs(postsCollection);

      const postsData = await Promise.all(
        postsSnapshot.docs.map(async (postDoc) => {
          const postData = postDoc.data();
          const postId = postDoc.id;

          // Récupérer les informations de l'utilisateur
          const userId = postData.userID;
          
          if (!userId) {
            console.warn(`Aucun userId pour le post ${postId}`);
            return null;
          }

          const userDocRef = doc(firestore, 'users', userId);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            console.warn(`Utilisateur introuvable pour le post ${postId}`);
            return null;
          }

          const userData = userDoc.data();
          const createdAt = postData.createdAt ? postData.createdAt.toDate().toLocaleString() : 'Date inconnue';

          // Compléter les informations du post avec les informations utilisateur
          const completePostData = {
            id: postId,
            createdAt,
            name: userData.name,
            firstName: userData.firstName,
            job: userData.job,
            photoURL: userData.photoURL,
            text: postData.text || 'Aucun contenu',
            imageUrl: postData.imageUrl || null,
          };

          // Vérifier et récupérer le type de fichier si imageUrl est défini
          if (postData.imageUrl) {
            await fetchFileType(postData.imageUrl, postId);
          }

          return completePostData;
        })
      );

      // Filtrer les posts valides et mettre à jour l'état
      setPosts(postsData.filter((post) => post !== null));
    } catch (error) {
      console.error('Erreur lors de la récupération des posts :', error);
      alert('Impossible de se connecter à Firestore. Vérifiez votre connexion Internet.');
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
    marginBottom: 50,
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
    height: 380,
    width: 360,
  },
});
