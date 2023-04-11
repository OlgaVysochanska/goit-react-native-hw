import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { app } from "../../firebase/config";

export const authSignUpUser =
  ({ email, password, login, photo }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth(app);
      const user = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log("error:", error);
    }
  };

export const authSignInUser =
  ({ email, password, login, photo }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth(app);
      const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log("error:", error);
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  try {
    const auth = getAuth(app);
    await signOut(auth);
  } catch (error) {
    console.log("error:", error);
  }
};
