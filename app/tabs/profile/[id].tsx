import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { router } from 'expo-router';
import useCurrentUser from '@/hooks/useCurrentUser';

const profile = () => {
  const { user } = useCurrentUser();

  return (
    <View>
      <Text>profile {user?.userName}</Text>
    </View>
  )
}

export default profile

const styles = StyleSheet.create({})