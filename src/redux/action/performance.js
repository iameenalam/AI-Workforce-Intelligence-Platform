import {
    PERFORMANCE_REQUEST,
    PERFORMANCE_SUCCESS,
    PERFORMANCE_FAIL,
    PERFORMANCE_CREATE_REQUEST,
    PERFORMANCE_CREATE_SUCCESS,
    PERFORMANCE_CREATE_FAIL,
    PERFORMANCE_UPDATE_REQUEST,
    PERFORMANCE_UPDATE_SUCCESS,
    PERFORMANCE_UPDATE_FAIL,
    PERFORMANCE_DELETE_REQUEST,
    PERFORMANCE_DELETE_SUCCESS,
    PERFORMANCE_DELETE_FAIL,
    CLEAR_PERFORMANCE_MESSAGE,
    CLEAR_PERFORMANCE_ERROR
} from "../reducer/performanceReducer";

// Get performance data for an employee
export const getPerformance = (employeeId) => async (dispatch) => {
    try {
        dispatch({ type: PERFORMANCE_REQUEST });

        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        const response = await fetch(`/api/employees/performance?employeeId=${employeeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            dispatch({
                type: PERFORMANCE_SUCCESS,
                payload: data.employee
            });
        } else {
            dispatch({
                type: PERFORMANCE_FAIL,
                payload: data.message || 'Failed to fetch performance data'
            });
        }
    } catch (error) {
        dispatch({
            type: PERFORMANCE_FAIL,
            payload: error.message || 'Network error occurred'
        });
    }
};

// Create performance data for an employee
export const createPerformance = (performanceData) => async (dispatch) => {
    try {
        dispatch({ type: PERFORMANCE_CREATE_REQUEST });
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        const response = await fetch('/api/employees/performance', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(performanceData),
        });
        const data = await response.json();
        if (response.ok) {
            dispatch({ type: PERFORMANCE_CREATE_SUCCESS, payload: { employee: data.employee, message: 'Performance review created successfully' } });
        } else {
            let errMsg = data.message || 'Failed to create performance review';
            if (errMsg.toLowerCase().includes('not found')) {
                dispatch({ type: PERFORMANCE_DELETE_SUCCESS, payload: { message: 'Performance review deleted successfully', employeeId: performanceData.employeeId } });
            } else {
                dispatch({ type: PERFORMANCE_CREATE_FAIL, payload: errMsg });
            }
        }
    } catch (error) {
        dispatch({ type: PERFORMANCE_CREATE_FAIL, payload: error.message || 'Network error occurred' });
    }
};

// Update performance data for an employee
export const updatePerformance = (performanceData) => async (dispatch) => {
    try {
        dispatch({ type: PERFORMANCE_UPDATE_REQUEST });
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        const response = await fetch('/api/employees/performance', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(performanceData),
        });
        const data = await response.json();
        if (response.ok) {
            dispatch({ type: PERFORMANCE_UPDATE_SUCCESS, payload: { employee: data.employee, message: 'Performance review updated successfully' } });
        } else {
            let errMsg = data.message || 'Failed to update performance review';
            if (errMsg.toLowerCase().includes('not found')) {
                dispatch({ type: PERFORMANCE_DELETE_SUCCESS, payload: { message: 'Performance review deleted successfully', employeeId: performanceData.employeeId } });
            } else {
                dispatch({ type: PERFORMANCE_UPDATE_FAIL, payload: errMsg });
            }
        }
    } catch (error) {
        dispatch({ type: PERFORMANCE_UPDATE_FAIL, payload: error.message || 'Network error occurred' });
    }
};

// Delete performance data for an employee
export const deletePerformance = (employeeId) => async (dispatch) => {
    try {
        dispatch({ type: PERFORMANCE_DELETE_REQUEST });
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        const response = await fetch(`/api/employees/performance?employeeId=${employeeId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            dispatch({ type: PERFORMANCE_DELETE_SUCCESS, payload: { message: 'Performance review deleted successfully', employeeId } });
        } else {
            let errMsg = data.message || 'Failed to delete performance review';
            if (errMsg.toLowerCase().includes('not found')) {
                dispatch({ type: PERFORMANCE_DELETE_SUCCESS, payload: { message: 'Performance review deleted successfully', employeeId } });
            } else {
                dispatch({ type: PERFORMANCE_DELETE_FAIL, payload: errMsg });
            }
        }
    } catch (error) {
        dispatch({ type: PERFORMANCE_DELETE_FAIL, payload: error.message || 'Network error occurred' });
    }
};

// Clear performance message
export const clearPerformanceMessage = () => (dispatch) => {
    dispatch({ type: CLEAR_PERFORMANCE_MESSAGE });
};

// Clear performance error
export const clearPerformanceError = () => (dispatch) => {
    dispatch({ type: CLEAR_PERFORMANCE_ERROR });
};
