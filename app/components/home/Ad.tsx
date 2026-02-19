import { ScrollView, StyleSheet, Text } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'

const Ad = () => {
    return (
        <LinearGradient
            colors={['#4450ffff', '#eb359c']}
            start={[0, 0]}
            end={[1, 0]}
        >
            <ScrollView style={styles.conatiner}>
                <Text style={styles.que}>Ready to Transform Your Learning?</Text>
                <Text style={styles.ans}>Join your institution&apos;s private Q&A network today</Text>
                <Text style={styles.btn} onPress={() => router.push('/(tabs)/feed')}>Get Started Now</Text>
            </ScrollView>
        </LinearGradient>
    )
}

export default Ad

const styles = StyleSheet.create({
    conatiner: {
        paddingVertical: 80,
    },

    que: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#fff',
        fontSize: 40,
        lineHeight: 50,
        fontWeight: 800,
        paddingHorizontal: 20
    },

    ans: {
        textAlign: 'center',
        marginBottom: 25,
        color: '#d2c7f1',
        fontSize: 22,
        marginHorizontal: 30
    },

    btn: {
        textAlign: 'center',
        color: '#422ad5',
        fontWeight: 'bold',
        fontSize: 20,
        backgroundColor: '#fff',
        marginHorizontal: 75,
        paddingVertical: 15,
        borderRadius: 10
    }
})