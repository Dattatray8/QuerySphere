import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCurrentUserData } from "./useCurrentUserData";

export default function useCurrentUser() {
  let { loading } = useCurrentUserData();
  const userFromStore = useSelector((state: any) => state.user?.userData);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setUser(userFromStore || null);
    setChecking(false);
  }, [userFromStore]);

  return {
    user,
    isLoggedIn: Boolean(user?._id),
    checking,
    loading,
  };
}
