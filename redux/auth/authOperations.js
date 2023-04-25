import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { app, db } from "../../firebase/config";
import { authSlice } from "./authSlice";

const { authSignOut, updateUserProfile, authStateChanged } = authSlice.actions;

export const authSignUpUser =
  ({ email, login, password, avatar }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth(app);
      const user = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: login,
        photoURL: avatar,
      });
      await onAuthStateChanged(auth, async (user) => {
        if (user) {
          await setDoc(doc(db, "users", user.uid), {
            userId: user.uid,
            nickname: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: Date.now().toString(),
          });
        }
      });
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

export const authSignInUser =
  ({ email, password, login, photo }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth(app);
      const user = await signInWithEmailAndPassword(auth, email, password);

      const { uid, displayName, photoURL } = auth.currentUser;
      await dispatch(
        updateUserProfile({
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
    dispatch(authSignOut());
  } catch (error) {
    console.log("error:", error);
  }
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  try {
    const auth = getAuth(app);
    await onAuthStateChanged(auth, async (user) => {
      if (user) {
        await dispatch(
          updateUserProfile({
            userId: user.uid,
            nickname: user.displayName,
            photo: user.photoURL,
          })
        );
        dispatch(authStateChanged({ stateChanged: true }));
      }
    });
  } catch (error) {
    console.log("error:", error);
  }
};

// export const authEditUser = () => async (dispatch, getState) => {
//   try {
//     const auth = getAuth(app);
//     await onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         const useRef = await doc(db, "users", user.uid);
//         await setDoc(userRef, { photoURL: photo }, { merge: true });
//       }
//     });
//   } catch (error) {
//     console.log("error:", error);
//   }
// };
