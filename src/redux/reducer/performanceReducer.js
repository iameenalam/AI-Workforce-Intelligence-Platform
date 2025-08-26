// Action Types
export const PERFORMANCE_REQUEST = 'PERFORMANCE_REQUEST';
export const PERFORMANCE_SUCCESS = 'PERFORMANCE_SUCCESS';
export const PERFORMANCE_FAIL = 'PERFORMANCE_FAIL';

export const PERFORMANCE_CREATE_REQUEST = 'PERFORMANCE_CREATE_REQUEST';
export const PERFORMANCE_CREATE_SUCCESS = 'PERFORMANCE_CREATE_SUCCESS';
export const PERFORMANCE_CREATE_FAIL = 'PERFORMANCE_CREATE_FAIL';

export const PERFORMANCE_UPDATE_REQUEST = 'PERFORMANCE_UPDATE_REQUEST';
export const PERFORMANCE_UPDATE_SUCCESS = 'PERFORMANCE_UPDATE_SUCCESS';
export const PERFORMANCE_UPDATE_FAIL = 'PERFORMANCE_UPDATE_FAIL';

export const PERFORMANCE_DELETE_REQUEST = 'PERFORMANCE_DELETE_REQUEST';
export const PERFORMANCE_DELETE_SUCCESS = 'PERFORMANCE_DELETE_SUCCESS';
export const PERFORMANCE_DELETE_FAIL = 'PERFORMANCE_DELETE_FAIL';

export const CLEAR_PERFORMANCE_MESSAGE = 'CLEAR_PERFORMANCE_MESSAGE';
export const CLEAR_PERFORMANCE_ERROR = 'CLEAR_PERFORMANCE_ERROR';

// Initial State
const initialState = {
    loading: false,
    employee: null,
    message: null,
    error: null,
};

// Performance Reducer
export const performanceReducer = (state = initialState, action) => {
    switch (action.type) {
        case PERFORMANCE_REQUEST:
        case PERFORMANCE_CREATE_REQUEST:
        case PERFORMANCE_UPDATE_REQUEST:
        case PERFORMANCE_DELETE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                message: null,
            };

        case PERFORMANCE_SUCCESS:
            return {
                ...state,
                loading: false,
                employee: action.payload,
                error: null,
            };

        case PERFORMANCE_CREATE_SUCCESS:
        case PERFORMANCE_UPDATE_SUCCESS:
            return {
                ...state,
                loading: false,
                employee: action.payload.employee,
                message: action.payload.message,
                error: null,
            };

        case PERFORMANCE_DELETE_SUCCESS:
            return {
                ...state,
                loading: false,
                employee: null,
                message: action.payload.message,
                error: null,
            };

        case PERFORMANCE_FAIL:
        case PERFORMANCE_CREATE_FAIL:
        case PERFORMANCE_UPDATE_FAIL:
        case PERFORMANCE_DELETE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                message: null,
            };

        case CLEAR_PERFORMANCE_MESSAGE:
            return {
                ...state,
                message: null,
            };

        case CLEAR_PERFORMANCE_ERROR:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};
