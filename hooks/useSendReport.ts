import { useState } from "react";
import { api } from "./useApi";
import Toast from "react-native-toast-message";

export const useSendReport = () => {
  const [loading, setLoading] = useState(false);
  const sendReport = async (
    reason: string,
    reportedUserId: string,
    contentId: string,
    contentType: string,
  ) => {
    try {
      setLoading(true);
      const res = await api.post(
        "/api/v1/report",
        { reason, reportedUserId, contentId, contentType },
        { withCredentials: true },
      );
      Toast.show({ type: "success", text1: res?.data?.message });
    } catch (error: any) {
      console.log(error.response);
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return { sendReport, loading };
};
