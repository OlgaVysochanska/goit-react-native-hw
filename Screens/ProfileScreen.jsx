import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  where,
} from "firebase/firestore";

import { authSignOutUser, authEditProfile } from "../redux/auth/authOperations";

import { db, storage } from "../firebase/config";

import SvgAddAvatar from "../assets/svg/addAvatar";
import SvgMessage from "../assets/svg/messageIcon";
import SvgMap from "../assets/svg/mapIcon";

const ProfileScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsersPosts();
  }, []);

  useEffect(() => {
    if (!selectedImg) {
      setSelectedImg(photo);
    }
  }, []);

  useEffect(() => {
    if (currentAvatar !== null && currentAvatar !== photo) {
      uploadPhotoToServer();
    }
  }, [currentAvatar]);

  const { userId, nickname, photo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const signOut = () => {
    setPosts([]);
    dispatch(authSignOutUser());
  };

  const getUsersPosts = async () => {
    try {
      const postsRef = await collection(db, "posts");
      const q = query(
        postsRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      let posts = [];

      for (const post of snapshot.docs) {
        const postRef = await doc(db, "posts", post.id);
        const commentsRef = collection(postRef, "comments");
        const commentsSnapshot = await getDocs(commentsRef);
        const commentsCount = commentsSnapshot.size;

        posts.push({
          id: post.id,
          ...post.data(),
          commentsCount,
        });
      }

      setPosts(posts);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const downloadPhoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImg(result.assets[0].uri);
        setCurrentAvatar(result.assets[0].uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  const uploadPhotoToServer = async () => {
    try {
      setLoading(true);
      const response = await fetch(selectedImg);
      const file = await response.blob();
      const uniquePhotoId = Date.now().toString();

      const storageRef = ref(storage, `avatar/${uniquePhotoId}`);
      const result = await uploadBytesResumable(storageRef, file);
      const processedPhoto = await getDownloadURL(storageRef);
      await dispatch(authEditProfile({ photo: processedPhoto }));
      setLoading(false);
      return processedPhoto;
    } catch (error) {
      console.log("error:", error);
    }
  };

  const clearPhoto = () => {
    setSelectedImg(null);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        source={require("../assets/background.jpg")}
      >
        <View style={styles.profileContainer}>
          {loading && (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size="large" color="#FF6C00" />
            </View>
          )}
          <TouchableOpacity
            style={{ position: "absolute", right: 20, top: 20 }}
            onPress={() => {
              signOut();
            }}
          >
            <Image
              source={require("../assets/logOut.jpg")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            {selectedImg ? (
              <>
                <Image source={{ uri: selectedImg }} style={styles.avatar} />
                <TouchableOpacity
                  style={styles.removeAvatar}
                  onPress={clearPhoto}
                >
                  <SvgAddAvatar />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.addAvatar}
                onPress={downloadPhoto}
              >
                <SvgAddAvatar />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.nickname}>{nickname}</Text>

          {posts.length > 0 ? (
            <FlatList
              data={posts}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.postsContainer}>
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
                      <Text styles={{ marginLeft: 5 }}>
                        {item.commentsCount}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.detailsBlock}
                      onPress={() => {
                        const location = item.place;
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
          ) : (
            <View style={styles.textContainer}>
              <Text style={styles.noPostsText}>Додайте свій перший пост!</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  profileContainer: {
    flex: 1,
    marginTop: 120,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  avatarContainer: {
    position: "absolute",
    left: "34%",
    top: -60,
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 10,
  },
  addAvatar: {
    position: "absolute",
    left: "85%",
    top: "65%",
  },
  removeAvatar: {
    position: "absolute",
    left: "85%",
    top: "65%",
    transform: [{ rotate: "45deg" }],
  },
  avatar: {
    maxWidth: "100%",
    borderRadius: 10,
    height: 120,
    width: "100%",
    resizeMode: "cover",
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
  nickname: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 90,
    marginBottom: 30,
  },
  noPostsText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  textContainer: {
    borderColor: "#FF6C00",
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 50,
    marginBottom: 30,
  },
});

export default ProfileScreen;
