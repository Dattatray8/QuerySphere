import { StyleSheet, Text } from 'react-native'
import React from 'react'

const Button = ({ text, onClick, style }: { text: string, onClick: () => void, style?: any }) => {
    return (
        <Text style={[styles.btn, style]} onPress={onClick}>{text}</Text>
    )
}

export default Button

const styles = StyleSheet.create({
    btn: {
        borderWidth: 1,
        borderColor: '#e8e8e8',
        borderRadius: 5,
        backgroundColor: '#f8f8f8',
    }
})