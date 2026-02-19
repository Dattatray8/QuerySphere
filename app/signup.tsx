import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import DropDownPicker from "react-native-dropdown-picker"
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '@/config/config'
import Toast from 'react-native-toast-message'
import { setUserData } from '@/redux/userSlice'

type formTypes = {
    role: string,
    userName: string,
    email: string,
    password: string,
}

const Signup = () => {
    const [open, setOpen] = useState(false);
    const items = [
        { label: 'Role', value: "" },
        { label: 'Student', value: 'student' },
        { label: 'Teacher', value: 'teacher' },
    ]
    const [loading, setLoading] = useState(false);
    const [formValue, setFormValue] = useState<formTypes>({
        role: "",
        userName: "",
        email: "",
        password: "",
    });
    const dispatch = useDispatch();

    const handleSignup = async () => {
        for (let key in formValue) {
            if (formValue[key as keyof formTypes] === "") {
                Toast.show({ type: "error", text1: `${key} is empty` });
                return;
            }
        }
        try {
            setLoading(true);
            const res = await axios.post(
                `${serverUrl}/api/v1/auth/signup`,
                formValue,
                { withCredentials: true }
            );
            Toast.show({ type: 'success', text1: res?.data?.message })
            dispatch(setUserData(res?.data?.safeUser));
            router.push('/(tabs)');
        } catch (error: any) {
            setLoading(false);
            Toast.show({ type: 'error', text1: error?.response?.data?.message || error?.message })
        } finally {
            setLoading(false);
        }
    };

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
                                <Text style={styles.titleText}>SignUp to QuerySphere</Text>
                            </View>
                            <View style={styles.body}>
                                <View style={styles.dropDownContainer}>
                                    <DropDownPicker
                                        items={items}
                                        value={formValue.role}
                                        open={open}
                                        setOpen={setOpen}
                                        setValue={(callback) =>
                                            setFormValue((prev) => ({
                                                ...prev,
                                                role: callback(prev.role),
                                            }))
                                        }
                                        style={styles.dropdown}
                                    />
                                </View>
                                <View style={styles.inputBox}>
                                    <Ionicons name='person' color={"#cdcdcdff"} />
                                    <TextInput placeholder='Username' placeholderTextColor={"#cdcdcdff"} style={{ width: 250 }} onChangeText={(text) => setFormValue({ ...formValue, userName: text })} />
                                </View>
                                <View style={styles.inputBox}>
                                    <Ionicons name='mail' color={"#cdcdcdff"} />
                                    <TextInput placeholder='mail@site.com' placeholderTextColor={"#cdcdcdff"} style={{ width: 250 }} onChangeText={(text) => setFormValue({ ...formValue, email: text })} />
                                </View>
                                <View style={styles.inputBox}>
                                    <Ionicons name='lock-closed' color={"#cdcdcdff"} />
                                    <TextInput placeholder='Password' secureTextEntry={true} placeholderTextColor={"#cdcdcdff"} style={{ width: 250 }} onChangeText={(text) => setFormValue({ ...formValue, password: text })} />
                                </View>
                                <Pressable style={styles.button} onPress={handleSignup}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                                        {loading ? (
                                            <ActivityIndicator />
                                        ) : "SignUp"}
                                    </Text>
                                </Pressable>
                            </View>
                            <View style={styles.footer}>
                                <Text>Already Have an account ?</Text>
                                <Text style={{ color: 'blue' }} onPress={() => router.push('/login')}>Login</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default Signup

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
        height: 550,
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
    },

    dropDownContainer: {
        width: 300,
        alignSelf: 'center'
    },

    dropdown: {
        borderColor: '#e8e8e8',
        borderWidth: 1,
    }
})