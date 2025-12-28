import { serverUrl } from "@/config/config";
import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

const handleLogOut = async () => {
  const dispatch = useDispatch();
  try {
    await axios.get(`${serverUrl}/api/v1/auth/logout`, {
      withCredentials: true,
    });
    dispatch(setUserData(null));
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: error?.response?.data?.message || error?.message,
    });
  }
};
