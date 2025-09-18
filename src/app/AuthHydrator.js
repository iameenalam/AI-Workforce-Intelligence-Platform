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
  
  return null;
}
