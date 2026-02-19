import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const BanCountdown = ({ banDuration }: { banDuration: string | Date }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        if (!banDuration) return;

        const endTime = new Date(banDuration).getTime();

        const interval = setInterval(() => {
            const now = Date.now();
            let diff = Math.max(0, endTime - now);

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, [banDuration]);

    if (!banDuration) return null;

    const formatNum = (num: number) => num.toString().padStart(2, '0');

    return (
        <View style={styles.container}>
            <View style={styles.timeBox}>
                <Text style={styles.number}>{formatNum(timeLeft.days)}</Text>
                <Text style={styles.label}>days</Text>
            </View>

            <View style={styles.timeBox}>
                <Text style={styles.number}>{formatNum(timeLeft.hours)}</Text>
                <Text style={styles.label}>hours</Text>
            </View>

            <View style={styles.timeBox}>
                <Text style={styles.number}>{formatNum(timeLeft.minutes)}</Text>
                <Text style={styles.label}>min</Text>
            </View>

            <View style={styles.timeBox}>
                <Text style={styles.number}>{formatNum(timeLeft.seconds)}</Text>
                <Text style={styles.label}>sec</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        marginVertical: 10,
    },
    timeBox: {
        alignItems: 'center',
    },
    number: {
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        color: '#1a1a1a',
        backgroundColor: '#f3f4f6',
        padding: 8,
        borderRadius: 8,
        minWidth: 50,
        textAlign: 'center',
        overflow: 'hidden'
    },
    label: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
        textTransform: 'uppercase',
    },
});

export default BanCountdown;