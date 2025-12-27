import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'

const signup = () => {
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
                                
                                <View style={styles.inputBox}>
                                    <Ionicons name='person' color={"#cdcdcdff"} />
                                    <TextInput placeholder='Username' placeholderTextColor={"#cdcdcdff"} style={{ width: 250 }} />
                                </View>
                                <View style={styles.inputBox}>
                                    <Ionicons name='mail' color={"#cdcdcdff"} />
                                    <TextInput placeholder='mail@site.com' placeholderTextColor={"#cdcdcdff"} style={{ width: 250 }} />
                                </View>
                                <View style={styles.inputBox}>
                                    <Ionicons name='lock-closed' color={"#cdcdcdff"} />
                                    <TextInput placeholder='Password' secureTextEntry={true} placeholderTextColor={"#cdcdcdff"} style={{ width: 250 }} />
                                </View>
                                <Pressable style={styles.button}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>SignUp</Text>
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

export default signup

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
    }
})