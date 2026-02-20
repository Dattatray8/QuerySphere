import { Modal, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const LoginMessage = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Pressable onPress={onClose} style={styles.close}>
                        <Ionicons name="close" size={22} color="black" />
                    </Pressable>

                    <Text style={styles.title}>Login Required</Text>

                    <Text style={styles.desc}>
                        Please login or create an account to explore the feed, ask questions,
                        and get your doubts solved instantly.
                    </Text>

                    <View style={styles.actions}>
                        <Text
                            onPress={() => {
                                onClose();
                                router.push('/login');
                            }}
                        >
                            Login
                        </Text>

                        <Text
                            onPress={() => {
                                onClose();
                                router.push('/signup');
                            }}
                        >
                            SignUp
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default LoginMessage;


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
    },
    close: {
        position: "absolute",
        right: 10,
        top: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
    },
    desc: {
        color: "#555",
        marginBottom: 15,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
