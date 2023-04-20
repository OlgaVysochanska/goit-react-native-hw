import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: null,
    nickname: null,
    photo: null,
    stateChanged: null,
  },
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
