import ReportModal from "@/app/components/ReportModel";
import AcceptedBadge from "@/app/components/ui/AcceptedBadge";
import Button from "@/app/components/ui/Button";
import VerfiedBadge from "@/app/components/ui/VerfiedBadge";
import VideoPlayer from "@/app/components/VideoPlayer";
import { serverUrl } from "@/config/config";
import useQuestion from "@/hooks/useQuestion";
import { formatTimestamp } from "@/utils/formatTimeStamp";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

const Answers = () => {
  const route = useRoute();
  const params = route?.params as { id: string };
  let { loading, question } = useQuestion(params?.id);
  const [clipboardLoading, setClipboardLoading] = useState<Boolean>(false);
  const [copyTextId, setCopyTextId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [allAnswers, setAllAnswers] = useState([]);
  const [qZoomImg, setQZoomImg] = useState<Boolean>(false);
  const [aZoomImg, setAZoomImg] = useState<string | null>(null);
  const [reportQId, setReportQId] = useState<Boolean>(false);
  const [reportAId, setReportAId] = useState<string | null>(null);
  const [acceptAId, setAcceptAId] = useState<string | null>(null);
  const [verfiyAId, setVerifyAId] = useState<string | null>(null);
  const { userData } = useSelector((state: any) => state.user);
  const [reportVisible, setReportVisible] = useState(false);
  const [selectedAnswerForReport, setSelectedAnswerForReport] = useState<any>(null);

  const copyToClipboard = async (text: string) => {
    try {
      setClipboardLoading(true);
      await Clipboard.setStringAsync(text);
      Toast.show({ type: "success", text1: "Copied to clipboard" });
    } catch (err) {
      setClipboardLoading(false);
      Toast.show({ type: "error", text1: "Failed to copy text" });
      console.error(err);
    } finally {
      setClipboardLoading(false);
    }
  };

  const getAllAnswers = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/answers/${question?._id}`, {
        withCredentials: true,
      });
      setAllAnswers(res?.data?.answers);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: error?.response?.data?.message || error.message })
    }
  };
  const scrollRef = useRef<ScrollView>(null);

  const speakText = (text: string) => {
    Speech.stop();
    Speech.speak(text, {
      language: "en",
      rate: 1,
      pitch: 1,
    });
  };
  useEffect(() => {
    if (question) {
      getAllAnswers();
    }
  }, [question?._id]);

  const markAsIGotMyAnswer = async (ansId: string) => {
    try {
      const res = await axios.put(
        `${serverUrl}/api/v1/questions/${question?._id}/${ansId}/stop`,
        {},
        { withCredentials: true }
      );
      Toast.show({ type: 'success', text1: res?.data?.message })
      setAllAnswers((prev) =>
        prev.map((a) => (a._id === ansId ? { ...a, gotAnswer: true } : a))
      );
    } catch (error: any) {
      Toast.show({ type: 'error', text1: error?.response?.data?.message || error.message })
    }
  };

  const verifyAnswer = async (ansId: string) => {
    try {
      const res = await axios.put(
        `${serverUrl}/api/v1/teacher/verify/${ansId}`,
        {},
        { withCredentials: true }
      );
      Toast.show({ type: 'success', text1: res?.data?.message })
      setAllAnswers((prev) =>
        prev.map((a) => (a._id === ansId ? { ...a, verifiedAnswer: true } : a))
      );
    } catch (error: any) {
      Toast.show({ type: 'error', text1: error?.response?.data?.message || error.message })
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {reportVisible && (
        <ReportModal
          visible={reportVisible}
          onClose={() => setReportVisible(false)}
          reportedUserId={question?.user?._id}
          contentType="Question"
          contentId={question?._id}
        />
      )}
      <ReportModal
        visible={!!selectedAnswerForReport}
        onClose={() => setSelectedAnswerForReport(null)}
        reportedUserId={selectedAnswerForReport?.user?._id}
        contentType="Answer"
        contentId={selectedAnswerForReport?._id}
      />
      <ScrollView ref={scrollRef}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={25} />
            </Pressable>
            <Text style={styles.headerText}>Question</Text>
          </View>
          {userData?._id !== question?.user?._id && !question?.stopAnswering && (
            <View>
              <Button text="Answer" onClick={() => {
                router.push({
                  pathname: '/answer',
                  params: { qId: question?._id }
                })
              }} style={{ padding: 13, alignSelf: "center" }} />
            </View>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size={30} style={{ marginTop: 300 }} />
        ) : (
          <View style={styles.container}>
            <View>
              {question?.media && question?.mediaType === "image" && (
                <Pressable onPress={() => setQZoomImg(true)}>
                  <Image
                    src={question?.media}
                    alt="selected image"
                    style={styles.media}
                  />
                </Pressable>
              )}
              {question?.media && question?.mediaType === "video" && (
                <View>
                  <VideoPlayer source={question?.media} />
                </View>
              )}
            </View>

            <Text style={{ paddingVertical: 10 }}>{question?.question}</Text>

            <View style={styles.options}>
              <Pressable
                onPress={() => {
                  if (speakingId === question?._id) {
                    Speech.stop();
                    setSpeakingId(null);
                  } else {
                    Speech.stop();
                    speakText(question?.question);
                    setSpeakingId(question?._id);
                  }
                }}
              >
                <Ionicons
                  name="volume-high-outline"
                  size={20}
                />
              </Pressable>
              {clipboardLoading && copyTextId === question?._id ? (
                <ActivityIndicator />
              ) : (
                <Pressable onPress={() => { copyToClipboard(question?.question); setCopyTextId(question?._id) }}>
                  <Ionicons name="copy-outline" size={20} />
                </Pressable>
              )}
              <Pressable onPress={() => setReportQId(!reportQId)}>
                <Ionicons name="ellipsis-vertical" size={20} />
              </Pressable>
              {reportQId && (
                <Button text="Report" onClick={() => { setReportVisible(true) }} style={{ padding: 15, alignSelf: "center", position: 'absolute', top: 30, zIndex: 100 }} />
              )}
            </View>

            <Pressable
              onPress={() => router.push(`/(tabs)/profile/${question?.user._id}`)}
            >
              <View style={styles.userInfo}>
                <Image
                  source={
                    question?.user?.profileImage
                      ? { uri: question?.user.profileImage }
                      : require("../../../assets/user.png")
                  }
                  style={styles.userImage}
                />
                <Text style={{ fontWeight: 'bold' }}>{question?.user?.userName || "Anonymous"}</Text>
                <Text>{formatTimestamp(question?.createdAt)}</Text>
              </View>
            </Pressable>

            {qZoomImg && (
              <View style={styles.zoomImageContainer}>
                <Ionicons name="close" style={{ right: 20, position: 'absolute', top: 10, backgroundColor: '#fff', padding: 5, borderRadius: 50, zIndex: 1000 }} size={25} onPress={() => setQZoomImg(false)} />
                <Image src={question?.media} alt='question image' style={styles.zoomImage} />
              </View>
            )}

            <Text style={{ alignSelf: 'center', padding: 20, fontWeight: 'semibold', fontSize: 15 }}>Answers ({allAnswers?.length || 0})</Text>
            {aZoomImg && (
              <View style={styles.zoomImageContainer}>
                <Ionicons name="close" style={{ right: 20, position: 'absolute', top: 10, backgroundColor: '#fff', padding: 5, borderRadius: 50, zIndex: 1000 }} size={25} onPress={() => setAZoomImg(false)} />
                <Image src={aZoomImg} alt='question image' style={styles.zoomImage} />
              </View>
            )}

            {allAnswers.map((ans: object, idx: number) => (
              <View key={idx} style={{ paddingBottom: 40 }}>

                <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 10 }}>
                  {ans?.gotAnswer && <AcceptedBadge />}
                  {ans?.verifiedAnswer && <VerfiedBadge />}
                </View>
                {ans?.media && ans?.mediaType === "image" && (
                  <Pressable onPress={() => {
                    scrollRef.current?.scrollTo({ y: 0, animated: true });
                    setAZoomImg(ans?.media);
                  }}>
                    <Image
                      src={ans?.media}
                      alt="selected image"
                      style={styles.media}
                    />
                  </Pressable>
                )}

                {ans?.media && ans?.mediaType === "video" && (
                  <View>
                    <VideoPlayer source={ans?.media} />
                  </View>
                )}

                <Text style={{ paddingVertical: 10 }}>{ans?.answer}</Text>

                <View style={styles.options}>
                  <Pressable
                    onPress={() => {
                      if (speakingId === ans._id) {
                        Speech.stop();
                        setSpeakingId(null);
                      } else {
                        Speech.stop();
                        speakText(ans.answer);
                        setSpeakingId(ans._id);
                      }
                    }}
                  >
                    <Ionicons
                      name="volume-high-outline"
                      size={20}
                    />
                  </Pressable>

                  {clipboardLoading && copyTextId === ans?._id ? (
                    <ActivityIndicator />
                  ) : (
                    <Pressable onPress={() => { copyToClipboard(ans?.answer); setCopyTextId(ans?._id) }}>
                      <Ionicons name="copy-outline" size={20} />
                    </Pressable>
                  )}
                  <Pressable onPress={() => {
                    // Toggle the small report button popup
                    setReportAId(reportAId === ans._id ? null : ans._id);
                  }}>
                    <Ionicons name="ellipsis-vertical" size={20} />
                  </Pressable>

                  {reportAId === ans?._id && (
                    <Button
                      text="Report"
                      onClick={() => {
                        setSelectedAnswerForReport(ans);
                        setReportAId(null);
                      }}
                      style={{ padding: 15, alignSelf: "center", position: 'absolute', top: 30, zIndex: 100 }}
                    />
                  )}
                </View>

                <Pressable
                  onPress={() => router.push(`/(tabs)/profile/${ans?.user._id}`)}
                >
                  <View style={styles.userInfo}>
                    <Image
                      source={
                        ans?.user?.profileImage
                          ? { uri: ans?.user.profileImage }
                          : require("../../../assets/user.png")
                      }
                      style={styles.userImage}
                    />
                    <Text style={{ fontWeight: 'bold' }}>{ans?.user?.userName || "Anonymous"}</Text>
                    {ans?.user?.role === "teacher" && ans?.user?.isTeacher && (
                      <View><Ionicons name="checkmark" style={{ backgroundColor: '#00d390', borderRadius: 50, padding: 2, color: 'white' }} /></View>
                    )}
                    <Text>{formatTimestamp(ans?.createdAt)}</Text>
                    {
                      userData?._id === question?.user?._id &&
                      question?.user?.role === "student" &&
                      !question?.stopAnswering && (
                        <Pressable onPress={() => acceptAId !== null ? setAcceptAId(null) : setAcceptAId(ans?._id)}>
                          <Ionicons name="ellipsis-horizontal" size={20} />
                        </Pressable>
                      )
                    }

                    {acceptAId === ans?._id && (
                      <Button text="Accept" onClick={() => { markAsIGotMyAnswer(ans?._id); setAcceptAId(null) }} style={{ padding: 15, alignSelf: "center", position: 'absolute', top: 30, right: 50, zIndex: 100 }} />
                    )}

                    {userData?._id !== ans?.user?._id &&
                      userData?.role === "teacher" &&
                      userData?.isTeacher &&
                      !ans?.verifiedAnswer && (
                        <Pressable onPress={() => verfiyAId !== null ? setVerifyAId(null) : setVerifyAId(ans?._id)}>
                          <Ionicons name="ellipsis-horizontal" size={20} />
                        </Pressable>
                      )
                    }

                    {verfiyAId === ans?._id && (
                      <Button text="Verify" onClick={() => { verifyAnswer(ans?._id); setVerifyAId(null); }} style={{ padding: 15, alignSelf: "center", position: 'absolute', top: 30, right: 50, zIndex: 100 }} />
                    )}
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Answers;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: 'space-between',
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 15,
    backgroundColor: "#fff",
  },

  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  queContainer: {
    marginVertical: 20,
    flexDirection: "column",
    gap: 20,
  },

  container: {
    padding: 20,
  },

  media: {
    width: "auto",
    objectFit: "cover",
    height: 100,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  options: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    alignItems: 'center'
  },

  zoomImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },

  zoomImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
});
