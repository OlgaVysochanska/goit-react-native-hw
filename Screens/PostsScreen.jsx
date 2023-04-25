import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
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

  const getAllPosts = async () => {
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
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postsContainer}>
            <View style={styles.userContainer}>
              <Image
                source={{ uri: item.photoUser }}
                style={styles.photoUser}
              />
              <View style={styles.infoUser}>
                <Text style={styles.loginUser}>{item.nickname}</Text>
                <Text style={styles.emailUser}>{item.email}</Text>
              </View>
            </View>
            <Image style={styles.photo} source={{ uri: item.photo }} />
            <Text style={styles.photoName}>{item.photoName}</Text>
            <View style={styles.details}>
              <TouchableOpacity
                style={{ ...styles.detailsBlock, alignItems: "center" }}
                onPress={(navigation.navigate("Comments"), { postId: item.id })}
              >
                <SvgMessage />
                <Text styles={{ marginLeft: 5 }}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.detailsBlock}
                onPress={() => {
                  const location = item.location;
                  const photoName = item.photoName;
                  navigation.navigate("Map", { location, photoName });
                }}
              >
                <SvgMap />
                <Text style={styles.location}>{item.photoLocation}</Text>
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

  postsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  userContainer: {
    backgroundColor: "#000",
    padding: 10,
  },
  photoUser: {
    width: 50,
    height: 50,
  },
  infoUser: {
    color: "#ff0000",
  },
  loginUser: {
    color: "#ff0000",
  },
  emailUser: {
    color: "#ff0000",
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
