import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { TouchableOpacity, Image } from "react-native";

const AuthStack = createStackNavigator();
const Tabs = createBottomTabNavigator();

import LoginScreen from "./Screens/LoginScreen";
import RegistrationScreen from "./Screens/RegistrationScreen";
import HomeScreen from "./Screens/Home";
import PostsScreen from "./Screens/PostsScreen";
import CreatePostsScreen from "./Screens/CreatePostsScreen";
import ProfileScreen from "./Screens/ProfileScreen";

import SvgPosts from "./assets/svg/postsIcon";
import SvgCreate from "./assets/svg/createIcon";
import SvgProfile from "./assets/svg/profileIcon";

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Login"
          component={LoginScreen}
        />
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Registration"
          component={RegistrationScreen}
        />

        {/* Це поки умову аутентифікації змінюємо вручну, щоб можна було побачити перехід логін-хоум  */}

        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Home"
          component={HomeScreen}
        />
      </AuthStack.Navigator>
    );
  }
  return (
    <Tabs.Navigator>
      <Tabs.Screen
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => navigation.navigate("Login")}
            >
              <Image
                source={require("./assets/logOut.jpg")}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
          ),

          tabBarIcon: ({ color, size }) => (
            <SvgPosts color={color} size={size} />
          ),
        }}
        name="Posts"
        component={PostsScreen}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <SvgCreate color={color} size={size} />
          ),
        }}
        name="Create"
        component={CreatePostsScreen}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <SvgProfile color={color} size={size} />
          ),
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </Tabs.Navigator>
  );
};
