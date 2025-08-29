import axios from "axios";
import Cookies from "js-cookie";
import {
  loadingStart,
  btnLoadingStart,
  getDepartmentsSuccess,
  getDepartmentsFail,
  addDepartmentSuccess,
  addDepartmentFail,
  updateDepartmentSuccess,
  updateDepartmentFail,
  deleteDepartmentSuccess,
  deleteDepartmentFail,
} from "../reducer/departmentsReducer";

export const getDepartments = ({ organizationId } = {}) => async (dispatch) => {
  try {
    dispatch(loadingStart());
    const token = Cookies.get("token");
    let url = "/api/departments";
    if (organizationId) url += `?organizationId=${organizationId}`;
    const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    dispatch(getDepartmentsSuccess(data));
  } catch (error) {
    dispatch(getDepartmentsFail(error.response?.data?.message || error.message));
  }
};

export const addDepartment = (formdata, clearData) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());
    const token = Cookies.get("token");
    const { data } = await axios.post("/api/departments", formdata, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    dispatch(addDepartmentSuccess(data));
    if (clearData) clearData();
  } catch (error) {
    const errorMessage = error.response?.data?.message === "A department with this name already exists."
        ? "A department with this name already exists in your organization."
        : error.response?.data?.message || error.message;
    dispatch(addDepartmentFail(errorMessage));
  }
};

export const updateDepartment = (id, formdata) => async (dispatch) => {
    try {
        dispatch(btnLoadingStart());
        const token = Cookies.get("token");
        const { data } = await axios.put(`/api/departments?id=${id}`, formdata, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        dispatch(updateDepartmentSuccess(data));
        return true;
    } catch (error) {
        dispatch(updateDepartmentFail(error.response?.data?.message || error.message));
        return false;
    }
};

export const deleteDepartment = (id) => async (dispatch) => {
    try {
        dispatch(loadingStart());
        const token = Cookies.get("token");
        await axios.delete(`/api/departments?id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(deleteDepartmentSuccess(id));
    } catch (error) {
        dispatch(deleteDepartmentFail(error.response?.data?.message || error.message));
    }
};
