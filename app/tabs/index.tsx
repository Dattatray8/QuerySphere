import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'

const index = () => {
    return (
        <ScrollView>
            <Hero />
            <Features />
        </ScrollView>
    )
}

export default index

const styles = StyleSheet.create({})