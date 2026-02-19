import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import useProfileTabData from '@/hooks/useProfileTabData';
import { getLabel } from '@/utils/getLabel';
import Question from '@/app/components/question/Question';

const Index = () => {
    const route = useRoute();
    let params = route?.params as { key: string, id: string }
    const { profileData } = useSelector((state: any) => state.user);
    const { loading } = useProfileTabData(params?.key, params?.id);

    const { questionsAsked } = useSelector((state) => state.student);
    const { questionsAnswered } = useSelector((state) => state.student);
    const { questionsAccepted, questionsVerified } = useSelector(
        (state) => state.student
    );
    const { teacherAnswers } = useSelector((state) => state.admin);
    let tabLabel = getLabel(params?.key);
    let dataToRender = [];
    if (tabLabel === "Questions" && profileData?.role === "student") {
        dataToRender = questionsAsked || [];
    }
    if (tabLabel === "Answers" && profileData?.role === "student") {
        dataToRender = questionsAnswered || [];
    }
    if (tabLabel === "Accepted Answers" && profileData?.role === "student") {
        dataToRender = questionsAccepted || [];
    }
    if (tabLabel === "Verified Answers" && profileData?.role === "student") {
        dataToRender = questionsVerified || [];
    }
    if (tabLabel === "Answers" && profileData?.role === "teacher") {
        dataToRender = teacherAnswers || [];
    }
    return (
        <ScrollView>
            {loading ? (
                <ActivityIndicator style={{ marginTop: 300 }} size={30} />
            ) : dataToRender.length === 0 && !loading ? (
                <Text className="flex justify-center items-center h-[60vh] text-gray-500">
                    No data found
                </Text>
            ) : (
                <View style={styles.queContainer}>
                    {dataToRender.map((item: object, idx: number) => <Question q={item} key={idx} />)}
                </View>
            )}
        </ScrollView>
    )
}

export default Index

const styles = StyleSheet.create({
    queContainer: {
        marginVertical: 20,
        flexDirection: 'column',
        gap: 20,
    }
})