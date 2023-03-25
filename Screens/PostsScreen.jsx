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

const POSTS = [];

export default PostsScreen = ({ navigation, route }) => {
  const [posts, setPosts] = useState(POSTS);

  useEffect(() => {
    if (route.params) {
      setPosts((prevState) => [...prevState, route.params]);
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <Text style={styles.someText}>Тут будуть відображатиись пости</Text>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.postsContainer}>
            <Image style={styles.photo} source={{ uri: item.photo }} />
            <Text>{item.photoName}</Text>
            <View style={styles.details}>
              <TouchableOpacity>
                <Text>comments</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const location = item.location;
                  const photoName = item.photoName;
                  navigation.navigate("Map", { location, photoName });
                }}
              >
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
  someText: {
    color: "#000",
  },
  postsContainer: {
    marginHorizontal: 16,
    gap: 30,
  },
  photo: {
    width: "100%",
    height: 240,
  },
  photoName: {
    fontWeight: "bold",
    marginTop: 8,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  location: {
    textDecorationLine: "underline",
  },
});
