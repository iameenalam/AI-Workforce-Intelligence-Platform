// redux/action/org.js
import axios from "axios";
import Cookies from "js-cookie";
import {
  loadingStart,
  btnLoadingStart,
  getOrganizationSuccess,
  getOrganizationFail,
  addOrganizationSuccess,
  addOrganizationFail,
  updateOrganizationSuccess,
  updateOrganizationFail,
  deleteOrganizationSuccess,
  deleteOrganizationFail,
  updateCeoSuccess,
  updateCeoFail,
} from "../reducer/orgReducer";

// Fetch organization (current user's org)
export const getOrganization = () => async (dispatch) => {
  try {
    dispatch(loadingStart());
    const token = Cookies.get("token");
    if (!token) {
      dispatch(getOrganizationSuccess({ organization: null }));
      return;
    }
    const { data } = await axios.get("/api/organization", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(getOrganizationSuccess(data));
  } catch (error) {
    dispatch(
      getOrganizationFail(error.response?.data?.message || error.message)
    );
  }
};

export const addOrganization = (formdata, clearData) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());
    const token = Cookies.get("token");
    const { data } = await axios.post("/api/organization", formdata, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(addOrganizationSuccess(data));
    if (clearData) clearData();
  } catch (error) {
    const errorMessage =
      error.response?.data?.message === "User already has an organization"
        ? "You have already created an organization."
        : error.response?.data?.message || error.message;
    dispatch(addOrganizationFail(errorMessage));
  }
};

export const updateOrganization = (formdata) => async (dispatch) => {
    try {
        dispatch(btnLoadingStart());
        const token = Cookies.get("token");
        const { data } = await axios.put(`/api/organization`, formdata, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        dispatch(updateOrganizationSuccess(data));
        return true;
    } catch (error) {
        dispatch(updateOrganizationFail(error.response?.data?.message || error.message));
        return false;
    }
};

export const deleteOrganization = () => async (dispatch) => {
    try {
        dispatch(loadingStart());
        const token = Cookies.get("token");
        await axios.delete(`/api/organization`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(deleteOrganizationSuccess());
    } catch (error) {
        dispatch(deleteOrganizationFail(error.response?.data?.message || error.message));
    }
};

export const updateCeo = (id, formdata, isCvUpload) => async (dispatch) => {
    try {
        dispatch(btnLoadingStart());
        const token = Cookies.get("token");
        
        const url = isCvUpload 
            ? `/api/organization/cv?id=${id}` 
            : `/api/organization/ceo/${id}`;

        const { data } = await axios.put(url, formdata, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });

        dispatch(updateCeoSuccess(data));
        return true;
    } catch (error) {
        dispatch(updateCeoFail(error.response?.data?.message || error.message));
        return false;
    }
};
