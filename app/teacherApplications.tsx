import { FlatList, Image, Platform, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { useSocket } from '@/hooks/useSocket';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '@/config/config';
import { addApplication, setTeacherApplications, updateApplications } from '@/redux/adminSlice';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import useProfileTabData from '@/hooks/useProfileTabData';
import { User } from '@/types/global.types';

const TeacherApplications = () => {
    const { socket } = useSocket() as any;
    const dispatch = useDispatch();
    const route = useRoute();
    let params = route?.params as { key: string }
    useProfileTabData(params?.key, "");

    const { teacherApplications } = useSelector((state: any) => state.admin);

    const approveApplication = async (userId: string) => {
        try {
            const res = await axios.post(
                `${serverUrl}/api/v1/admin/approve/${userId}`,
                {},
                { withCredentials: true }
            );
            Toast.show({ type: 'success', text1: res?.data?.message });
            dispatch(updateApplications(res?.data?.user));
        } catch (error: any) {
            Toast.show({ type: 'error', text1: error?.response?.data?.message || "Error" });
        }
    };

    useEffect(() => {
        socket?.on("newTeacherApplication", (application: User) => {
            dispatch(addApplication(application));
        });

        return () => socket?.off("newTeacherApplication");
    }, [socket, teacherApplications, dispatch]);

    useEffect(() => {
        socket?.on("canceledTeacherApplication", (application: User) => {
            const updated = teacherApplications.filter(
                (app: User) => app._id !== application._id
            );
            dispatch(setTeacherApplications(updated));
        });

        return () => socket?.off("canceledTeacherApplication");
    }, [socket, teacherApplications, dispatch]);

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.userInfo}>
                <Image
                    source={item?.profileImage ? { uri: item.profileImage } : require("../assets/user.png")}
                    style={styles.avatar}
                />
                <Text style={styles.userName}>{item?.userName}</Text>
            </View>

            {!item?.isTeacher && (
                <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => approveApplication(item?._id)}
                >
                    <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Teacher Applications</Text>
                <View style={{ width: 28 }} />
            </View>

            {teacherApplications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No applications found</Text>
                </View>
            ) : (
                <FlatList
                    data={teacherApplications}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    )
}

export default TeacherApplications

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 10,
        paddingBottom: 20,
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    backBtn: {
        padding: 4,
    },
    listContent: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#f0f0f0',
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    approveBtn: {
        backgroundColor: '#22c55e',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
    },
})