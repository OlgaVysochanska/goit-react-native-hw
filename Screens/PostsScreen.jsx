import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

import SvgMessage from "../assets/svg/messageIcon";
import SvgMap from "../assets/svg/mapIcon";

export default PostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllPosts = async () => {
    setLoading(true);
    try {
      const postsRef = await collection(db, "posts");
      const q = query(postsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      let posts = [];

      for (const post of snapshot.docs) {
        const postRef = await doc(db, "posts", post.id);
        const commentsRef = collection(postRef, "comments");
        const commentsSnapshot = await getDocs(commentsRef);
        const commentsCount = commentsSnapshot.size;

        const userRef = doc(db, "users", post.data().userId);
        const userSnap = await getDoc(userRef);

        posts.push({
          id: post.id,
          ...post.data(),
          commentsCount,

          nickname: userSnap.data().nickname,
          email: userSnap.data().email,
          photoUser: userSnap.data().photoURL,
        });
      }

      setPosts(posts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color="#FF6C00" />
        </View>
      )}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postsContainer}>
            <View style={styles.userContainer}>
              {item.photoUser ? (
                <Image
                  source={{ uri: item.photoUser }}
                  style={styles.photoUser}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.nickname.split("")[0]}
                  </Text>
                </View>
              )}
              <View style={styles.infoUser}>
                <Text style={styles.loginUser}>{item.nickname}</Text>
                <Text style={styles.emailUser}>{item.email}</Text>
              </View>
            </View>
            <Image style={styles.photo} source={{ uri: item.photo }} />
            <Text style={styles.photoName}>{item.description}</Text>
            <View style={styles.details}>
              <TouchableOpacity
                style={{ ...styles.detailsBlock, alignItems: "center" }}
                onPress={() => {
                  navigation.navigate("Comments", { postId: item.id });
                }}
              >
                <SvgMessage />
                <Text styles={{ marginLeft: 5 }}>{item.commentsCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.detailsBlock}
                onPress={() => {
                  const location = item.location;
                  const photoName = item.description;
                  navigation.navigate("Map", { location, photoName });
                }}
              >
                <SvgMap />
                <Text style={styles.location}>{item.place}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  activityIndicatorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 9,
  },
  postsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  userContainer: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
  },
  photoUser: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: 50,
    height: 50,
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: "#FF6C00",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  loginUser: {
    color: "#000",
    fontSize: 18,
  },
  emailUser: {
    color: "#212121",
  },
  photo: {
    width: "100%",
    height: 240,
    borderRadius: 10,
  },
  photoName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  detailsBlock: {
    flexDirection: "row",
  },
  location: {
    fontSize: 16,
    marginLeft: 5,
    textDecorationLine: "underline",
  },
});
