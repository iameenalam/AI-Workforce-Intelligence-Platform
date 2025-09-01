"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { getUser } from "@/redux/action/user";

export default function AuthHydrator() {
  const dispatch = useDispatch();
  const { isAuth, loading } = useSelector((state) => state.user);
  const [tried, setTried] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token && !isAuth && !loading && !tried) {
      setTried(true);
      dispatch(getUser()).finally(() => {
        setInitialLoad(false);
      });
    } else if (!token) {
      setInitialLoad(false);
    }
  }, [dispatch, isAuth, loading, tried]);

  // Show loading during initial auth check
  if (initialLoad && Cookies.get("token")) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
