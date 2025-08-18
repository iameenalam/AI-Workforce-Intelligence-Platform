import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducer/userReducer";
import organizationReducer from "./reducer/orgReducer";
import teammembersReducer from "./reducer/teammembersReducer";
import departmentsReducer from "./reducer/departmentsReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    organization: organizationReducer,
    teammembers: teammembersReducer,
    departments: departmentsReducer,
  },
});

export default store;