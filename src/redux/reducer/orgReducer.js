import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  organization: null,
  loading: false,
  btnLoading: false,
  error: null,
  message: null,
  loaded: false,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    loadingStart: (state) => {
      state.loading = true;
      state.loaded = false;
      state.error = null;
      state.message = null;
    },
    btnLoadingStart: (state) => {
      state.btnLoading = true;
      state.error = null;
      state.message = null;
    },
    getOrganizationSuccess: (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.organization = action.payload.organization || action.payload;
      state.error = null;
    },
    getOrganizationFail: (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.organization = null;
      state.error = action.payload;
    },
    addOrganizationSuccess: (state, action) => {
      state.btnLoading = false;
      state.organization = action.payload.organization;
      state.message = action.payload.message;
      state.error = null;
    },
    addOrganizationFail: (state, action) => {
      state.btnLoading = false;
      state.error = action.payload;
    },
    updateOrganizationSuccess: (state, action) => {
        state.btnLoading = false;
        state.organization = action.payload.organization;
        state.message = action.payload.message;
    },
    updateOrganizationFail: (state, action) => {
        state.btnLoading = false;
        state.error = action.payload;
    },
    deleteOrganizationSuccess: (state) => {
        state.loading = false;
        state.organization = null;
        state.message = "Organization deleted successfully.";
    },
    deleteOrganizationFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    updateCeoSuccess: (state, action) => {
        state.btnLoading = false;
        state.organization = action.payload.organization;
        state.message = action.payload.message;
    },
    updateCeoFail: (state, action) => {
        state.btnLoading = false;
        state.error = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearOrganization: (state) => {
      state.organization = null;
      state.error = null;
      state.message = null;
      state.loading = false;
      state.btnLoading = false;
      state.loaded = false;
    },
  },
});

export const {
  loadingStart,
  btnLoadingStart,
  getOrganizationSuccess,
  getOrganizationFail,
  addOrganizationSuccess,
  addOrganizationFail,
  updateOrganizationSuccess,
  updateOrganizationFail,
  deleteOrganizationSuccess,
  deleteOrganizationFail,
  updateCeoSuccess,
  updateCeoFail,
  clearMessage,
  clearError,
  clearOrganization,
} = organizationSlice.actions;

export default organizationSlice.reducer;
