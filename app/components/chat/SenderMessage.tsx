import {
    View,
    Text,
    Image,
    StyleSheet,
    Pressable,
    Modal,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { formatTimestamp } from "@/utils/formatTimeStamp";
import * as Speech from "expo-speech";
import { useVideoPlayer, VideoView } from "expo-video";
import { router } from "expo-router";


const SenderMessage = ({ message }) => {
    const [zoomImg, setZoomImg] = useState(null);

    const speakText = (text: string) => {
        Speech.stop();
        Speech.speak(text, {
            language: "en",
            rate: 1,
            pitch: 1,
        });
    };

    const player = useVideoPlayer(message?.media, (player) => {
        player.loop = true;
    });

    return (
        <>
            <View style={styles.wrapperRight}>
                <Pressable style={styles.userInfo} onPress={() => router.push(`/(tabs)/profile/${message?.sender?._id}`)}>
                    <Text style={styles.username}>{message?.sender?.userName}</Text>

                    <Pressable onPress={() => speakText(message?.message)}>
                        <Ionicons name="volume-high" size={18} />
                    </Pressable>

                    <Image
                        source={{ uri: message?.sender?.profileImage }}
                        style={styles.userImage}
                    />
                </Pressable>

                <View style={styles.bubbleRight}>
                    {message?.media && message?.mediaType === "image" && (
                        <Pressable onPress={() => setZoomImg(message.media)}>
                            <Image source={{ uri: message.media }} style={styles.media} />
                        </Pressable>
                    )}

                    {message?.media && message?.mediaType === "video" && (
                        <VideoView player={player} style={styles.video} />
                    )}

                    <Text style={styles.textRight}>{message?.message}</Text>
                    <Text style={styles.time}>
                        {formatTimestamp(message?.createdAt)}
                    </Text>
                </View>
            </View>

            <Modal visible={!!zoomImg} transparent animationType="fade">
                <View style={styles.zoomImageContainer}>
                    <Ionicons
                        name="close"
                        size={28}
                        style={styles.closeIcon}
                        onPress={() => setZoomImg(null)}
                    />
                    <Image source={{ uri: zoomImg! }} style={styles.zoomImage} />
                </View>
            </Modal>
        </>
    );
};

export default SenderMessage;


const styles = StyleSheet.create({
    wrapperRight: {
        alignItems: "flex-end",
        marginVertical: 8,
        paddingHorizontal: 10,
    },

    bubbleRight: {
        backgroundColor: "#4f46e5",
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        padding: 10,
    },

    video: {
        height: 200,
        width: 300
    },

    textRight: { color: "#fff", fontSize: 16 },

    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
    },

    username: { fontSize: 12, fontWeight: "600" },

    userImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },

    media: {
        width: 200,
        height: 120,
        borderRadius: 10,
        marginBottom: 6,
    },

    time: {
        fontSize: 10,
        opacity: 0.6,
        marginTop: 4,
    },

    zoomImageContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        width: '100%',
        height: 800
    },

    zoomImage: {
        width: "90%",
        height: "90%",
        resizeMode: "contain",
    },

    closeIcon: {
        position: "absolute",
        top: 10,
        right: 10,
        color: "#fff",
        backgroundColor: "#000",
        padding: 6,
        borderRadius: 20,
        zIndex: 1000,
    },
});
