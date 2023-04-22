import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import { authStateChangeUser } from "../redux/auth/authOperations";

import { useRoute } from "../routers/authRouter";

export const Main = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, []);

  const { stateChanged } = useSelector((state) => state.auth);
  const routing = useRoute(stateChanged);

  return <NavigationContainer>{routing}</NavigationContainer>;
};
