import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
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

export const authSignInUser = () => async (dispatch, getState) => {};

export const authSignOutUser = () => async (dispatch, getState) => {};
