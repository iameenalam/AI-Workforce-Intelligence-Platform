"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { inviteTeammembers } from "@/redux/action/teammembers";

export default function InvForm({ onClose }) {
  const dispatch = useDispatch();
  const { btnLoading, message } = useSelector((state) => state.teammembers);

  const [departments, setDepartments] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [subExpanded, setSubExpanded] = useState({});
  const [members, setMembers] = useState({});
  const [teammembers, setTeammembers] = useState({});
  const [selected, setSelected] = useState([]);
  const [pending, setPending] = useState({});

  useEffect(() => {
    if (message && !btnLoading) {
      const nextPending = { ...pending };
      selected.forEach((id) => {
        for (const key in nextPending) {
          nextPending[key] = nextPending[key].filter((m) => m._localId !== id);
        }
      });
      setPending(nextPending);
      setSelected([]);
      onClose?.();
    }
  }, [message, btnLoading, onClose, selected, pending]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const token = Cookies.get("token");
      const { data } = await axios.get("/api/departments/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  const fetchTeammembers = async (departmentId, subIdx) => {
    const token = Cookies.get("token");
    const { data } = await axios.get(
      `/api/teammembers?departmentId=${departmentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTeammembers((prev) => ({
      ...prev,
      [`${departmentId}-${subIdx}`]: data.filter(
        (tm) => tm.subfunctionIndex === subIdx
      ),
    }));
  };

  const handleExpand = (deptId) =>
    setExpanded((prev) => ({ ...prev, [deptId]: !prev[deptId] }));
  const handleSubExpand = (deptId, subIdx) => {
    setSubExpanded((prev) => ({
      ...prev,
      [`${deptId}-${subIdx}`]: !prev[`${deptId}-${subIdx}`],
    }));
    if (!subExpanded[`${deptId}-${subIdx}`]) fetchTeammembers(deptId, subIdx);
  };

  const handleMemberChange = (deptId, subIdx, field, value) => {
    setMembers((prev) => ({
      ...prev,
      [`${deptId}-${subIdx}`]: {
        ...prev[`${deptId}-${subIdx}`],
        [field]: value,
      },
    }));
  };

  const handleAddMember = (deptId, subIdx) => {
    const member = members[`${deptId}-${subIdx}`];
    if (!member?.name || !member?.email) return alert("Fill all fields");
    const localId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const key = `${deptId}-${subIdx}`;
    const newEntry = {
      ...member,
      _localId: localId,
      department: deptId,
      subfunctionIndex: subIdx,
    };
    const nextPending = {
      ...pending,
      [key]: [...(pending[key] || []), newEntry],
    };
    setPending(nextPending);
    setMembers((prev) => ({ ...prev, [key]: {} }));
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleInvite = async () => {
    const toInvite = [];
    Object.entries(pending).forEach(([key, arr]) => {
      arr.forEach((m) => {
        if (selected.includes(m._localId)) {
          toInvite.push(m);
        }
      });
    });
    if (toInvite.length === 0) return alert("Select teammembers to invite.");
    const token = Cookies.get("token");
    const createdIds = [];
    for (const member of toInvite) {
      try {
        const { data } = await axios.post(
          "/api/teammembers",
          {
            name: member.name,
            email: member.email,
            departmentId: member.department,
            subfunctionIndex: member.subfunctionIndex,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data?.teammember?._id) createdIds.push(data.teammember._id);
      } catch (e) {}
    }
    if (createdIds.length) {
      dispatch(inviteTeammembers(createdIds));
    }
  };

  function getAllMembersForDisplay(key) {
    const backend = teammembers[key] || [];
    const pendingArr = pending[key] || [];
    return [
      ...backend.map((tm) => ({
        ...tm,
        isBackend: true,
        id: tm._id,
        status: tm.invited ? "Invited" : "Not Invited",
      })),
      ...pendingArr.map((pm) => ({
        ...pm,
        isBackend: false,
        id: pm._localId,
        status: "Pending",
      })),
    ];
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-2 sm:p-4">
      <div className="relative w-full max-w-4xl h-full flex flex-col">
        <div className="relative flex-1 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer text-3xl font-bold rounded-full bg-gray-100 hover:bg-red-100 w-10 h-10 flex items-center justify-center z-10 shadow"
              style={{ lineHeight: "1" }}
            >
              &times;
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 text-center">
              Invite Team Members
            </h1>
            <p className="text-gray-600 text-center text-sm sm:text-base">
              Add and select team members to send invitations.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 p-4 sm:p-6">
            <div className="flex flex-col gap-6">
              {departments.map((dept, deptIdx) => (
                <div
                  key={dept._id}
                  className="border rounded-2xl shadow-sm bg-white p-4 sm:p-6"
                >
                  <div
                    className="cursor-pointer flex items-center gap-3 group"
                    onClick={() => handleExpand(dept._id)}
                  >
                    <span className="text-2xl font-bold text-gray-700 group-hover:text-black transition">
                      {expanded[dept._id] ? "▼" : "►"}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      Department {deptIdx + 1}:
                    </span>
                    <span className="text-lg font-bold text-gray-700">
                      {dept.departmentName}
                    </span>
                  </div>
                  {expanded[dept._id] &&
                    dept.subfunctions?.map((sf, idx) => {
                      const key = `${dept._id}-${idx}`;
                      const allMembers = getAllMembersForDisplay(key);
                      return (
                        <div
                          key={idx}
                          className="ml-3 sm:ml-6 mt-5 mb-4 border-l-4 border-gray-200 pl-2 sm:pl-4 relative"
                        >
                          <div
                            className="cursor-pointer flex items-center group"
                            onClick={() => handleSubExpand(dept._id, idx)}
                          >
                            <span className="text-xl font-semibold text-gray-700 group-hover:text-black transition mr-2">
                              {subExpanded[key] ? "▼" : "►"}
                            </span>
                            <span className="font-medium text-gray-800 mr-2">
                              Subfunction {idx + 1}:
                            </span>
                            <span className="font-semibold text-gray-900">
                              {sf.name}
                            </span>
                          </div>
                          {subExpanded[key] && (
                            <div className="mt-4 p-2 sm:p-3 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3">
                                <input
                                  type="text"
                                  placeholder="Name"
                                  value={members[key]?.name || ""}
                                  onChange={(e) =>
                                    handleMemberChange(
                                      dept._id,
                                      idx,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 w-full text-sm"
                                />
                                <input
                                  type="email"
                                  placeholder="Email"
                                  value={members[key]?.email || ""}
                                  onChange={(e) =>
                                    handleMemberChange(
                                      dept._id,
                                      idx,
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 w-full text-sm"
                                />
                                <Button
                                  size="sm"
                                  type="button"
                                  onClick={() => handleAddMember(dept._id, idx)}
                                  className="w-full sm:w-auto bg-gray-800 hover:bg-black text-white font-semibold text-sm cursor-pointer px-6"
                                >
                                  Add
                                </Button>
                              </div>

                              {allMembers.length > 0 ? (
                                <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
                                  <div className="hidden sm:grid grid-cols-12 font-semibold text-xs text-gray-600 bg-gray-100 px-4 py-2 border-b">
                                    <div className="col-span-1 text-center">Select</div>
                                    <div className="col-span-4">Name</div>
                                    <div className="col-span-4">Email</div>
                                    <div className="col-span-3">Status</div>
                                  </div>
                                  {allMembers.map((tm) => (
                                    <div key={tm.id} className="sm:grid sm:grid-cols-12 items-center text-sm px-4 py-2 border-b last:border-b-0 hover:bg-gray-50 transition-all">
                                      <div className="sm:col-span-1 flex sm:justify-center items-center mb-2 sm:mb-0">
                                        <input
                                          type="checkbox"
                                          checked={selected.includes(tm.id)}
                                          onChange={() => handleSelect(tm.id)}
                                          disabled={tm.isBackend && tm.invited}
                                          className="accent-gray-800 w-4 h-4 cursor-pointer"
                                        />
                                      </div>
                                      <div className="sm:col-span-4 font-medium text-gray-800 truncate">
                                        <span className="sm:hidden font-semibold">Name: </span>{tm.name}
                                      </div>
                                      <div className="sm:col-span-4 text-gray-700 truncate">
                                       <span className="sm:hidden font-semibold">Email: </span>{tm.email}
                                      </div>
                                      <div className="sm:col-span-3 text-gray-600">
                                        <span className="sm:hidden font-semibold">Status: </span>{tm.status}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center text-gray-400 py-4 text-sm">
                                  No team members added yet.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-center">
              <Button
                className="w-full sm:w-auto px-10 py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-bold shadow-md transition-all text-base cursor-pointer"
                onClick={handleInvite}
                disabled={btnLoading || selected.length === 0}
              >
                {btnLoading ? "Sending..." : `Send Invitation (${selected.length})`}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .scrollbar-thin { scrollbar-width: thin; scrollbar-color: #d1d5db white; }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        .scrollbar-thin::-webkit-scrollbar { width: 8px; }
      `}</style>
    </div>
  );
}
