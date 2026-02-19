import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StatusBar,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "@/hooks/useApi";
import { formatTimestamp } from "@/utils/formatTimeStamp";
import Toast from "react-native-toast-message";

const Spams = () => {
    const [spams, setSpams] = useState([]);
    const [spamLoading, setSpamLoading] = useState(false);
    const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);
    const [removeSpamId, setRemoveSpamId] = useState<string | null>(null);

    const router = useRouter();

    const getSpams = async () => {
        try {
            setSpamLoading(true);
            const res = await api.get("/api/v1/admin/spam", { withCredentials: true });
            setSpams(res?.data?.reports);
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: error?.response?.data?.message || "Error fetching spams"
            });
        } finally {
            setSpamLoading(false);
        }
    };

    useEffect(() => {
        getSpams();
    }, []);

    const actionOnSpam = async (id: string) => {
        try {
            setRemoveSpamId(id);
            setDeleteBtnLoading(true);
            const res = await api.delete(`/api/v1/admin/spam/${id}`, { withCredentials: true });
            Toast.show({ type: "success", text1: res?.data?.message });
            getSpams();
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: error?.response?.data?.message || "Delete failed"
            });
        } finally {
            setDeleteBtnLoading(false);
            setRemoveSpamId(null);
        }
    };

    const handleContentClick = (contentType: string, contentId: any) => {
        if (contentType === "Answer") router.push(`/questions/q/${contentId?.question}`);
        if (contentType === "Question") router.push(`/questions/q/${contentId?._id}`);
        // if (contentType === "Message") router.push(`/chat?messageId=${contentId?._id}`);
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Spams</Text>
                </View>
                <View style={styles.pendingBadge}>
                    <Text style={styles.badgeText}>{spams.length} Pending</Text>
                </View>
            </View>

            {spamLoading ? (
                <View style={styles.centerLoader}>
                    <ActivityIndicator size="large" color="#ef4444" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {spams.length === 0 ? (
                        <View style={styles.emptyBox}>
                            <Ionicons name="alert-circle-outline" size={40} color="#3b82f6" />
                            <Text style={styles.emptyText}>No spams to review at this time.</Text>
                        </View>
                    ) : (
                        spams.map((spam: any) => (
                            <View key={spam._id} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <TouchableOpacity
                                        style={styles.userInfo}
                                        onPress={() => router.push(`/(tabs)/profile/${spam?.reportingUser?._id}`)}
                                    >
                                        <Image
                                            source={spam?.reportingUser?.profileImage
                                                ? { uri: spam?.reportingUser?.profileImage }
                                                : require("../assets/user.png")}
                                            style={styles.avatar}
                                        />
                                        <View>
                                            <Text style={styles.userName}>{spam.reportingUser?.userName}</Text>
                                            <Text style={styles.timestamp}>{formatTimestamp(spam?.createdAt)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={styles.typeBadge}>
                                        <Text style={styles.typeBadgeText}>{spam.contentType}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardBody}>
                                    <Text style={styles.label}>Reason:</Text>
                                    <Text style={styles.value}>{spam.reason}</Text>

                                    <Text style={styles.label}>Reported User:</Text>
                                    <Text style={styles.value}>{spam.reportedUser?.userName}</Text>

                                    <Text style={styles.label}>Content:</Text>
                                    <TouchableOpacity
                                        style={styles.contentPreview}
                                        onPress={() => handleContentClick(spam.contentType, spam.contentId)}
                                    >
                                        <Text style={styles.contentText} numberOfLines={1}>
                                            {spam?.contentType === "Question" && spam?.contentId?.question}
                                            {spam?.contentType === "Answer" && spam?.contentId?.answer}
                                            {spam?.contentType === "Message" && spam?.contentId?.message}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={[styles.btn, styles.btnError]}
                                        onPress={() => actionOnSpam(spam._id)}
                                        disabled={deleteBtnLoading && removeSpamId === spam._id}
                                    >
                                        {deleteBtnLoading && removeSpamId === spam._id ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <Text style={styles.btnText}>Delete Content</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
};

export default Spams;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#f3f4f6"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 12,
        // Manual Padding/Margin Fix
        paddingTop: Platform.OS === "ios" ? 60 : 45,
        backgroundColor: "#fff",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerLeft: { flexDirection: "row", alignItems: "center" },
    headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 8 },
    backBtn: { padding: 4 },
    pendingBadge: { backgroundColor: "#ef4444", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
    scrollContent: { padding: 16 },
    centerLoader: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyBox: { backgroundColor: "#dbeafe", padding: 20, borderRadius: 10, flexDirection: "row", alignItems: "center", gap: 10 },
    emptyText: { color: "#1e40af", flex: 1 },
    card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
    userInfo: { flexDirection: "row", alignItems: "center", gap: 10 },
    avatar: { width: 40, height: 40, borderRadius: 20 },
    userName: { fontWeight: "bold", fontSize: 15 },
    timestamp: { fontSize: 11, color: "#6b7280" },
    typeBadge: { backgroundColor: "#fef3c7", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    typeBadgeText: { color: "#92400e", fontSize: 10, fontWeight: "bold" },
    cardBody: { gap: 8 },
    label: { fontSize: 12, fontWeight: "bold", color: "#4b5563" },
    value: { fontSize: 14, color: "#1f2937", marginBottom: 4 },
    contentPreview: { backgroundColor: "#f9fafb", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#e5e7eb" },
    contentText: { fontSize: 13, color: "#6b7280" },
    actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
    btn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, minWidth: 120, alignItems: "center" },
    btnError: { backgroundColor: "#ef4444" },
    btnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
});