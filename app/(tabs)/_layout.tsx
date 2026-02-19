import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import useCurrentUser from "@/hooks/useCurrentUser";
import LoginMessage from "../components/LoginMessage";
import { useContext, useState } from "react";
import Button from "../components/ui/Button";
import SocketContext from "../context/SocketContext";

export default function TabLayout() {
    const { user, isLoggedIn, loading }: { user: any; isLoggedIn: boolean; loading: boolean } = useCurrentUser();
    const [showLoginMsg, setShowLoginMsg] = useState(false);
    const { onlineUsers } = useContext(SocketContext);
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
                        headerTitleStyle: { fontWeight: 800, marginLeft: 10 }
                    }} />
                <Tabs.Screen
                    name="chat"
                    options={{
                        headerTitle: () => (
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 22, marginLeft: 10 }}>Chat</Text>
                                <Text style={{ color: 'green', marginLeft: 10 }}>{onlineUsers.length} online</Text>
                            </View>
                        ),
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
                        headerRight: () => <Button text="Ask" onClick={() => router.push('/ask')} style={{ paddingHorizontal: 15, marginHorizontal: 20, paddingVertical: 10 }} />,
                        tabBarIcon: ({ color }) => <Ionicons size={28} name="albums" color={color} />,
                        headerTitle: () => (
                            <Text style={{ fontWeight: 'bold', fontSize: 22, marginLeft: 10 }}>Feed</Text>
                        ),
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
                    name="profile"
                    options={{
                        tabBarLabel: "Profile",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="person" size={26} color={color} />
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => {
                            if (!isLoggedIn) {
                                e.preventDefault();
                                setShowLoginMsg(true);
                            } else {
                                e.preventDefault();
                                router.replace("/(tabs)/profile");
                            }
                        },
                    }}
                />
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

    backArrow: {
        marginLeft: 20,
        marginRight: 5,
    }
})