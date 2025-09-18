import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuth: false,
  loading: false,
  btnLoading: false,
  error: null,
  message: null,
  userRole: null,
  userPermissions: null,
  employee: null,
  organization: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadingStart: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    btnLoadingStart: (state) => {
      state.btnLoading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess: (state, action) => {
      state.btnLoading = false;
      state.user = action.payload.user;
      state.isAuth = true;
      state.message = action.payload.message;
      state.error = null;
    },
    registerFail: (state, action) => {
      state.btnLoading = false;
      state.user = null;
      state.isAuth = false;
      state.error = action.payload;
    },
    loginSuccess: (state, action) => {
      state.btnLoading = false;
      state.user = action.payload.user;
      state.isAuth = true;
      state.message = action.payload.message;
      state.error = null;
    },
    loginFail: (state, action) => {
      state.btnLoading = false;
      state.user = null;
      state.isAuth = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuth = false;
      state.message = "Logged out successfully.";
      state.error = null;
      state.btnLoading = false;
      state.loading = false;
    },
    getUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuth = true;
      state.error = null;
    },
    getUserFail: (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuth = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setUserPermissions: (state, action) => {
      state.userRole = action.payload.role;
      state.userPermissions = action.payload.permissions;
      state.employee = action.payload.employee;
      state.organization = action.payload.organization;
      // Ensure auth state is consistent when we have permissions
      if (action.payload.role) {
        state.isAuth = true;
      }
    },
    clearUserPermissions: (state) => {
      state.userRole = null;
      state.userPermissions = null;
      state.employee = null;
      state.organization = null;
    },
  },
});

export const {
  btnLoadingStart,
  loadingStart,
  registerSuccess,
  registerFail,
  loginSuccess,
  loginFail,
  logoutSuccess,
  getUserSuccess,
  getUserFail,
  clearError,
  clearMessage,
  setUserPermissions,
  clearUserPermissions,
} = userSlice.actions;

export default userSlice.reducer;
