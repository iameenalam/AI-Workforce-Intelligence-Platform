import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { getUserPermissions } from "@/redux/action/user";
import Cookies from "js-cookie";

export const useRouteProtection = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuth, userRole, userPermissions, employee, loading } = useSelector((state) => state.user);

  useEffect(() => {
    const initializeProtection = async () => {
      const token = Cookies.get("token");
      const currentPath = window.location.pathname;
      
      // Allow these paths without auth
      if (["/login", "/signup"].includes(currentPath)) {
        if (token && isAuth) {
          // If user is already authenticated, redirect to appropriate page
          if (userRole === "Unassigned") {
            router.push("/pending");
          } else if (userPermissions?.dashboardAccess || userRole === "Admin") {
            router.push("/dashboard");
          } else {
            router.push("/chart");
          }
        }
        return;
      }

      // Wait for loading to complete
      if (loading) {
        return;
      }

      // If there's a token but not authenticated, wait for auth hydration
      if (token && !isAuth) {
        return;
      }

      // No token or not authenticated - redirect to login
      if (!token || !isAuth) {
        router.push("/login");
        return;
      }

      // Get permissions if authenticated but no role
      if (isAuth && !userRole) {
        try {
          const data = await dispatch(getUserPermissions());
          if (data?.role === "Unassigned" && currentPath !== "/pending") {
            router.push("/pending");
          }
        } catch (error) {
          console.error('Failed to fetch permissions:', error);
        }
      }
    };

    initializeProtection();
  }, [isAuth, userRole, dispatch, router, loading, userPermissions?.dashboardAccess]);

  const redirectBasedOnRole = (currentPath) => {
    if (!isAuth || userRole === null || loading) return;

    // If user is unassigned, only allow pending route
    if (userRole === "Unassigned") {
      if (currentPath !== "/pending") {
        router.push("/pending");
      }
      return;
    }



    // If user has role assigned, don't allow pending route
    if (userRole !== "Unassigned" && currentPath === "/pending") {
      // Redirect based on permissions
      if (userPermissions?.dashboardAccess) {
        router.push("/dashboard");
      } else {
        router.push("/chart");
      }
      return;
    }

    // Only redirect from dashboard if user explicitly doesn't have access
    if (currentPath === "/dashboard") {
      if (!userPermissions?.dashboardAccess && userRole !== "Admin") {
        router.push("/chart");
      }
      return;
    }
  };

  return {
    isAuth,
    userRole,
    userPermissions,
    employee,
    redirectBasedOnRole,
    isUnassigned: userRole === "Unassigned",
    hasPermissions: userRole !== null,
  };
};
