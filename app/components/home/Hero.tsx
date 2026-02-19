import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from "expo-linear-gradient"
import useCurrentUser from '@/hooks/useCurrentUser'
import LoginMessage from '../LoginMessage'

const Hero = () => {
    const { isLoggedIn } = useCurrentUser();
    const [showLoginMsg, setShowLoginMsg] = useState(false);
    const heroFeatures = [
        {
            icon: 'shield-outline',
            heading: 'Spam-Free',
            sub: 'Real-time',
            color: '#422ad5'
        },
        {
            icon: 'flash-outline',
            heading: 'AI-Help',
            sub: 'Instant',
            color: '#f43098'
        },
        {
            icon: 'checkmark-circle-outline',
            heading: 'Institution',
            sub: 'Private',
            color: '#00d3bb'
        }
    ]
    return (
        <LinearGradient
            colors={[
                'rgba(66,42,213,0.1)',
                '#e5e7eb',
                'rgba(244,48,152,0.1)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <ScrollView>
                <View style={styles.hero}>
                    <View style={styles.heroTitle}>
                        <Text style={styles.heroTitleText1}>Welocome to</Text>
                        <Text style={styles.heroTitleText2}>QuerySphere</Text>
                    </View>
                    <Text style={styles.heroDesc}>Your institution&apos;s private doubt-solving ecosystem. Get instant answers through peer collaboration, AI assistance, and teacher-verified solutions.</Text>
                    <Text style={styles.heroBtn1} onPress={() => {
                        if (!isLoggedIn) {
                            setShowLoginMsg(true)
                        } else {
                            router.push('/(tabs)/chat')
                        }
                    }}>Start Asking</Text>
                    <Text style={styles.heroBtn2} onPress={() => {
                        if (isLoggedIn) {
                            router.push('/(tabs)/feed')
                        } else {
                            setShowLoginMsg(true)
                        }
                    }}>Explore Feed</Text>
                </View>
                <View style={styles.featureContainer}>
                    {heroFeatures.map((feature, index) => (
                        <View key={index} style={styles.feature}>
                            <Ionicons name={feature.icon} style={styles.icon} color={feature.color} />
                            <View>
                                <Text style={styles.featureSub}>{feature.sub}</Text>
                                <Text style={styles.featueHeading}>{feature.heading}</Text>
                            </View>
                        </View>
                    ))}
                </View>
                {showLoginMsg && <LoginMessage
                    visible={showLoginMsg}
                    onClose={() => setShowLoginMsg(false)}
                />
                }
            </ScrollView>
        </LinearGradient>
    )
}

export default Hero

const styles = StyleSheet.create({
    hero: {
        paddingHorizontal: 20,
    },

    heroTitle: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
    },

    heroTitleText1: {
        fontWeight: '800',
        fontSize: 45,
    },

    heroTitleText2: {
        fontWeight: '800',
        color: '#422ad5',
        fontSize: 45
    },

    heroDesc: {
        color: '#5b5b62',
        fontSize: 20,
        textAlign: 'center',
        lineHeight: 30,
        paddingBottom: 30
    },

    heroBtn1: {
        fontWeight: '800',
        fontSize: 20,
        backgroundColor: '#422ad5',
        color: 'white',
        paddingVertical: 10,
        textAlign: 'center',
        borderRadius: 5,
        marginHorizontal: 10,
        marginBottom: 20,
        cursor: 'pointer'
    },

    heroBtn2: {
        fontWeight: '600',
        fontSize: 20,
        paddingVertical: 10,
        textAlign: 'center',
        borderRadius: 5,
        marginHorizontal: 10,
        borderColor: '#422ad5',
        borderWidth: 1,
        cursor: 'pointer'
    },

    featureContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 40,
        gap: 40
    },

    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        padding: 20,
        shadowColor: '#00000070',
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        elevation: 15,
        backgroundColor: "#fff",
        borderRadius: 5
    },

    icon: {
        fontSize: 40,
        fontWeight: 'bold'
    },

    featueHeading: {
        fontSize: 20,
        fontWeight: '800'
    },

    featureSub: {
        color: '#5b5b62',
    }
})