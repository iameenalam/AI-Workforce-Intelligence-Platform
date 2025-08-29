import { createSlice } from "@reduxjs/toolkit";
import { deleteOrganizationSuccess } from "./orgReducer";

const initialState = {
  departments: [],
  loading: false,
  btnLoading: false,
  error: null,
  message: null,
};

const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    loadingStart: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    btnLoadingStart: (state) => {
      state.btnLoading = true;
      state.error = null;
      state.message = null;
    },
    getDepartmentsSuccess: (state, action) => {
      state.loading = false;
      state.departments = action.payload;
    },
    getDepartmentsFail: (state, action) => {
      state.loading = false;
      state.departments = [];
      state.error = action.payload;
    },
    addDepartmentSuccess: (state, action) => {
      state.btnLoading = false;
      state.departments.push(action.payload.department);
      state.message = action.payload.message;
      state.error = null;
    },
    addDepartmentFail: (state, action) => {
      state.btnLoading = false;
      state.error = action.payload;
    },
    updateDepartmentSuccess: (state, action) => {
        state.btnLoading = false;
        state.message = action.payload.message;
        const index = state.departments.findIndex(d => d._id === action.payload.department._id);
        if (index !== -1) {
            state.departments[index] = action.payload.department;
        }
    },
    updateDepartmentFail: (state, action) => {
        state.btnLoading = false;
        state.error = action.payload;
    },
    deleteDepartmentSuccess: (state, action) => {
        state.loading = false;
        state.message = "Department deleted successfully.";
        state.departments = state.departments.filter(d => d._id !== action.payload);
    },
    deleteDepartmentFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearDepartments: (state) => {
      state.departments = [];
      state.error = null;
      state.message = null;
      state.loading = false;
      state.btnLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteOrganizationSuccess, (state) => {
      state.departments = [];
      state.loading = false;
      state.btnLoading = false;
      state.error = null;
      state.message = null;
    });
  },
});

export const {
  loadingStart,
  btnLoadingStart,
  getDepartmentsSuccess,
  getDepartmentsFail,
  addDepartmentSuccess,
  addDepartmentFail,
  updateDepartmentSuccess,
  updateDepartmentFail,
  deleteDepartmentSuccess,
  deleteDepartmentFail,
  clearMessage,
  clearError,
  clearDepartments,
} = departmentsSlice.actions;

export default departmentsSlice.reducer;
