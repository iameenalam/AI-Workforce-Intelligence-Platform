"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Cookies from "js-cookie";

export default function DebugEmployeesPage() {
  const { user, isAuth } = useSelector((state) => state.user);
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDebugData = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get("/api/test-employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDebugData(data);
    } catch (error) {
      console.error("Error fetching debug data:", error);
      setDebugData({ error: error.response?.data?.message || error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) {
      fetchDebugData();
    }
  }, [isAuth]);

  if (!isAuth) {
    return <div>Please log in to view debug information.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employee Debug Information</h1>
          <Button onClick={fetchDebugData} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        {debugData?.error && (
          <Card className="p-6 mb-6 bg-red-50 border-red-200">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-700">{debugData.error}</p>
          </Card>
        )}

        {debugData && !debugData.error && (
          <div className="space-y-6">
            {/* User Info */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Current User Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Name:</strong> {debugData.userInfo?.name}
                </div>
                <div>
                  <strong>Email:</strong> {debugData.userInfo?.email}
                </div>
                <div>
                  <strong>User Type:</strong> {debugData.userInfo?.userType}
                </div>
                <div>
                  <strong>Linked Organization:</strong> {debugData.userInfo?.linkedOrganization || "None"}
                </div>
              </div>
            </Card>

            {/* Organization Info */}
            {debugData.organizationInfo && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Organization Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Name:</strong> {debugData.organizationInfo.name}
                  </div>
                  <div>
                    <strong>ID:</strong> {debugData.organizationInfo._id}
                  </div>
                </div>
              </Card>
            )}

            {/* Test Organization API */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Organization API Test</h2>
              <button
                onClick={async () => {
                  try {
                    const token = Cookies.get("token");
                    const response = await fetch("/api/organization", {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    const data = await response.json();
                    console.log("Organization API response:", data);
                    alert(`Organization API: ${response.ok ? 'Success' : 'Failed'} - Check console`);
                  } catch (error) {
                    console.error("Organization API error:", error);
                    alert("Organization API failed - Check console");
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Test Organization API
              </button>
            </Card>

            {/* Employee Counts */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Employee Counts</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {debugData.counts?.byOrganization || 0}
                  </div>
                  <div className="text-sm text-blue-800">By Organization (New Method)</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {debugData.counts?.byUser || 0}
                  </div>
                  <div className="text-sm text-gray-800">By User (Old Method)</div>
                </div>
              </div>
            </Card>

            {/* Employees by Organization */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Employees by Organization ({debugData.employeesByOrganization?.length || 0})
              </h2>
              {debugData.employeesByOrganization?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invitation Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {debugData.employeesByOrganization.map((employee, index) => (
                        <tr key={employee._id || index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {employee.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {employee.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              employee.role === 'Unassigned' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {employee.role || 'Unassigned'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              employee.invitationStatus === 'accepted' 
                                ? 'bg-green-100 text-green-800' 
                                : employee.invitationStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {employee.invitationStatus || 'not_invited'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {employee.department?.departmentName || 'None'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No employees found by organization method.</p>
              )}
            </Card>

            {/* Employees by User (Old Method) */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Employees by User - Old Method ({debugData.employeesByUser?.length || 0})
              </h2>
              {debugData.employeesByUser?.length > 0 ? (
                <div className="space-y-2">
                  {debugData.employeesByUser.map((employee, index) => (
                    <div key={employee._id || index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-gray-600">{employee.email} - {employee.role}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No employees found by user method.</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
