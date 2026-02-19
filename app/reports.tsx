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
import { useSocket } from "@/hooks/useSocket"; // Adjust path
import { formatTimestamp } from "@/utils/formatTimeStamp";
import Toast from "react-native-toast-message";
import { api } from "@/hooks/useApi";

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [reportLoading, setReportLoading] = useState(false);
    const [approveReportLoading, setApproveReportLoading] = useState(false);
    const [removeReportLoading, setRemoveReportLoading] = useState(false);
    const [actionId, setActionId] = useState<string | null>(null);

    const router = useRouter();
    const { socket } = useSocket();

    const getReports = async () => {
        try {
            setReportLoading(true);
            const res = await api.get("/api/v1/report", { withCredentials: true });
            setReports(res?.data?.reports);
        } catch (error: any) {
            Toast.show({ type: "error", text1: error?.response?.data?.message || "Error fetching reports" });
        } finally {
            setReportLoading(false);
        }
    };

    useEffect(() => {
        getReports();
    }, []);

    useEffect(() => {
        socket?.on("newReport", (report: any) => {
            setReports((prev) => [report, ...prev]);
        });
        return () => socket?.off("newReport");
    }, [socket]);

    const approveReport = async (reportId: string) => {
        try {
            setActionId(reportId);
            setApproveReportLoading(true);
            const res = await api.post("/api/v1/teacher/report", { reportId }, { withCredentials: true });
            Toast.show({ type: "success", text1: res?.data?.message });
            getReports();
        } catch (error: any) {
            Toast.show({ type: "error", text1: error?.response?.data?.message || "Approve failed" });
        } finally {
            setApproveReportLoading(false);
            setActionId(null);
        }
    };

    const removeReport = async (reportId: string) => {
        try {
            setActionId(reportId);
            setRemoveReportLoading(true);
            const res = await api.delete(`/api/v1/teacher/report/${reportId}`, { withCredentials: true });
            Toast.show({ type: "success", text1: res?.data?.message });
            getReports();
        } catch (error: any) {
            Toast.show({ type: "error", text1: error?.response?.data?.message || "Removal failed" });
        } finally {
            setRemoveReportLoading(false);
            setActionId(null);
        }
    };

    const handleContentClick = (contentType: string, contentId: any) => {
        if (contentType === "Answer") router.push(`/questions/q/${contentId?.question}`);
        if (contentType === "Question") router.push(`/questions/q/${contentId?._id}`);
        // if (contentType === "Message") router.push(`/chat?messageId=${contentId?._id}`);
    };

    return (
        <View style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Reports</Text>
                </View>
                <View style={styles.pendingBadge}>
                    <Text style={styles.badgeText}>{reports.length} Pending</Text>
                </View>
            </View>

            {reportLoading ? (
                <View style={styles.centerLoader}>
                    <ActivityIndicator size="large" color="#ef4444" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {reports.length === 0 ? (
                        <View style={styles.emptyBox}>
                            <Ionicons name="alert-circle-outline" size={40} color="#3b82f6" />
                            <Text style={styles.emptyText}>No reports to review at this time.</Text>
                        </View>
                    ) : (
                        reports.map((report: any) => (
                            <View key={report._id} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <TouchableOpacity
                                        style={styles.userInfo}
                                        onPress={() => router.push(`/(tabs)/profile/${report?.reportingUser?._id}`)}
                                    >
                                        <Image
                                            source={report?.reportingUser?.profileImage ? { uri: report?.reportingUser?.profileImage } : require("../assets/user.png")}
                                            style={styles.avatar}
                                        />
                                        <View>
                                            <Text style={styles.userName}>{report.reportingUser?.userName}</Text>
                                            <Text style={styles.timestamp}>{formatTimestamp(report?.createdAt)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={styles.typeBadge}>
                                        <Text style={styles.typeBadgeText}>{report.contentType}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardBody}>
                                    <Text style={styles.label}>Reason:</Text>
                                    <Text style={styles.value}>{report.reason}</Text>

                                    <Text style={styles.label}>Reported User:</Text>
                                    <Text style={styles.value}>{report.reportedUser?.userName}</Text>

                                    <Text style={styles.label}>Content:</Text>
                                    <TouchableOpacity
                                        style={styles.contentPreview}
                                        onPress={() => handleContentClick(report.contentType, report.contentId)}
                                    >
                                        <Text style={styles.contentText} numberOfLines={1}>
                                            {report?.contentType === "Question" && report?.contentId?.question}
                                            {report?.contentType === "Answer" && report?.contentId?.answer}
                                            {report?.contentType === "Message" && report?.contentId?.message}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={[styles.btn, styles.btnError]}
                                        onPress={() => removeReport(report._id)}
                                        disabled={removeReportLoading && actionId === report._id}
                                    >
                                        {removeReportLoading && actionId === report._id ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <Text style={styles.btnText}>Remove Report</Text>
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.btn, styles.btnSuccess]}
                                        onPress={() => approveReport(report._id)}
                                        disabled={approveReportLoading && actionId === report._id}
                                    >
                                        {approveReportLoading && actionId === report._id ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <Text style={styles.btnText}>Approve</Text>
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

export default Reports;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#f3f4f6" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        paddingTop: Platform.OS === "ios" ? 50 : 40,
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
    actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 16 },
    btn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, minWidth: 100, alignItems: "center" },
    btnError: { backgroundColor: "#ef4444" },
    btnSuccess: { backgroundColor: "#22c55e" },
    btnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
});