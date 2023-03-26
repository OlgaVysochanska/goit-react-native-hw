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

import SvgMessage from "../assets/svg/messageIcon";
import SvgMap from "../assets/svg/mapIcon";

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
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.postsContainer}>
            <Image style={styles.photo} source={{ uri: item.photo }} />
            <Text style={styles.photoName}>{item.photoName}</Text>
            <View style={styles.details}>
              <TouchableOpacity
                style={{ ...styles.detailsBlock, alignItems: "center" }}
                // onPress={navigation.navigate("Comments")}
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
