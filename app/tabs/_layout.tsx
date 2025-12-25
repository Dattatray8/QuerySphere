import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'QuerySphere',
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />
                }} />
                <Tabs.Screen
                name="search"
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="search" color={color} />
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