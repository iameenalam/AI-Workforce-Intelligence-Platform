import axios from "axios";
import Cookies from "js-cookie";

// Action types
export const EMPLOYEES_REQUEST = "EMPLOYEES_REQUEST";
export const EMPLOYEES_SUCCESS = "EMPLOYEES_SUCCESS";
export const EMPLOYEES_FAIL = "EMPLOYEES_FAIL";
export const EMPLOYEES_CLEAR_MESSAGE = "EMPLOYEES_CLEAR_MESSAGE";
export const EMPLOYEE_UPDATE_SUCCESS = "EMPLOYEE_UPDATE_SUCCESS";
export const EMPLOYEE_DELETE_SUCCESS = "EMPLOYEE_DELETE_SUCCESS";

// Get all employees
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

// Update employee role/department
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

// Update employee profile (name, email, experience, etc.)
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

// Delete employee
export const deleteEmployee = (employeeId) => async (dispatch) => {
  try {
    console.log("Deleting employee with ID:", employeeId);
    const token = Cookies.get("token");
    const response = await axios.delete(`/api/employees/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Delete response:", response.data);

    dispatch({
      type: EMPLOYEE_DELETE_SUCCESS,
      payload: employeeId,
    });

    // Show success toast here to avoid duplicates
    const toast = (await import('react-hot-toast')).default;
    toast.success("Employee deleted successfully");
  } catch (error) {
    console.error("Delete employee error:", error);
    dispatch({
      type: EMPLOYEES_FAIL,
      payload: error.response?.data?.message || "Failed to delete employee",
    });
    throw error;
  }
};

// Clear messages
export const clearEmployeesMessage = () => ({
  type: EMPLOYEES_CLEAR_MESSAGE,
});
