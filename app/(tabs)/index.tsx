import { View, Image, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/config/firebaseConfig';

export default function Index() {
  const [posts, setPosts] = useState<{ id: string; createdAt: string; name: string; firstName: string; job: string; photoURL: string; text: string; imageUrl: string | null; }[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleLikePress = () => {
    setLikeCount(likeCount + 1);
  };

  // Récupérer les posts de Firestore
  useEffect(() => {
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

      } catch (error) {
        console.error("Erreur lors de la récupération des posts :", error);
        alert("Impossible de se connecter à Firestore. Vérifiez votre connexion Internet.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <Text>Chargement...</Text>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Header />
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

            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            )}

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
          </ThemedView>
        )}
        keyExtractor={(item) => item.id}
      />
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
    height: 200,
    width: '100%',
  },
});
