import { View, Text, Image, StyleSheet, Pressable, Modal, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { formatTimestamp } from "@/utils/formatTimeStamp";
import * as Speech from "expo-speech";
import { router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import ReportModal from "@/app/components/ReportModel";

const ReceiverMessage = ({ message }) => {
    const [zoomImg, setZoomImg] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);

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
            <View style={styles.wrapperLeft}>
                <View style={styles.userInfoRow}>
                    <Pressable style={styles.userInfo} onPress={() => router.push(`/(tabs)/profile/${message?.sender?._id}`)}>
                        <Image
                            source={{ uri: message?.sender?.profileImage }}
                            style={styles.userImage}
                        />
                        <Text style={styles.username}>{message?.sender?.userName}</Text>
                    </Pressable>

                    <View style={styles.actions}>
                        <Pressable onPress={() => speakText(message?.message)} style={styles.iconPadding}>
                            <Ionicons name="volume-high-outline" size={18} color="#4b5563" />
                        </Pressable>

                        <Pressable onPress={() => setShowOptions(!showOptions)} style={styles.iconPadding}>
                            <Ionicons name="ellipsis-vertical" size={18} color="#4b5563" />
                        </Pressable>

                        {showOptions && (
                            <TouchableOpacity
                                style={styles.reportDropdown}
                                onPress={() => {
                                    setReportVisible(true);
                                    setShowOptions(false);
                                }}
                            >
                                <Text style={styles.reportText}>Report</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.bubbleLeft}>
                    {message?.media && message?.mediaType === "image" && (
                        <Pressable onPress={() => setZoomImg(message.media)}>
                            <Image source={{ uri: message.media }} style={styles.media} />
                        </Pressable>
                    )}

                    {message?.media && message?.mediaType === "video" && (
                        <VideoView player={player} style={styles.video} />
                    )}

                    <Text style={styles.textLeft}>{message?.message}</Text>
                    <Text style={styles.time}>{formatTimestamp(message?.createdAt)}</Text>
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

            <ReportModal
                visible={reportVisible}
                onClose={() => setReportVisible(false)}
                reportedUserId={message?.sender?._id}
                contentType="Message"
                contentId={message?._id}
            />
        </>
    );
};

export default ReceiverMessage

const styles = StyleSheet.create({
    wrapperLeft: {
        alignItems: "flex-start",
        marginVertical: 8,
        paddingHorizontal: 10,
    },
    bubbleLeft: {
        backgroundColor: "#e5e7eb",
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        padding: 10,
    },

    video: {
        height: 200,
        width: 300
    },

    textLeft: { color: "#111", fontSize: 16 },

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
        width: '100%',
        height: 800,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },

    zoomImage: {
        width: "90%",
        height: "90%",
        resizeMode: "contain",
    },

    closeIcon: {
        position: "absolute",
        top: 40,
        right: 20,
        color: "#fff",
        backgroundColor: "#000",
        padding: 6,
        borderRadius: 20,
        zIndex: 1000,
    },

    userInfoRow: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        width: '100%',
        marginBottom: 4,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 50,
    },
    iconPadding: {
        paddingHorizontal: 8,
    },
    reportDropdown: {
        position: 'absolute',
        top: 25,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        zIndex: 100,
    },
    reportText: {
        color: '#ef4444',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
