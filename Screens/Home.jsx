import React from "react";
import { Button } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Ionicons } from "@expo/vector-icons";

import PostsScreen from "./PostsScreen";
import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";

const Tabs = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen
        options={{
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate("Login")}
              title="LOG OUT"
              color="#fff"
            />
          ),
        }}
        name="Posts"
        component={PostsScreen}
      />
      <Tabs.Screen name="Create" component={CreatePostsScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

export default HomeScreen;
