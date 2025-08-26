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

// Get payroll data for an employee
export const getPayroll = (employeeId) => async (dispatch) => {
    try {
        dispatch({ type: PAYROLL_REQUEST });

        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        const response = await fetch(`/api/employees/payroll?employeeId=${employeeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            dispatch({
                type: PAYROLL_SUCCESS,
                payload: data.employee
            });
        } else {
            dispatch({
                type: PAYROLL_FAIL,
                payload: data.message || 'Failed to fetch payroll data'
            });
        }
    } catch (error) {
        dispatch({
            type: PAYROLL_FAIL,
            payload: error.message || 'Network error occurred'
        });
    }
};

// Create payroll data for an employee
export const createPayroll = (payrollData) => async (dispatch) => {
    try {
        dispatch({ type: PAYROLL_CREATE_REQUEST });

        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        const response = await fetch('/api/employees/payroll', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payrollData),
        });

        const data = await response.json();

        if (response.ok) {
            dispatch({
                type: PAYROLL_CREATE_SUCCESS,
                payload: {
                    employee: data.employee,
                    message: data.message
                }
            });
        } else {
            dispatch({
                type: PAYROLL_CREATE_FAIL,
                payload: data.message || 'Failed to create payroll data'
            });
        }
    } catch (error) {
        dispatch({
            type: PAYROLL_CREATE_FAIL,
            payload: error.message || 'Network error occurred'
        });
    }
};

// Update payroll data for an employee
export const updatePayroll = (payrollData) => async (dispatch) => {
    try {
        dispatch({ type: PAYROLL_UPDATE_REQUEST });

        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        const response = await fetch('/api/employees/payroll', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payrollData),
        });

        const data = await response.json();

        if (response.ok) {
            dispatch({
                type: PAYROLL_UPDATE_SUCCESS,
                payload: {
                    employee: data.employee,
                    message: data.message
                }
            });
        } else {
            dispatch({
                type: PAYROLL_UPDATE_FAIL,
                payload: data.message || 'Failed to update payroll data'
            });
        }
    } catch (error) {
        dispatch({
            type: PAYROLL_UPDATE_FAIL,
            payload: error.message || 'Network error occurred'
        });
    }
};

// Delete payroll data for an employee
export const deletePayroll = (employeeId) => async (dispatch) => {
    try {
        dispatch({ type: PAYROLL_DELETE_REQUEST });

        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        const response = await fetch(`/api/employees/payroll?employeeId=${employeeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            dispatch({
                type: PAYROLL_DELETE_SUCCESS,
                payload: {
                    employeeId,
                    message: data.message
                }
            });
        } else {
            dispatch({
                type: PAYROLL_DELETE_FAIL,
                payload: data.message || 'Failed to delete payroll data'
            });
        }
    } catch (error) {
        dispatch({
            type: PAYROLL_DELETE_FAIL,
            payload: error.message || 'Network error occurred'
        });
    }
};

// Clear payroll message
export const clearPayrollMessage = () => (dispatch) => {
    dispatch({ type: CLEAR_PAYROLL_MESSAGE });
};

// Clear payroll error
export const clearPayrollError = () => (dispatch) => {
    dispatch({ type: CLEAR_PAYROLL_ERROR });
};
