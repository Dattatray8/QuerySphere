import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '@/config/config'
import { setUserData } from '@/redux/userSlice'

const login = () => {
    const [loading, setLoading] = useState(false);
    const [formValue, setFormValue] = useState({
        userName: "",
        password: "",
    });
    const dispatch = useDispatch();

    const handleLogin = async () => {
        for (let key in formValue) {
            if (formValue[key] === "") {
                ToastAndroid.show(`${key} is empty`, 2);
                return;
            }
        }
        try {
            setLoading(true);
            const res = await axios.post(
                `${serverUrl}/api/v1/auth/login`,
                formValue,
                { withCredentials: true }
            );
            ToastAndroid.show(res?.data?.message, 2);
            dispatch(setUserData(res?.data?.safeUser));
            router.back();
        } catch (error: any) {
            setLoading(false);
            ToastAndroid.show(error?.response?.data?.message || error?.message, 2);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.container}>
                        <View style={styles.loginContainer}>
                            <View style={styles.head}>
                                <Text style={styles.titleText}>Login to QuerySphere</Text>
                            </View>
                            <View style={styles.body}>
                                <View style={styles.inputBox}>
                                    <Ionicons name='person' color={"#cdcdcdff"} />
                                    <TextInput placeholder='Username' placeholderTextColor={"#cdcdcdff"} style={{ width: 250 }} accessibilityLabel="Username Input" onChangeText={(text) => setFormValue({ ...formValue, userName: text })} />
                                </View>
                                <View style={styles.inputBox}>
                                    <Ionicons name='lock-closed' color={"#cdcdcdff"} />
                                    <TextInput placeholder='Password' secureTextEntry={true} placeholderTextColor={"#cdcdcdff"} style={{ width: 250 }} onChangeText={(text) => setFormValue({ ...formValue, password: text })} />
                                </View>
                                <Pressable style={styles.button} onPress={handleLogin}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                                        {loading ? (
                                            <ActivityIndicator />
                                        ) : "Login"}
                                    </Text>
                                </Pressable>
                            </View>
                            <View style={styles.footer}>
                                <Text>Don't Have an account?</Text>
                                <Text style={{ color: 'blue' }} onPress={() => router.push('/signup')}>Sign Up</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default login

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    loginContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        height: 400,
        width: 400,
        backgroundColor: "#fff",
        justifyContent: "center",
        gap: 30
    },

    logo: {
        height: 40,
        width: 40
    },

    head: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center"
    },

    titleText: {
        fontWeight: "800",
        fontSize: 24,
    },

    body: {
        alignItems: 'center',
        gap: 20
    },

    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderColor: '#e8e8e8',
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 15,
        width: 300,
        borderRadius: 5
    },

    button: {
        backgroundColor: "#f8f8f8",
        paddingVertical: 10,
        width: 300,
        alignItems: 'center',
        elevation: 2,
        borderRadius: 5
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5
    }
})