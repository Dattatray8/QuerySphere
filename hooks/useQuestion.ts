import { serverUrl } from "@/config/config";
import { Question } from "@/types/global.types";
import axios from "axios";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

function useQuestion(qId: string)  : {question: Question, loading: boolean}{
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
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
  return { loading, question: question as Question };
}

export default useQuestion;
