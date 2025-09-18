"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { getUser } from "@/redux/action/user";
import { loadingStart } from "@/redux/reducer/userReducer";

export default function AuthHydrator() {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.user);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get("token");
      if (token && !isAuth && !initialized) {
        try {
          dispatch(loadingStart());
          await dispatch(getUser());
        } catch (error) {
          console.error('Auth initialization failed:', error);
        }
      }
      setInitialized(true);
    };

    initializeAuth();
  }, [dispatch, isAuth, initialized]);

  return null;
}
