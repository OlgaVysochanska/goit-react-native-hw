import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { app } from "../../firebase/config";
import { authSlice } from "./authSlice";

export const authSignUpUser =
  ({ email, password, login, photo }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth(app);
      const user = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: login,
        photoURL: photo,
      });
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

      const { uid, displayName, photoURL } = auth.currentUser;
      await dispatch(
        authSlice.actions.updateUserProfile({
          userId: uid,
          nickname: displayName,
          photo: photoURL,
        })
      );
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
