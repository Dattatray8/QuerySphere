import { Text, StyleSheet } from "react-native";

function Bio({ bio }: { bio: string }) {
    return (
        <Text style={styles.text}>{bio}</Text>
    );
}

export default Bio;

const styles = StyleSheet.create({
    text: {
        backgroundColor: "#e5e7eb",
        borderRadius: 12,
        padding: 16,
        fontSize: 14,
        color: "rgba(0, 0, 0, 0.7)",
    },
});
