import { ScrollView } from 'react-native'
import React from 'react'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import Ad from '../components/home/Ad'

const index = () => {
    return (
        <ScrollView>
            <Hero />
            <Features />
            <Ad />
        </ScrollView>
    )
}

export default index