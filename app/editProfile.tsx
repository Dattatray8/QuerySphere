import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'
import Button from "@/app/components/ui/Button"
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message'
import { serverUrl } from '@/config/config'
import axios from 'axios'
import { setProfileData, setUserData } from '@/redux/userSlice'

interface UserData {
    id: string;
    userName: string;
    bio: string;
    profession: string,
    profileImage?: string;
}

interface IUser {
    userName: string;
    bio: string;
    profession: string,
}

interface RootState {
    user: {
        userData: UserData | null;
    };
}

const EditProfile = () => {
    const { userData } = useSelector((state: RootState) => state.user)
    const [data, setData] = useState<IUser>({
        userName: "",
        bio: "",
        profession: "",
    });

    const [loading, setLoading] = useState<boolean>(false)
    const [frontendImage, setFrontendImage] = useState<string | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userData) return;

        setData({
            userName: userData.userName ?? "",
            bio: userData.bio ?? "",
            profession: userData.profession ?? "",
        });

        setFrontendImage(userData.profileImage ?? null);
    }, [userData]);

    const [backendImage, setBackendImage] = useState<{
        uri: string;
        name: string;
        type: string;
    } | null>(null);

    const handleImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert('Permission required');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];

            setFrontendImage(asset.uri);

            setBackendImage({
                uri: asset.uri,
                name: asset.fileName ?? 'profile.jpg',
                type: asset.mimeType ?? 'image/jpeg',
            });
        }
    };

    const handleEditProfile = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("userName", data.userName);
            formData.append("bio", data.bio);
            formData.append("profession", data.profession);
            if (backendImage) {
                formData.append("profileImage", {
                    uri: backendImage.uri,
                    name: backendImage.name,
                    type: backendImage.type,
                } as any);
            }
            let res = await axios.put(
                `${serverUrl}/api/v1/users/editProfile`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setLoading(false);
            Toast.show({ type: 'success', text1: res?.data?.message })
            dispatch(setUserData(res?.data?.user));
            dispatch(setProfileData(res?.data?.user));
            router.back();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error.response?.data?.message ?? error.message,
            });

            setLoading(false);
        }
    };

    return (
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name='chevron-back' size={25} />
                </Pressable>
                <Text style={styles.headerText}>EditProfile</Text>
            </View>
            <View style={styles.container}>
                <Pressable onPress={handleImage}>
                    <Image
                        style={styles.avatar}
                        source={
                            frontendImage
                                ? { uri: frontendImage }
                                : require("../assets/user.png")
                        }
                    />
                </Pressable>
                <TextInput
                    style={styles.inputBox}
                    onChangeText={(text) => setData({ ...data, userName: text })}
                    value={data?.userName} />
                <TextInput
                    style={styles.inputBox}
                    onChangeText={(text) => setData({ ...data, profession: text })}
                    value={data?.profession} />
                <TextInput
                    style={styles.inputBox}
                    onChangeText={(text) => setData({ ...data, bio: text })}
                    value={data?.bio} />
                {loading ? (
                    <Text><ActivityIndicator /> </Text>
                ) : (
                    <Button text='Save Profile' onClick={handleEditProfile} style={{ padding: 15, alignSelf: "center" }} />
                )}
            </View>
        </View>
    )
}

export default EditProfile

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

    inputBox: {
        borderColor: '#e8e8e8',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: 300,
        borderRadius: 5
    },

    container: {
        paddingVertical: 30,
        width: 400,
        justifyContent: "center",
        gap: 30,
        flexDirection: 'column',
        alignItems: 'center'
    },

    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
    },
})