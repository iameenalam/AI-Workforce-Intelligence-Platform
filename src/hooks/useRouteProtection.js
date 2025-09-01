import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { getUserPermissions } from "@/redux/action/user";

export const useRouteProtection = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuth, userRole, userPermissions, employee, loading } = useSelector((state) => state.user);

  useEffect(() => {
    // Don't redirect while loading auth state
    if (loading) return;

    if (!isAuth) {
      router.push("/login");
      return;
    }

    // Fetch user permissions if not already loaded
    if (userRole === null) {
      dispatch(getUserPermissions()).then((data) => {
        // Immediately redirect unassigned users to pending
        if (data?.role === "Unassigned") {
          router.push("/pending");
        }

      }).catch(() => {
        // If permissions fetch fails, redirect to login
        router.push("/login");
      });
    }
  }, [isAuth, userRole, dispatch, router, loading]);

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

    // Check dashboard access (but don't redirect admins)
    if (currentPath === "/dashboard" && !userPermissions?.dashboardAccess && userRole !== "Admin") {
      router.push("/chart");
      return;
    }

    // For admins and users with dashboard access, don't redirect away from dashboard
    if (currentPath === "/dashboard" && (userRole === "Admin" || userPermissions?.dashboardAccess)) {
      // Stay on dashboard - don't redirect
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
