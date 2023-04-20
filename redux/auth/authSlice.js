import { createSlice } from "@reduxjs/toolkit";

const state = {
  userId: null,
  nickname: null,
  photo: null,
  stateChanged: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: state,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      nickname: payload.nickname,
      photo: payload.photo,
    }),
    authStateChanged: (state, { payload }) => ({
      ...state,
      stateChanged: payload.stateChanged,
    }),
    authSignOut: () => state,
  },
});
