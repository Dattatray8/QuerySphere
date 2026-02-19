import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setQuestions } from "../redux/questionSlice";
import { serverUrl } from "@/config/config";
import Toast from "react-native-toast-message";

function useQuestions() {
  const [loading, setLoading] = useState<Boolean>(false);
  const [hasMore, setHasMore] = useState<Boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { questions, page } = useSelector((state: any) => state.question);
  console.log(page);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${serverUrl}/api/v1/questions/page/${page}`,
          {
            withCredentials: true,
          }
        );
        if (res?.data?.questions.length === 0) {
          setMessage("No more questions available.");
          setHasMore(false);
          return;
        }
        let allQuestions = [...questions, ...res?.data?.questions];
        let uniqueQuestions = Array.from(
          new Map(allQuestions.map((q) => [q._id, q])).values()
        );
        dispatch(setQuestions(uniqueQuestions));
      } catch (error: any) {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: error?.response?.data?.message || error?.message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [page, dispatch]);
  return { loading, hasMore, message };
}

export default useQuestions;
