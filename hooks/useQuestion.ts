import { serverUrl } from "@/config/config";
import axios from "axios";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

function useQuestion(qId: string) {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState();
  useEffect(() => {
    const getQuestion = async () => {
      try {
        setLoading(true);
        const result = await axios.get(`${serverUrl}/api/v1/questions/${qId}`, {
          withCredentials: true,
        });
        setQuestion(result?.data?.question);
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
    getQuestion();
  }, [qId]);
  return { loading, question };
}

export default useQuestion;
