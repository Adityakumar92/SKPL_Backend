import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  roleAndPermission: null,
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.roleAndPermission = action.payload.roleAndPermission;
      state.isAuthChecked = true;

      localStorage.setItem("authData", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.roleAndPermission = null;
      state.isAuthChecked = true;

      localStorage.removeItem("authData");
    },
    loadUserFromStorage: (state) => {
      const savedData = localStorage.getItem("authData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        state.token = parsedData.token;
        state.user = parsedData.user;
        state.roleAndPermission = parsedData.roleAndPermission;
      }
      state.isAuthChecked = true;
    }
  },
});

export const { login, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
