import {
  EMPLOYEES_REQUEST,
  EMPLOYEES_SUCCESS,
  EMPLOYEES_FAIL,
  EMPLOYEES_CLEAR_MESSAGE,
  EMPLOYEE_UPDATE_SUCCESS,
  EMPLOYEE_DELETE_SUCCESS,
} from "../action/employees";

const initialState = {
  employees: [],
  loading: false,
  error: null,
  message: null,
};

export const employeesReducer = (state = initialState, action) => {
  switch (action.type) {
    case EMPLOYEES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case EMPLOYEES_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: action.payload,
        error: null,
      };

    case EMPLOYEES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case EMPLOYEE_UPDATE_SUCCESS:
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp._id === action.payload._id ? action.payload : emp
        ),
        message: "Employee updated successfully",
      };

    case EMPLOYEE_DELETE_SUCCESS:
      return {
        ...state,
        employees: state.employees.filter(emp => emp._id !== action.payload),
        message: "Employee deleted successfully",
        loading: false,
        error: null
      };

    case EMPLOYEES_CLEAR_MESSAGE:
      return {
        ...state,
        message: null,
        error: null,
      };

    default:
      return state;
  }
};
