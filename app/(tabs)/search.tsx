import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import axios from "axios"
import { serverUrl } from '@/config/config'
import Toast from 'react-native-toast-message'
import { router } from 'expo-router'

const Search = () => {
  let [search, setSearch] = useState("");
  let [results, setResults] = useState([]);
  let [loading, setLoading] = useState(false);
  let [emptySearch, setEmptySearch] = useState(true);

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/v1/users/search?keyword=${encodeURIComponent(
        search.trim()
      )}`, { withCredentials: true })
      setResults(res?.data.users || []);
    } catch (error: any) {
      setLoading(false);
      Toast.show({ type: 'error', text1: error?.response?.data?.message || error.message })
    } finally {
      setLoading(false);
    }
  }

  const handleSearchClick = () => {
    if (!search.trim()) {
      Toast.show({ type: 'error', text1: "Empty search not possible" })
      return
    }
    getUsers()
  }

  useEffect(() => {
    setEmptySearch(!search.trim());
  }, [search]);

  return (
    <ScrollView>
      <View style={styles.searchArea}>
        <TextInput placeholder='Search by username...' onChangeText={(text) => {
          setSearch(text);
        }} style={styles.input} onSubmitEditing={handleSearchClick} />
        <Ionicons name='search' style={[styles.searchIcon, { backgroundColor: `${emptySearch ? '#e8e8e8' : '#422ad5'}`, color: `${emptySearch ? '#cacaca' : '#fff'}` }]} onPress={handleSearchClick} />
      </View>

      {!loading && !search.trim() && (
        <View style={styles.defaultMsgContainer}>
          <Ionicons name='search' style={styles.searchIcon2} />
          <Text style={styles.heading}>Find Users</Text>
          <Text style={styles.subHeading}>Start typing to search</Text>
        </View>
      )}

      {loading && search.length !== 0 && (
        <View style={styles.skeletonContainer}>
          {
            Array.from({ length: 10 }).map((_, index) => (
              <View style={styles.skeletonBox} key={index}>
                <View style={styles.skeletonImage}></View>
                <View style={styles.skeletonName}></View>
              </View>
            ))
          }
        </View>
      )}

      {!loading && search && results.length !== 0 && (
        <View style={styles.resultContainer}>
          {results.map((user: any, idx) => (
            <View key={idx}>
              <Pressable onPress={() => router.push(`/(tabs)/profile/${user._id}`)} style={styles.resultBox}>
                <Image source={user?.profileImage ? { uri: user.profileImage } : require("../../assets/user.png")}
                  style={styles.resultImage} />
                <Text style={styles.resultText}>{user.userName}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {!loading && search && results.length === 0 && (
        <View style={styles.defaultMsgContainer}>
          <Ionicons name='search' style={styles.searchIcon2} />
          <Text style={styles.heading}>No User Found</Text>
        </View>
      )}
    </ScrollView>
  )
}

export default Search;

const styles = StyleSheet.create({
  searchArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },

  input: {
    borderColor: '#e8e8e8',
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: 2,
    width: 300,
    padding: 13,
  },

  searchIcon: {
    paddingHorizontal: 13,
    paddingVertical: 14,
    fontSize: 20,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
  },

  defaultMsgContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 80,
    gap: 10
  },

  searchIcon2: {
    fontSize: 100,
    color: '#cacaca'
  },

  heading: {
    fontWeight: '800',
    fontSize: 25
  },

  subHeading: {
    color: '#5b5b62',
    fontSize: 20
  },

  skeletonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },

  skeletonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: 345,
    backgroundColor: '#f9f9f9',
    padding: 10
  },

  skeletonImage: {
    width: 50,
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    marginRight: 15,
  },

  skeletonName: {
    width: '60%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },

  resultContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },

  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: 345,
    backgroundColor: '#e8e8e8',
    padding: 10
  },

  resultImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  resultText: {
    fontWeight: '800',
    marginLeft: 10
  }
})