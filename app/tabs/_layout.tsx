import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "@/config/config";
import { setUserData } from "@/redux/userSlice";
import Toast from "react-native-toast-message";
import LoginMessage from "../components/LoginMessage";
import { useState } from "react";
import Button from "../components/ui/Button";

export default function TabLayout() {
    const { user, isLoggedIn, loading } = useCurrentUser();
    const [showLoginMsg, setShowLoginMsg] = useState(false);
    const dispatch = useDispatch();

    async function handleLogOut() {
        try {
            await axios.get(`${serverUrl}/api/v1/auth/logout`, {
                withCredentials: true,
            });
            dispatch(setUserData(null));
            router.back();
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: error?.response?.data?.message || error?.message,
            });
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Tabs>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'QuerySphere',
                        headerTitleStyle: {
                            fontWeight: '900',
                            paddingHorizontal: 10,
                            fontSize: 25
                        },
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
                        headerRight: () => (
                            loading ? (
                                <ActivityIndicator style={{ marginRight: 30 }} />
                            )
                                : !loading && isLoggedIn ? (
                                    <Image source={user?.profileImage ? { uri: user.profileImage } : require("../../assets/user.png")} style={styles.userImage} />
                                ) : (
                                    <Button text={'Login'} onClick={() => router.push('/login')} style={{
                                        padding: 10,
                                        marginHorizontal: 20,
                                    }} />
                                )
                        )
                    }} />
                <Tabs.Screen
                    name="search"
                    options={{
                        tabBarLabel: 'Search',
                        tabBarIcon: ({ color }) => <Ionicons size={28} name="search" color={color} />,
                        title: 'Search Users',
                        headerLeft: () => (
                            <Ionicons name="arrow-back" size={22} style={{ marginLeft: 20, marginRight: 10 }} onPress={() => router.push("..")} />
                        ),
                        headerTitleStyle: { fontWeight: 800 }
                    }} />
                <Tabs.Screen
                    name="chat"
                    options={{
                        tabBarLabel: 'Chat',
                        tabBarIcon: ({ color }) => <Ionicons size={28} name="chatbox" color={color} />
                    }}
                    listeners={{
                        tabPress: (e) => {
                            if (!isLoggedIn) {
                                e.preventDefault();
                                setShowLoginMsg(true);
                            }
                        },
                    }} />
                <Tabs.Screen
                    name="feed"
                    options={{
                        tabBarLabel: 'Feed',
                        tabBarIcon: ({ color }) => <Ionicons size={28} name="albums" color={color} />,
                        headerTitle: () => (
                            <Text>Feed</Text>
                        )
                    }}
                    listeners={{
                        tabPress: (e) => {
                            if (!isLoggedIn) {
                                e.preventDefault();
                                setShowLoginMsg(true);
                            }
                        },
                    }} />
                <Tabs.Screen
                    name={isLoggedIn ? "profile/[id]" : "login"}
                    options={{
                        tabBarLabel: 'Profile',
                        headerTitle: 'Profile',
                        headerRight: () => (
                            <Button text={'Logout'} onClick={handleLogOut} style={{
                                padding: 10,
                                marginHorizontal: 20,
                            }} />
                        ),
                        tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />
                    }} />
            </Tabs>
            {showLoginMsg && <LoginMessage
                visible={showLoginMsg}
                onClose={() => setShowLoginMsg(false)}
            />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginHorizontal: 20,
    },
})