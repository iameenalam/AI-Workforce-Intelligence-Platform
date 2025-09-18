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

    // Fetch user permissions immediately after login
    try {
      const permissionsResponse = await axios.get("/api/user/permissions", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      
      // Dispatch both login success and permissions together
      dispatch(loginSuccess(data));
      dispatch(setUserPermissions(permissionsResponse.data));
    } catch (error) {
      console.error("Error fetching initial permissions:", error);
    }
  } catch (error) {
    dispatch(loginFail(error.response?.data?.message || error.message));
  }
};

export const loginWithGoogle = (tokenId) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());

    const { data } = await axios.post("/api/user/login", { tokenId });

    Cookies.set("token", data.token, { expires: 5, secure: true, path: "/" });

    // Fetch user permissions immediately after login
    try {
      const permissionsResponse = await axios.get("/api/user/permissions", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      
      // Dispatch both login success and permissions together
      dispatch(loginSuccess(data));
      dispatch(setUserPermissions(permissionsResponse.data));
    } catch (error) {
      console.error("Error fetching initial permissions:", error);
      dispatch(loginSuccess(data));
    }
  } catch (error) {
    dispatch(loginFail(error.response?.data?.message || error.message));
  }
};

export const signupWithGoogle = (tokenId) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());

    const { data } = await axios.post("/api/user/login", { tokenId });

    Cookies.set("token", data.token, { expires: 5, secure: true, path: "/" });

    // Fetch user permissions immediately after signup
    try {
      const permissionsResponse = await axios.get("/api/user/permissions", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      
      // Dispatch both register success and permissions together
      dispatch(registerSuccess(data));
      dispatch(setUserPermissions(permissionsResponse.data));
    } catch (error) {
      console.error("Error fetching initial permissions:", error);
      dispatch(registerSuccess(data));
    }
  } catch (error) {
    dispatch(registerFail(error.response?.data?.message || error.message));
  }
};

export const getUser = () => async (dispatch) => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      dispatch(getUserFail("Please Login"));
      return;
    }

    // Fetch user profile and permissions in parallel
    const [profileResponse, permissionsResponse] = await Promise.all([
      axios.get("/api/user/myprofile", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("/api/user/permissions", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    dispatch(getUserSuccess(profileResponse.data));
    dispatch(setUserPermissions(permissionsResponse.data));
    
    return permissionsResponse.data; // Return permissions data for the hook
  } catch (error) {
    dispatch(getUserFail(error.response?.data?.message || error.message));
    throw error; // Re-throw for error handling in the hook
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
      throw new Error("No token found");
    }

    const { data } = await axios.get("/api/user/permissions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    dispatch(setUserPermissions(data));
    return data;
  } catch (error) {
    console.error("Error fetching permissions:", error);
    throw error;
  }
};
