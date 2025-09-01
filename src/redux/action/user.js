import axios from "axios";
import Cookies from "js-cookie";
import {
  loadingStart,
  btnLoadingStart,
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
} from "../reducer/userReducer";

export const registerUser = (formdata) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());

    const { data } = await axios.post("/api/user/register", formdata);

    Cookies.set("token", data.token, { expires: 5, secure: true, path: "/" });

    dispatch(registerSuccess(data));
  } catch (error) {
    dispatch(registerFail(error.response?.data?.message || error.message));
  }
};

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());

    const { data } = await axios.post("/api/user/login", { email, password });

    Cookies.set("token", data.token, { expires: 5, secure: true, path: "/" });

    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFail(error.response?.data?.message || error.message));
  }
};

export const loginWithGoogle = (tokenId) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());

    const { data } = await axios.post("/api/user/login", { tokenId });

    Cookies.set("token", data.token, { expires: 5, secure: true, path: "/" });

    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFail(error.response?.data?.message || error.message));
  }
};

export const signupWithGoogle = (tokenId) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());

    const { data } = await axios.post("/api/user/login", { tokenId });

    Cookies.set("token", data.token, { expires: 5, secure: true, path: "/" });

    dispatch(registerSuccess(data));
  } catch (error) {
    dispatch(registerFail(error.response?.data?.message || error.message));
  }
};

export const getUser = () => async (dispatch) => {
  try {
    dispatch(loadingStart());

    const token = Cookies.get("token");
    if (!token) {
      dispatch(getUserFail("No token found"));
      return;
    }

    const { data } = await axios.get("/api/user/myprofile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(getUserSuccess(data));
  } catch (error) {
    dispatch(getUserFail(error.response?.data?.message || error.message));
  }
};

export const logoutUser = () => (dispatch) => {
  Cookies.remove("token", { path: "/" });
  dispatch(logoutSuccess());
};

export const clearUserError = () => (dispatch) => {
  dispatch(clearError());
};

export const clearUserMessage = () => (dispatch) => {
  dispatch(clearMessage());
};

export const getUserPermissions = () => async (dispatch) => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      dispatch(clearUserPermissions());
      return;
    }

    const { data } = await axios.get("/api/user/permissions", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("User permissions loaded:", {
      role: data.role,
      hasEmployee: !!data.employee,
      hasOrganization: !!data.organization,
      organizationName: data.organization?.name
    });

    dispatch(setUserPermissions({
      role: data.role,
      permissions: data.permissions,
      employee: data.employee,
      organization: data.organization,
    }));

    return data;
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    dispatch(clearUserPermissions());
    throw error;
  }
};
