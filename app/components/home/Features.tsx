import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const Features = () => {
    const features = [
        {
            icon: 'person-outline',
            title: 'Peer Collaboration',
            desc: 'Connect with classmates and help each other learn. Build a supportive academic community.',
            color: '#422ad5',
            bg: '#ece9fa'
        },
        {
            icon: 'hardware-chip-outline',
            title: 'AI-Powered',
            desc: 'Instant AI fallback with @ai trigger. Get immediate help when peers are unavailable.',
            color: '#f43098',
            bg: '#fdeaf4'
        },
        {
            icon: 'checkmark-circle-outline',
            title: 'Teacher Verified',
            desc: 'Answers verified by teachers for accuracy and credibility you can trust.',
            color: '#00d390',
            bg: '#e6fbf9'
        },
        {
            icon: 'shield-outline',
            title: 'Spam Control',
            desc: 'Advanced flagging, moderation, and ban system keeps discussions relevant and safe.',
            color: '#00d390',
            bg: '#e6fbf9'
        },
        {
            icon: 'chatbox-outline',
            title: 'Real-Time Chat',
            desc: 'Socket.IO powered instant messaging for seamless doubt resolution.',
            color: '#fcb700',
            bg: '#fff8e6'
        },
        {
            icon: 'flash-outline',
            title: 'Institution Private',
            desc: "Your college's own network. Safe, secure, and accessible only to verified students and teachers.",
            color: '#00bafe',
            bg: '#e6f9ff'
        },
    ]
    return (
        <ScrollView>
            <View style={styles.container1}>
                <Text style={styles.que}>Why QuerySphere?</Text>
                <Text style={styles.ans}>A complete solution for academic doubt resolution</Text>
            </View>
            <View style={styles.container2}>
                {features.map((feature, index) => (
                    <View key={index} style={styles.feature}>
                        <Ionicons name={feature.icon} style={[styles.icon, { backgroundColor: feature.bg }]} color={feature.color} />
                        <Text style={styles.title}>{feature.title}</Text>
                        <Text style={styles.desc}>{feature.desc}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}

export default Features

const styles = StyleSheet.create({
    container1: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 80,
        backgroundColor: '#f8f8f8'
    },

    que: {
        fontSize: 40,
        fontWeight: '800',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 50,
        paddingBottom: 15
    },

    ans: {
        color: '#5b5b62',
        fontSize: 20,
        textAlign: 'center',
        paddingHorizontal: 20
    },

    container2: {
        backgroundColor: '#f8f8f8',
        flexDirection: 'column',
        gap: 30,
        paddingBottom: 80
    },

    feature: {
        shadowColor: '#00000070',
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        elevation: 15,
        backgroundColor: "#fff",
        padding: 30,
        marginHorizontal: 30,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        borderRadius: 5
    },

    icon: {
        fontSize: 35,
        borderRadius: 100,
        padding: 20,
        width: 75,
        textAlign: 'center'
    },

    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20
    },

    desc: {
        color: '#5b5b62',
        textAlign: 'center',
        fontSize: 17
    }
})