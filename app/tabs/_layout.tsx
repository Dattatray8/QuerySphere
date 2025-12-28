import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Image, StyleSheet, Text } from "react-native";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function TabLayout() {
    const { user, isLoggedIn, loading } = useCurrentUser();

    return (
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
                                <Text style={styles.authBtn}>Login</Text>
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
                }} />
            <Tabs.Screen
                name="feed"
                options={{
                    tabBarLabel: 'Feed',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="albums" color={color} />
                }} />
            <Tabs.Screen
                name={isLoggedIn ? "profile/[id]" : "login"}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />
                }} />
        </Tabs>
    )
}

const styles = StyleSheet.create({
    authBtn: {
        backgroundColor: '#f8f8f8',
        padding: 10,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: '#e8e8e8',
        borderRadius: 5
    },

    userImage: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginHorizontal: 20,
    },
})