import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducer/userReducer";
import organizationReducer from "./reducer/orgReducer";
import departmentsReducer from "./reducer/departmentsReducer";
import { employeesReducer } from "./reducer/employeesReducer";
import { payrollReducer } from "./reducer/payrollReducer";
import { performanceReducer } from "./reducer/performanceReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    organization: organizationReducer,
    departments: departmentsReducer,
    employees: employeesReducer,
    payroll: payrollReducer,
    performance: performanceReducer,
  },
});

export default store;