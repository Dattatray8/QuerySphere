import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import { getLabel } from '@/utils/getLabel'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '@/config/config'
import { setFilteredQuestions } from '@/redux/questionSlice'
import Toast from 'react-native-toast-message'
import { router } from 'expo-router'
import Question from '@/app/components/question/Question'

const ProfileTab = () => {
    const route = useRoute()
    let params = route?.params as { key: string, id: string }
    let tabLabel = getLabel(params.key)
    const { filteredQuestions } = useSelector((state: any) => state.question);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const getFilteredQuestions = async (filter: string) => {
        try {
            setLoading(true);
            const res = await axios.post(
                `${serverUrl}/api/v1/questions/filter/${filter}`,
                {},
                { withCredentials: true }
            );
            dispatch(setFilteredQuestions(res?.data?.questions));
        } catch (error: any) {
            setLoading(true);
            Toast.show({
                type: "error",
                text1: error?.response?.data?.message || error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFilteredQuestions(params?.key);
    }, [params?.key]);

    return (
        <ScrollView>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name='chevron-back' size={25} />
                </Pressable>
                <Text style={styles.headerText}>{tabLabel}</Text>
            </View>
            {loading ? (
                <ActivityIndicator style={{ marginTop: 300 }} size={30} />
            ) : filteredQuestions.length === 0 && !loading ? (
                <Text className="flex justify-center items-center h-[60vh] text-gray-500">
                    No data found
                </Text>
            ) : (
                <View style={styles.queContainer}>
                    {filteredQuestions.map((item: object, idx: number) => <Question q={item} key={idx} />)}
                </View>
            )}
        </ScrollView>
    )
}

export default ProfileTab

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
        alignItems: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 15,
        backgroundColor: "#fff"
    },

    headerText: {
        fontSize: 20,
        fontWeight: 'bold'
    },

    queContainer: {
        marginVertical: 20,
        flexDirection: 'column',
        gap: 20,
    }
})