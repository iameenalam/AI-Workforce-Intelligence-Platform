// redux/reducers/teammembersReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teammembers: [],
  loading: false,
  btnLoading: false,
  error: null,
  message: null,
};

const teammembersSlice = createSlice({
  name: "teammembers",
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
    getTeammembersSuccess: (state, action) => {
      state.loading = false;
      state.teammembers = action.payload;
    },
    getTeammembersFail: (state, action) => {
      state.loading = false;
      state.teammembers = [];
      state.error = action.payload;
    },
    addTeammemberSuccess: (state, action) => {
      state.btnLoading = false;
      state.teammembers.push(action.payload.teammember);
      state.message = action.payload.message;
      state.error = null;
    },
    addTeammemberFail: (state, action) => {
      state.btnLoading = false;
      state.error = action.payload;
    },
    // NEW: Reducers for updating a team member
    updateTeammemberSuccess: (state, action) => {
      state.btnLoading = false;
      state.message = action.payload.message;
      const index = state.teammembers.findIndex(tm => tm._id === action.payload.teammember._id);
      if (index !== -1) {
          state.teammembers[index] = action.payload.teammember;
      }
    },
    updateTeammemberFail: (state, action) => {
        state.btnLoading = false;
        state.error = action.payload;
    },
    // NEW: Reducers for deleting a team member
    deleteTeammemberSuccess: (state, action) => {
        state.loading = false;
        state.message = "Team member deleted successfully.";
        state.teammembers = state.teammembers.filter(tm => tm._id !== action.payload);
    },
    deleteTeammemberFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    inviteTeammembersSuccess: (state, action) => {
      state.btnLoading = false;
      const invitedIds = action.payload.teammemberIds || [];
      state.teammembers = state.teammembers.map((tm) =>
        invitedIds.includes(tm._id)
          ? { ...tm, invited: true }
          : tm
      );
      state.message = action.payload.message;
      state.error = null;
    },
    inviteTeammembersFail: (state, action) => {
      state.btnLoading = false;
      state.error = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearTeammembers: (state) => {
      state.teammembers = [];
      state.error = null;
      state.message = null;
      state.loading = false;
      state.btnLoading = false;
    },
  },
});

export const {
  loadingStart,
  btnLoadingStart,
  getTeammembersSuccess,
  getTeammembersFail,
  addTeammemberSuccess,
  addTeammemberFail,
  updateTeammemberSuccess,
  updateTeammemberFail,
  deleteTeammemberSuccess,
  deleteTeammemberFail,
  inviteTeammembersSuccess,
  inviteTeammembersFail,
  clearMessage,
  clearError,
  clearTeammembers,
} = teammembersSlice.actions;

export default teammembersSlice.reducer;
