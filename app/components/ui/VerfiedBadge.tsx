import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const VerfiedBadge = () => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.badgeText}>Verified</Text>
    </View>
  )
}

export default VerfiedBadge

const styles = StyleSheet.create({
  badgeText: {
    borderWidth: 1,
    borderColor: "#80e9c8",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 12,
    color: "#80e9c8",
    fontWeight: "500",
  },
})