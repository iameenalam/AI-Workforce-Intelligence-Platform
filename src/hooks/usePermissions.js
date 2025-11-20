import { useSelector } from "react-redux";

export const usePermissions = () => {
  const { user, userRole, userPermissions } = useSelector((state) => state.user);

  // Check if user is organization creator (admin) - they created the organization
  const isOrgCreator = user?.systemRole === "Admin" || userRole === "Admin";

  // For organization creators, allow everything (no role restrictions)
  if (isOrgCreator) {
    return {
      // Dashboard permissions
      canViewDashboard: true,
      canInviteEmployees: true,
      canAddDepartments: true,
      canEditEmployees: true,
      canDeleteEmployees: true,
      canSetPayroll: true,
      canSetPerformanceReview: true,
      canAssignRoles: true,
      
      // Chart permissions
      canViewChart: true,
      canViewDepartments: true,
      
      // UI elements
      canViewChatbot: true,
      
      // General
      isAdmin: true,
      isOrgCreator: true,
      userRole,
      userPermissions,
    };
  }

  // For regular employees, use permission-based access
  return {
    // Dashboard permissions
    canViewDashboard: userPermissions?.dashboardAccess || false,
    canInviteEmployees: userPermissions?.canInviteEmployees || false,
    canAddDepartments: userPermissions?.canAddDepartments || false,
    canEditEmployees: userPermissions?.canEditEmployees || false,
    canDeleteEmployees: userPermissions?.canDeleteEmployees || false,
    canSetPayroll: userPermissions?.canSetPayroll || false,
    canSetPerformanceReview: userPermissions?.canSetPerformanceReview || false,
    canAssignRoles: userPermissions?.canAssignRoles || false,
    
    // Chart permissions
    canViewChart: userPermissions?.canViewOrgChart !== false, // Default to true
    canViewDepartments: userPermissions?.canViewDepartments !== false, // Default to true
    
    // UI elements
    canViewChatbot: userPermissions?.canViewChatbot || false,
    
    // General
    isAdmin: false,
    isOrgCreator: false,
    userRole,
    userPermissions,
  };
};
