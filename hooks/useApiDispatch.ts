import { useDispatch } from "react-redux";
import { setLoading } from "../redux/questionSlice";
import { ToastAndroid } from "react-native";

export default function useApiDispatch() {
  const dispatch = useDispatch();

  const run = async (promiseFunc, onSuccess) => {
    try {
      dispatch(setLoading(true));
      const res = await promiseFunc();
      if (onSuccess) onSuccess(res.data);
    } catch (err:any) {
      ToastAndroid.show(err?.response?.data?.message || err.message, 2);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { run };
}
