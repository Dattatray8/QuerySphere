import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
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
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />
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
                    headerTitleStyle: {fontWeight: 800}
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
                name="profile"
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />
                }} />
        </Tabs>
    )
}