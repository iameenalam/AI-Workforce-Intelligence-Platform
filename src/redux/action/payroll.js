import axios from "axios";
import {
    PAYROLL_REQUEST,
    PAYROLL_SUCCESS,
    PAYROLL_FAIL,
    PAYROLL_CREATE_REQUEST,
    PAYROLL_CREATE_SUCCESS,
    PAYROLL_CREATE_FAIL,
    PAYROLL_UPDATE_REQUEST,
    PAYROLL_UPDATE_SUCCESS,
    PAYROLL_UPDATE_FAIL,
    PAYROLL_DELETE_REQUEST,
    PAYROLL_DELETE_SUCCESS,
    PAYROLL_DELETE_FAIL,
    CLEAR_PAYROLL_MESSAGE,
    CLEAR_PAYROLL_ERROR
} from "../reducer/payrollReducer";

// Get payroll for all employees or a specific employee
export const getPayroll = (employeeId = null) => async (dispatch) => {
    try {
        dispatch({ type: PAYROLL_REQUEST });
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        let url = "/api/employees/payroll";
        if (employeeId) url += `?employeeId=${employeeId}`;
        const { data } = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch({ type: PAYROLL_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: PAYROLL_FAIL, payload: error.response?.data?.message || error.message });
    }
};

// Create or update payroll for an employee
export const createOrUpdatePayroll = (payload) => async (dispatch) => {
    try {
        dispatch({ type: PAYROLL_CREATE_REQUEST });
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        const { data } = await axios.post("/api/employees/payroll", payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Use only the correct message for create or update
        let message = 'Payroll updated successfully';
        if (data.created) message = 'Payroll created successfully';
        if (data.updated) message = 'Payroll updated successfully';
        dispatch({ type: PAYROLL_CREATE_SUCCESS, payload: { employee: data.employee, message } });
    } catch (error) {
        dispatch({ type: PAYROLL_CREATE_FAIL, payload: error.response?.data?.message || error.message });
    }
};

// Update payroll for an employee (PUT)
export const updatePayroll = (payload) => async (dispatch) => {
    try {
        dispatch({ type: PAYROLL_UPDATE_REQUEST });
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        const { data } = await axios.put("/api/employees/payroll", payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Always use the update message
        dispatch({ type: PAYROLL_UPDATE_SUCCESS, payload: { employee: data.employee, message: 'Payroll updated successfully' } });
    } catch (error) {
        dispatch({ type: PAYROLL_UPDATE_FAIL, payload: error.response?.data?.message || error.message });
    }
};

// Delete payroll for an employee
export const deletePayroll = (employeeId) => async (dispatch) => {
    try {
        dispatch({ type: PAYROLL_DELETE_REQUEST });
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        await axios.delete(`/api/employees/payroll?employeeId=${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Pass employeeId for instant Redux update
        dispatch({ type: PAYROLL_DELETE_SUCCESS, payload: { message: 'Payroll deleted successfully', employeeId } });
    } catch (error) {
        let errMsg = error.response?.data?.message || error.message;
        if (errMsg.toLowerCase().includes('not found')) {
            dispatch({ type: PAYROLL_DELETE_SUCCESS, payload: { message: 'Payroll deleted successfully', employeeId } });
        } else {
            dispatch({ type: PAYROLL_DELETE_FAIL, payload: errMsg });
        }
    }
};

export const clearPayrollMessage = () => ({ type: CLEAR_PAYROLL_MESSAGE });
export const clearPayrollError = () => ({ type: CLEAR_PAYROLL_ERROR });
