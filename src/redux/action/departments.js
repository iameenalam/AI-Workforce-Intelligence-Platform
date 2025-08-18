// redux/action/departments.js
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
  updateHodSuccess,
  updateHodFail,
  deleteHodSuccess,
  deleteHodFail,
} from "../reducer/departmentsReducer";

// Fetch departments. Accepts optional organizationId.
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

// Add a new department
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

// Update department details (name, subfunctions etc.)
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

// Delete an entire department
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

// Update HOD details, either manually or via CV upload
export const updateHod = (id, formdata, isCvUpload) => async (dispatch) => {
    try {
        dispatch(btnLoadingStart());
        const token = Cookies.get("token");
        
        const url = isCvUpload 
            ? `/api/departments/cv?id=${id}` 
            : `/api/departments/hod/${id}`;

        const { data } = await axios.put(url, formdata, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });

        dispatch(updateHodSuccess(data));
        return true; // FIX: Return true on success
    } catch (error) {
        dispatch(updateHodFail(error.response?.data?.message || error.message));
        return false; // FIX: Return false on failure
    }
};

// "Delete" an HOD by clearing their details from the department
export const deleteHod = (id) => async (dispatch) => {
    try {
        dispatch(loadingStart());
        const token = Cookies.get("token");
        const { data } = await axios.delete(`/api/departments/hod/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(deleteHodSuccess(data));
    } catch (error) {
        dispatch(deleteHodFail(error.response?.data?.message || error.message));
    }
};
