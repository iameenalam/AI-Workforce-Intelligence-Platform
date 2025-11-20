import axios from "axios";
import Cookies from "js-cookie";

export const EMPLOYEES_REQUEST = "EMPLOYEES_REQUEST";
export const EMPLOYEES_SUCCESS = "EMPLOYEES_SUCCESS";
export const EMPLOYEES_FAIL = "EMPLOYEES_FAIL";
export const EMPLOYEES_CLEAR_MESSAGE = "EMPLOYEES_CLEAR_MESSAGE";
export const EMPLOYEE_UPDATE_SUCCESS = "EMPLOYEE_UPDATE_SUCCESS";
export const EMPLOYEE_DELETE_SUCCESS = "EMPLOYEE_DELETE_SUCCESS";

export const getEmployees = () => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEES_REQUEST });
    
    const token = Cookies.get("token");
    const { data } = await axios.get("/api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({
      type: EMPLOYEES_SUCCESS,
      payload: data.employees || [],
    });
  } catch (error) {
    dispatch({
      type: EMPLOYEES_FAIL,
      payload: error.response?.data?.message || "Failed to fetch employees",
    });
  }
};

export const updateEmployee = (employeeData) => async (dispatch) => {
  try {
    const token = Cookies.get("token");
    const { data } = await axios.put("/api/employees", employeeData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({
      type: EMPLOYEE_UPDATE_SUCCESS,
      payload: data.employee,
    });

    return data;
  } catch (error) {
    dispatch({
      type: EMPLOYEES_FAIL,
      payload: error.response?.data?.message || "Failed to update employee",
    });
    throw error;
  }
};

export const updateEmployeeProfile = (employeeId, profileData) => async (dispatch) => {
  try {
    const token = Cookies.get("token");
    const { data } = await axios.put(`/api/employees/${employeeId}`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    dispatch({
      type: EMPLOYEE_UPDATE_SUCCESS,
      payload: data.employee,
    });

    return data.employee;
  } catch (error) {
    dispatch({
      type: EMPLOYEES_FAIL,
      payload: error.response?.data?.message || "Failed to update employee profile",
    });
    throw error;
  }
};

export const deleteEmployee = (employeeId) => async (dispatch) => {
  try {
    const token = Cookies.get("token");
    await axios.delete(`/api/employees?id=${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Optimistically update the UI
    dispatch({
      type: EMPLOYEE_DELETE_SUCCESS,
      payload: employeeId,
    });

    // Return success message
    return { message: "Employee deleted successfully" };
  } catch (error) {
    dispatch({
      type: EMPLOYEES_FAIL,
      payload: error.response?.data?.message || "Failed to delete employee",
    });
    throw error;
  }
};

export const clearEmployeesMessage = () => ({
  type: EMPLOYEES_CLEAR_MESSAGE,
});

export const addEmployee = (employeeData, onSuccess) => async (dispatch) => {
  try {
    dispatch({ type: EMPLOYEES_REQUEST });
    const token = Cookies.get("token");
    const { data } = await axios.post("/api/employees", employeeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    dispatch({
      type: EMPLOYEES_SUCCESS,
      payload: [...(data.employees || [])],
    });
    
    if (onSuccess) onSuccess();
    return true;
  } catch (error) {
    dispatch({
      type: EMPLOYEES_FAIL,
      payload: error.response?.data?.message || "Failed to add employee",
    });
    return false;
  }
};
