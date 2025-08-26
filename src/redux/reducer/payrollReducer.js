// Action Types
export const PAYROLL_REQUEST = 'PAYROLL_REQUEST';
export const PAYROLL_SUCCESS = 'PAYROLL_SUCCESS';
export const PAYROLL_FAIL = 'PAYROLL_FAIL';

export const PAYROLL_CREATE_REQUEST = 'PAYROLL_CREATE_REQUEST';
export const PAYROLL_CREATE_SUCCESS = 'PAYROLL_CREATE_SUCCESS';
export const PAYROLL_CREATE_FAIL = 'PAYROLL_CREATE_FAIL';

export const PAYROLL_UPDATE_REQUEST = 'PAYROLL_UPDATE_REQUEST';
export const PAYROLL_UPDATE_SUCCESS = 'PAYROLL_UPDATE_SUCCESS';
export const PAYROLL_UPDATE_FAIL = 'PAYROLL_UPDATE_FAIL';

export const PAYROLL_DELETE_REQUEST = 'PAYROLL_DELETE_REQUEST';
export const PAYROLL_DELETE_SUCCESS = 'PAYROLL_DELETE_SUCCESS';
export const PAYROLL_DELETE_FAIL = 'PAYROLL_DELETE_FAIL';

export const CLEAR_PAYROLL_MESSAGE = 'CLEAR_PAYROLL_MESSAGE';
export const CLEAR_PAYROLL_ERROR = 'CLEAR_PAYROLL_ERROR';

// Initial State
const initialState = {
    loading: false,
    employee: null,
    message: null,
    error: null,
};

// Payroll Reducer
export const payrollReducer = (state = initialState, action) => {
    switch (action.type) {
        case PAYROLL_REQUEST:
        case PAYROLL_CREATE_REQUEST:
        case PAYROLL_UPDATE_REQUEST:
        case PAYROLL_DELETE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                message: null,
            };

        case PAYROLL_SUCCESS:
            return {
                ...state,
                loading: false,
                employee: action.payload,
                error: null,
            };

        case PAYROLL_CREATE_SUCCESS:
        case PAYROLL_UPDATE_SUCCESS:
            return {
                ...state,
                loading: false,
                employee: action.payload.employee,
                message: action.payload.message,
                error: null,
            };

        case PAYROLL_DELETE_SUCCESS:
            return {
                ...state,
                loading: false,
                employee: null,
                message: action.payload.message,
                error: null,
            };

        case PAYROLL_FAIL:
        case PAYROLL_CREATE_FAIL:
        case PAYROLL_UPDATE_FAIL:
        case PAYROLL_DELETE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                message: null,
            };

        case CLEAR_PAYROLL_MESSAGE:
            return {
                ...state,
                message: null,
            };

        case CLEAR_PAYROLL_ERROR:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};
