import React, { useState } from "react";
import { StyleSheet, Text, SafeAreaView, FlatList } from "react-native";

const POSTS = [];

export default PostsScreen = () => {
  const [posts, setposts] = useState(POSTS);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.someText}>Тут будуть відображатиись пости</Text>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  someText: {
    color: "#000",
  },
});
