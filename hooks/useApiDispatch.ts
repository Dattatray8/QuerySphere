import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/questionSlice";

export default function useApiDispatch() {
  const dispatch = useDispatch();

  const run = async <T>(
    promiseFunc: () => Promise<{ data: T }>,
    onSuccess?: (data: T) => void,
  ): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const res = await promiseFunc();
      if (onSuccess) onSuccess(res.data);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err?.response?.data?.message || err.message,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { run };
}
