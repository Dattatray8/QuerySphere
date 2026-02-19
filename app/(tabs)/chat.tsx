import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView, TextInput, Pressable, Keyboard, Text, Image } from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setMessages } from "@/redux/chatSlice";
import { serverUrl } from "@/config/config";
import AiResponse from "../components/chat/AiResponse";
import SenderMessage from "../components/chat/SenderMessage";
import ReceiverMessage from "../components/chat/ReceiverMessage";
import { useSocket } from "@/hooks/useSocket";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer, VideoView } from "expo-video";
import BannedMessage from "../components/BanMessage";

const Chat = () => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const { userData } = useSelector((state) => state.user);
  const [isBannedModalVisible, setIsBannedModalVisible] = useState(false);
  const { messages } = useSelector((state) => state.chat);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [mediaType, setMediaType] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [zoomMedia, setZoomMedia] = useState<boolean>(false);

  const getAllMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${serverUrl}/api/v1/chat/getmessages`,
        { withCredentials: true }
      );
      dispatch(setMessages(res.data.messages));
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (text === "") {
      Toast.show({ type: 'error', text1: 'Type a message...' })
      return;
    }
    if (userData?.isBanned) {
      setIsBannedModalVisible(true);
      return
    }
    try {
      setSendLoading(true);
      const formdata = new FormData();
      formdata.append("message", text);
      formdata.append("mediaType", mediaType);
      if (backendImage) {
        formdata.append("media", {
          uri: backendImage.uri,
          name: backendImage.name,
          type: backendImage.type,
        } as any);
      }
      await axios.post(`${serverUrl}/api/v1/chat/send`, formdata, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      setText("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error: any) {
      setSendLoading(false);
      console.log(error?.response?.data?.message || error?.message);
      Toast.show({ type: 'error', text1: error?.response?.data?.message || error.message })
      setText("");
    } finally {
      setSendLoading(false);
    }
  };

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setTyping(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setTyping(false));

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    getAllMessages();
  }, []);

  const handleImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos', 'livePhotos'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      setFrontendImage(asset.uri);
      setMediaType(asset.type!)

      setBackendImage({
        uri: asset.uri,
        name: asset.fileName ?? 'profile.jpg',
        type: asset.mimeType ?? 'image/jpeg',
      });
    }
  };

  useEffect(() => {
    socket?.on("newMessage", (msg) => {
      dispatch(addMessage(msg));
    });
    return () => socket?.off("newMessage");
  }, [socket]);

  const player = useVideoPlayer(frontendImage, (player) => {
    player.loop = true;
  });

  return (
    <View style={styles.container}>
      <BannedMessage
        visible={isBannedModalVisible}
        onClose={() => setIsBannedModalVisible(false)}
      />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 200 }} size={30} />
      ) : (
        <ScrollView
          ref={scrollRef}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }>
          {messages?.map((message, index) =>
            message?.sender?.userName !== "AI" ? (
              message?.sender?._id === userData?._id ? (
                <SenderMessage message={message} key={index} />
              ) : (
                <ReceiverMessage message={message} key={index} />
              )
            ) : (
              <AiResponse message={message} key={index} />
            )
          )}
        </ScrollView>
      )}
      {zoomMedia && (
        <View style={styles.zoomImageContainer}>
          <Pressable
            style={styles.closeBtn}
            onPress={() => setZoomMedia(false)}
          >
            <Ionicons name="close" size={26} />
          </Pressable>
          {mediaType === 'image' && (
            <Image
              source={{ uri: frontendImage! }}
              style={styles.zoomImage}
            />
          )}
          {mediaType === 'video' && (
            <VideoView
              player={player}
              style={{ width: '90%', height: '50%' }}
              resizeMode='contain'
            />
          )}
        </View>
      )}
      <View style={typing && { marginBottom: 250 }}>
        {frontendImage && (
          <Pressable onPress={() => { setZoomMedia(true) }} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#000', borderRadius: 50, margin: 5, width: 100, justifyContent: 'center' }}>
            <Ionicons name="image-outline" color={'#fff'} size={20} />
            <Text style={{ color: '#fff' }}>
              {mediaType === 'image' && "Image"}
              {mediaType === 'video' && "Video"}
            </Text>
          </Pressable>
        )}
        {!loading && (
          <View style={styles.inputBar}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor="#94a3b8"
              style={styles.input}
              multiline
            />
            <Pressable onPress={handleImage} style={{ position: 'absolute', right: 75 }}>
              <Ionicons name="cloud-upload-outline" color={'#fff'} size={25} />
            </Pressable>
            <Pressable onPress={sendMessage} style={styles.sendBtn}>
              <Ionicons name="send" size={18} color="#fff" />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  title: { fontSize: 18, fontWeight: "600" },
  sub: { fontSize: 12, color: "#6b7280" },
  list: { padding: 10 },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#111827",
    borderRadius: 20,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 20,
    padding: 10,
  },

  zoomImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },

  zoomImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    zIndex: 10000,
  },
});
