import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const AcceptedBadge = () => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <Text style={styles.badgeText}>Accepted</Text>
        </View>
    )
}

export default AcceptedBadge

const styles = StyleSheet.create({
    badgeText: {
        borderWidth: 1,
        borderColor: "#f9cd5f",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        fontSize: 12,
        color: "#f9cd5f",
        fontWeight: "500",
    },
})