import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { authSignOutUser } from "../redux/auth/authOperations";

import PostsScreen from "./PostsScreen";
import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";

import SvgLogout from "../assets/svg/logoutIcon";
import SvgPosts from "../assets/svg/postsIcon";
import SvgCreate from "../assets/svg/createIcon";
import SvgProfile from "../assets/svg/profileIcon";

const Tabs = createBottomTabNavigator();

const HomeTabs = ({ navigation }) => {
  const dispatch = useDispatch();
  const signOut = () => {
    dispatch(authSignOutUser());
  };
  return (
    <Tabs.Navigator>
      <Tabs.Screen
        options={{
          title: "Публікації",
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => {
                signOut();
              }}
            >
              <Image
                source={require("../assets/logOut.jpg")}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
          ),

          tabBarIcon: ({ color, size }) => (
            <SvgPosts color={color} size={size} />
          ),
          tabBarShowLabel: false,
        }}
        name="Posts"
        component={PostsScreen}
      />
      <Tabs.Screen
        options={{
          title: "Створити публікацію",
          tabBarIcon: ({ color, size }) => (
            <SvgCreate color={color} size={size} />
          ),
          tabBarShowLabel: false,
        }}
        name="Create"
        component={CreatePostsScreen}
      />
      <Tabs.Screen
        options={{
          headerShown: false,

          tabBarIcon: ({ color, size }) => (
            <SvgProfile color={color} size={size} />
          ),
          tabBarShowLabel: false,
        }}
        name="Profile"
        component={ProfileScreen}
      />
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

export default HomeTabs;
