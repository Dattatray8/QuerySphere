import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { formatTimestamp } from '@/utils/formatTimeStamp'
import { Ionicons } from '@expo/vector-icons'
import Button from '../ui/Button'
import { useSelector } from 'react-redux'
import { router } from 'expo-router'

const Question = ({ q }: { q: any }) => {
  const { userData } = useSelector((state: any) => state.user);

  return (
    <Pressable onPress={() => router.push(`/questions/q/${q?._id}`)}>
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Image source={q?.user?.profileImage ? { uri: q.user.profileImage } : require("../../../assets/user.png")} style={styles.userImage} />
          <Text style={{ fontWeight: 'bold' }}>{q?.user?.userName || 'Anonymous'}</Text>
          <Text>{formatTimestamp(q?.createdAt)}</Text>
        </View>
        <Text style={styles.question} numberOfLines={2}>{q?.question}</Text>
        {q?.media && (

          <View style={styles.mediaInfo}>
            <Ionicons name='image-outline' size={20} color={'gray'} />
            <Text style={{ color: 'gray' }}>Media</Text>
          </View>
        )}
        {userData?._id !== q?.user?._id && !q?.stopAnswering && (
          <View style={{ alignItems: 'flex-end' }}>
            <Button text='Answer' onClick={() => { }} style={{ padding: 12, marginVertical: 10 }} />
          </View>
        )}
      </View>
    </Pressable>

  )
}

export default Question

const styles = StyleSheet.create({
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  container: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 20,
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  question: {
    paddingVertical: 10,
    fontSize: 16,
  },

  mediaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  }
})