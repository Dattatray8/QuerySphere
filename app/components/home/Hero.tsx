import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const Hero = () => {
    return (
        <ScrollView>
            <View style={styles.hero}>
                <View style={styles.heroTitle}>
                    <Text style={styles.heroTitleText1}>Welocome to</Text>
                    <Text style={styles.heroTitleText2}>QuerySphere</Text>
                </View>
                <Text style={styles.heroDesc}>Your institution's private doubt-solving ecosystem. Get instant answers through peer collaboration, AI assistance, and teacher-verified solutions.</Text>
                <Text style={styles.heroBtn1} onPress={() => router.push('/tabs/chat')}>Start Asking</Text>
                <Text style={styles.heroBtn2} onPress={() => router.push('/tabs/feed')}>Explore Feed</Text>
            </View>
        </ScrollView>
    )
}

export default Hero

const styles = StyleSheet.create({
    hero: {
        paddingHorizontal: 20
    },
    heroTitle: {
        flexDirection: 'column',
        justifyContent: 'center',
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
    }
})