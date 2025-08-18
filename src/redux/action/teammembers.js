// redux/action/teammembers.js
import axios from "axios";
import Cookies from "js-cookie";
import {
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
} from "../reducer/teammembersReducer";

// Fetch team members. Accepts optional organizationId and departmentId.
export const getTeammembers = ({ organizationId, departmentId } = {}) => async (dispatch) => {
  try {
    dispatch(loadingStart());

    const token = Cookies.get("token");
    let url = "/api/teammembers";
    const params = [];
    if (organizationId) params.push(`organizationId=${organizationId}`);
    if (departmentId) params.push(`departmentId=${departmentId}`);
    if (params.length) url += `?${params.join("&")}`;

    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(getTeammembersSuccess(data));
  } catch (error) {
    dispatch(
      getTeammembersFail(error.response?.data?.message || error.message)
    );
  }
};

// Add a new team member
export const addTeammember = (formdata, clearData) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());
    const token = Cookies.get("token");
    const { data } = await axios.post("/api/teammembers", formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(addTeammemberSuccess(data));
    if (clearData) clearData();
  } catch (error) {
    dispatch(
      addTeammemberFail(error.response?.data?.message || error.message)
    );
  }
};

// Update a team member's details, either manually or via CV upload
export const updateTeammember = (id, formdata, isCvUpload) => async (dispatch) => {
    try {
        dispatch(btnLoadingStart());
        const token = Cookies.get("token");
        
        // FIX: Use the correct endpoint based on whether it's a CV upload or manual edit.
        const url = isCvUpload 
            ? `/api/teammembers/cv?id=${id}` 
            : `/api/teammembers?id=${id}`; // Corrected from /api/teammembers/[id]

        const { data } = await axios.put(url, formdata, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });

        dispatch(updateTeammemberSuccess(data));
        return true; // Indicate success for modal closing
    } catch (error) {
        dispatch(updateTeammemberFail(error.response?.data?.message || error.message));
        return false; // Indicate failure
    }
};

// Delete a team member
export const deleteTeammember = (id) => async (dispatch) => {
    try {
        dispatch(loadingStart());
        const token = Cookies.get("token");
        // FIX: Use the correct endpoint with a query parameter.
        await axios.delete(`/api/teammembers?id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(deleteTeammemberSuccess(id));
    } catch (error) {
        dispatch(deleteTeammemberFail(error.response?.data?.message || error.message));
    }
};

// Invite team members (takes array of teammemberIds)
export const inviteTeammembers = (teammemberIds, clearSelected) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());
    const token = Cookies.get("token");
    const { data } = await axios.post("/api/teammembers/invite", { teammemberIds }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(inviteTeammembersSuccess({ ...data, teammemberIds }));
    if (clearSelected) clearSelected();
  } catch (error) {
    dispatch(
      inviteTeammembersFail(error.response?.data?.message || error.message)
    );
  }
};
