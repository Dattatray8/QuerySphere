import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function Header({ profileData, userData, onEdit }: { profileData: any, userData: any, onEdit: () => void }) {
    const isOwner = userData?._id === profileData?._id;

    return (
        <View style={styles.container}>
            <View style={styles.avatarWrapper}>
                <Image
                    source={
                        profileData?.profileImage
                            ? { uri: profileData.profileImage }
                            : require("../../../assets/user.png")
                    }
                    style={styles.avatar}
                />
            </View>

            <View style={styles.info}>
                <Text style={styles.name}>{profileData?.userName}</Text>

                {profileData?.profession && (
                    <Text style={styles.badgeText}>
                        {profileData.profession}
                    </Text>
                )}
            </View>

            {isOwner && (
                <Pressable onPress={onEdit} style={styles.editIcon}>
                    <Ionicons
                        name="create-outline"
                        size={20}
                        color="#3b82f6"
                    />
                </Pressable>
            )}
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 40,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },

    avatarWrapper: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 2,
        borderColor: "#3b82f6",
        justifyContent: "center",
        alignItems: "center",
    },

    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
    },

    info: {
        alignItems: "center",
        gap: 8,
    },

    name: {
        fontSize: 18,
        fontWeight: "600",
    },

    badgeText: {
        borderWidth: 1,
        borderColor: "#3b82f6",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        fontSize: 12,
        color: "#3b82f6",
        fontWeight: "500",
    },

    editIcon: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 6,
    },
});
