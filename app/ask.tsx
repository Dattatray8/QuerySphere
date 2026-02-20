import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import Button from './components/ui/Button'
import * as ImagePicker from 'expo-image-picker';
import VideoPlayer from './components/VideoPlayer'
import axios from 'axios'
import { serverUrl } from '@/config/config'
import { setQuestions } from '@/redux/questionSlice'
import { useDispatch, useSelector } from 'react-redux'
import Toast from 'react-native-toast-message'
import BannedMessage from './components/BanMessage'
import { User } from '@/types/global.types'

const Ask = () => {
    const [question, setQuestion] = useState("");
    const { userData } = useSelector((state: User) => state.user);
    const [isBannedModalVisible, setIsBannedModalVisible] = useState(false);
    const [frontendImage, setFrontendImage] = useState<string | null>(null);
    const [backendImage, setBackendImage] = useState<{
        uri: string;
        name: string;
        type: string;
    } | null>(null);
    const [mediaType, setMediaType] = useState("");
    const [height, setHeight] = useState(40);
    const [qZoomImg, setQZoomImg] = useState<boolean>(false);
    const { questions } = useSelector((state: any) => state.question);
    const handleImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert('Permission required');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos', 'livePhotos'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];

            setFrontendImage(asset.uri);
            setMediaType(asset.type!)

            setBackendImage({
                uri: asset.uri,
                name: asset.fileName ?? 'profile.jpg',
                type: asset.mimeType ?? 'image/jpeg',
            });
        }
    };
    const dispatch = useDispatch();

    const handleAskQuestion = async () => {
        try {
            if (question.length < 20) {
                Toast.show({ type: 'error', text1: "Question is too short" })
                return
            }
            if (userData?.isBanned) {
                setIsBannedModalVisible(true);
                return
            }
            const formData = new FormData();
            formData.append("question", question);
            formData.append("mediaType", mediaType);
            if (backendImage) {
                formData.append("media", {
                    uri: backendImage.uri,
                    name: backendImage.name,
                    type: backendImage.type,
                } as any);
            }
            const res = await axios.post(`${serverUrl}/api/v1/questions`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            console.log(res.data)
            dispatch(setQuestions([res?.data?.populatedQuestion, ...questions]));
            Toast.show({ type: 'success', text1: res?.data?.message })
            router.push('/(tabs)/feed');
        } catch (error: any) {
            console.log(error)
            Toast.show({ type: 'error', text1: error?.response?.data?.message || error.message })
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <BannedMessage
                visible={isBannedModalVisible}
                onClose={() => setIsBannedModalVisible(false)}
            />
            <ScrollView style={{ minHeight: '100%' }}>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Pressable onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={25} />
                        </Pressable>
                        <Text style={styles.headerText}>Answer</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <Pressable onPress={handleImage}>
                            <Ionicons name="cloud-upload-outline" size={25} />
                        </Pressable>

                        <Button
                            text="Ask"
                            onClick={handleAskQuestion}
                            style={{ padding: 13 }}
                        />
                    </View>
                </View>

                {frontendImage && mediaType === "image" && (
                    <Pressable onPress={() => setQZoomImg(true)}>
                        <Image source={{ uri: frontendImage }} style={styles.media} />
                    </Pressable>
                )}

                {frontendImage && mediaType === "video" && (
                    <VideoPlayer source={frontendImage} />
                )}

                <TextInput
                    multiline
                    placeholder="Write here..."
                    value={question}
                    onChangeText={setQuestion}
                    style={{
                        height: Math.max(40, height),
                        paddingVertical: 15,
                        fontSize: 16,
                        textAlignVertical: "top",
                        paddingHorizontal: 25,
                        marginBottom: 300
                    }}
                    onContentSizeChange={(e) =>
                        setHeight(e.nativeEvent.contentSize.height)
                    }
                />
            </ScrollView>
            {qZoomImg && mediaType === "image" && (
                <View style={styles.zoomImageContainer}>
                    <Pressable
                        style={styles.closeBtn}
                        onPress={() => setQZoomImg(false)}
                    >
                        <Ionicons name="close" size={26} />
                    </Pressable>

                    <Image
                        source={{ uri: frontendImage! }}
                        style={styles.zoomImage}
                    />
                </View>
            )}
        </View>
    )
}

export default Ask

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
        alignItems: "center",
        gap: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 15,
        backgroundColor: "#fff",
        justifyContent: 'space-between'
    },

    headerText: {
        fontSize: 20,
        fontWeight: "bold",
    },

    zoomImageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },

    zoomImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },

    closeBtn: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 6,
        zIndex: 10000,
    },

    media: {
        width: "auto",
        objectFit: "cover",
        height: 100,
    },
})