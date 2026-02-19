import { useDispatch } from "react-redux";
import { setLoading } from "../redux/questionSlice";
import Toast from "react-native-toast-message";

export default function useApiDispatch() {
  const dispatch = useDispatch();

  const run = async (promiseFunc, onSuccess) => {
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
