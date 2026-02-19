import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Pressable, Platform, StatusBar, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers } from "@/redux/adminSlice";
import { serverUrl } from "@/config/config";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from 'react-native-toast-message';
import DropDownPicker from "react-native-dropdown-picker";

const AllUsers = () => {
    const { allUsers } = useSelector((state: any) => state.admin);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);
    const [toBanUserId, setToBanUserId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("all");
    const [items, setItems] = useState([
        { label: 'All Users', value: 'all' },
        { label: 'Banned', value: 'banned' },
        { label: 'Teachers', value: 'teacher' },
        { label: 'Students', value: 'student' },
    ]);

    useEffect(() => {
        getFilteredUsers(value);
    }, [value]);

    const getFilteredUsers = async (filter: string) => {
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/v1/admin/users/${filter}`, {}, { withCredentials: true });
            dispatch(setAllUsers(res?.data?.users));
        } catch (error: any) {
            Toast.show({ type: 'error', text1: error.message || "Error fetching users"  });
        } finally {
            setLoading(false);
        }
    };

    const approveApplication = async (userId: string) => {
        try {
            const res = await axios.post(`${serverUrl}/api/v1/admin/approve/${userId}`, {}, { withCredentials: true });
            dispatch(setAllUsers(allUsers.map((u: any) => u._id === userId ? { ...u, isTeacher: true, isAppliedForTeacherRole: false } : u)));
            Toast.show({ type: 'success', text1: res?.data?.message });
        } catch (error: any) {
            Toast.show({ type: 'error', text1: error?.response?.data?.message || "Error" });
        }
    };

    const removeFromTeacher = async (userId: string) => {
        try {
            const res = await axios.post(`${serverUrl}/api/v1/admin/disapprove/${userId}`, {}, { withCredentials: true });
            dispatch(setAllUsers(allUsers.map((u: any) => u._id === userId ? { ...u, isTeacher: false, isAppliedForTeacherRole: false } : u)));
            Toast.show({ type: 'success', text1: res?.data?.message });
        } catch (error: any) {
            Toast.show({ type: 'error', text1: error?.response?.data?.message || "Error" });
        }
    };

    const banUser = async (userId: string) => {
        try {
            setToBanUserId(userId);
            setLoad(true);
            const res = await axios.post(`${serverUrl}/api/v1/admin/ban/${userId}`, {}, { withCredentials: true });
            dispatch(setAllUsers(allUsers.map((u: any) => u._id === res.data.user._id ? res.data.user : u)));
            Toast.show({ type: 'success', text1: res?.data?.message });
        } catch (error: any) {
            setLoad(false);
            console.log(error.response)
            Toast.show({ type: 'error', text1: error?.response?.data?.message || error?.message });
        } finally {
            setLoad(false);
        }
    };

    const unbanUser = async (userId: string) => {
        try {
            setToBanUserId(userId);
            setLoad(true);
            const res = await axios.post(`${serverUrl}/api/v1/admin/unban/${userId}`, {}, { withCredentials: true });
            dispatch(setAllUsers(allUsers.map((u: any) => u._id === res.data.user._id ? res.data.user : u)));
            Toast.show({ type: 'success', text1: res?.data?.message });
        } catch (error: any) {
            Toast.show({ type: 'error', text1: error?.response?.data?.message || "Error" });
        } finally {
            setLoad(false);
        }
    };

    const renderHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, { width: 140 }]}>Username</Text>
            <Text style={[styles.columnHeader, { width: 80 }]}>Banned</Text>
            <Text style={[styles.columnHeader, { width: 60 }]}>Spam</Text>
            <Text style={[styles.columnHeader, { width: 90 }]}>Role</Text>
            <Text style={[styles.columnHeader, { width: 110, textAlign: 'center' }]}>Actions</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={28} color="#000" />
                    </Pressable>
                    <Text style={styles.headerText}>All Users</Text>
                </View>
            </View>

            <View style={[styles.filterWrapper, { zIndex: 1000 }]}>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                />
            </View>

            {loading ? (
                <View style={styles.loaderBox}><ActivityIndicator size="large" color="#2563eb" /></View>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View>
                        {renderHeader()}
                        <FlatList
                            data={allUsers}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item, index }) => (
                                <View style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                                    <TouchableOpacity style={{ width: 140 }} onPress={() => router.push(`/(tabs)/profile/${item?._id}`)}>
                                        <Text style={styles.userNameText} numberOfLines={1}>{item.userName}</Text>
                                    </TouchableOpacity>

                                    <Text style={[styles.cell, { width: 80 }]}>{item.isBanned ? "🚫 Yes" : "No"}</Text>
                                    <Text style={[styles.cell, { width: 60 }]}>{item.spamMarkCount}</Text>
                                    <Text style={[styles.cell, { width: 90 }]}>{item.role} {item?.isTeacher && '✅'}</Text>

                                    <View style={[styles.actions, { width: 110 }]}>
                                        {item.isBanned ? (
                                            <TouchableOpacity style={styles.unbanBtn} onPress={() => unbanUser(item._id)}>
                                                {load && toBanUserId === item._id ? (
                                                    <ActivityIndicator size="small" color="#fff" />
                                                ) : (
                                                    <Text style={styles.btnText}>Unban</Text>
                                                )}
                                            </TouchableOpacity>
                                        ) : item.isTeacher ? (
                                            <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromTeacher(item._id)}>
                                                <Text style={styles.btnText}>Remove</Text>
                                            </TouchableOpacity>
                                        ) : item.isAppliedForTeacherRole ? (
                                            <TouchableOpacity style={styles.approveBtn} onPress={() => approveApplication(item._id)}>
                                                <Text style={styles.btnText}>Approve</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity style={styles.banBtn} onPress={() => banUser(item._id)}>
                                                {load && toBanUserId === item._id ? (
                                                    <ActivityIndicator size="small" color="#fff" />
                                                ) : (
                                                    <Text style={styles.btnText}>Ban</Text>
                                                )}
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 10,
        paddingBottom: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    headerText: { fontSize: 22, fontWeight: "bold", color: "#1a1a1a" },
    backBtn: { padding: 5 },
    filterWrapper: { padding: 15, backgroundColor: "#f9f9f9" },
    dropdown: { borderColor: "#ddd" },
    dropdownContainer: { borderColor: "#ddd" },
    tableHeader: { flexDirection: 'row', backgroundColor: '#1f2937', paddingVertical: 12, paddingHorizontal: 15 },
    columnHeader: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderColor: '#eee' },
    evenRow: { backgroundColor: '#fff' },
    oddRow: { backgroundColor: '#f9fafb' },
    cell: { fontSize: 14, color: '#333' },
    userNameText: { fontSize: 14, fontWeight: '700', color: '#2563eb' },
    actions: { alignItems: 'center' },
    btnText: { color: "#fff", fontSize: 11, fontWeight: 'bold' },
    banBtn: { backgroundColor: "#ef4444", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5 },
    unbanBtn: { backgroundColor: "#10b981", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5 },
    approveBtn: { backgroundColor: "#10b981", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5 },
    removeBtn: { backgroundColor: "#6366f1", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5 },
    loaderBox: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default AllUsers;