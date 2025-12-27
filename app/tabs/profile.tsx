import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { router } from 'expo-router';

const profile = () => {
  const isLogin = false;
  useEffect(() => {
    if (!isLogin) {
      router.push("/login")
    }
  }, [])
  return (
    <View>
      <Text>profile</Text>
    </View>
  )
}

export default profile

const styles = StyleSheet.create({})