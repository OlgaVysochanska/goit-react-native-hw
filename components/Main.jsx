import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import { authStateChangeUser } from "../redux/auth/authOperations";

import { useRoute } from "./router";

export const Main = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, []);

  const state = useSelector((state) => state);
  const routing = useRoute(user);

  return <NavigationContainer>{routing}</NavigationContainer>;
};
