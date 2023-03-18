import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const AuthStack = createStackNavigator();
const Tabs = createBottomTabNavigator();

import LoginScreen from "./Screens/LoginScreen";
import RegistrationScreen from "./Screens/RegistrationScreen";
import HomeScreen from "./Screens/Home";
import PostsScreen from "./Screens/PostsScreen";
import CreatePostsScreen from "./Screens/CreatePostsScreen";
import ProfileScreen from "./Screens/ProfileScreen";

// icons import
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { AntDesign } from "@expo/vector-icons";

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
        // options={{
        //   tabBarIcon: ({ focused, size, color }) => (
        //     <MaterialCommunityIcons
        //       name="postage-stamp"
        //       size={size}
        //       color={color}
        //     />
        //   ),
        // }}
        name="Posts"
        component={PostsScreen}
      />
      <Tabs.Screen
        // options={{
        //   tabBarIcon: ({ focused, size, color }) => (
        //     <AntDesign name="pluscircleo" size={35} color={color} />
        //   ),
        // }}
        name="Create"
        component={CreatePostsScreen}
      />
      <Tabs.Screen
        // options={{
        //   tabBarIcon: ({ focused, size, color }) => (
        //     <MaterialCommunityIcons
        //       name="face-profile"
        //       size={size}
        //       color={color}
        //     />
        //   ),
        // }}
        name="Profile"
        component={ProfileScreen}
      />
    </Tabs.Navigator>
  );
};
