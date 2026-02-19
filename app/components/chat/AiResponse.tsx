import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import Markdown from "react-native-markdown-display";
import { formatTimestamp } from "@/utils/formatTimeStamp";

const screenWidth = Dimensions.get("window").width;

const AiResponse = ({ message }) => {
    const speakText = () => {
        Speech.stop();
        Speech.speak(message.message, {
            language: "en",
            rate: 1,
            pitch: 1,
        });
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <Text style={styles.ai}>AI Assistant</Text>
                <Pressable onPress={speakText}>
                    <Ionicons name="volume-high" size={18} color="#60a5fa" />
                </Pressable>
            </View>

            <View style={styles.bubble}>
                <ScrollView
                    // horizontal={false}
                    // nestedScrollEnabled
                    horizontal
                    contentContainerStyle={{ paddingBottom: 4 }}
                >
                    <Markdown style={markdownStyles}>{message.message}</Markdown>
                </ScrollView>
                <Text style={styles.time}>{formatTimestamp(message.createdAt)}</Text>
            </View>
        </View>
    );
};

export default AiResponse;

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        paddingHorizontal: 12,
        marginVertical: 6,
        alignItems: "flex-start",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 4,
    },
    ai: {
        fontSize: 12,
        fontWeight: "600",
        color: "#60a5fa",
    },
    bubble: {
        backgroundColor: "#111827",
        padding: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        width: screenWidth - 24,
    },
    time: {
        fontSize: 10,
        color: "#9ca3af",
        marginTop: 4,
    },
});

const markdownStyles = {
    body: {
        color: "#e5e7eb",
        fontSize: 16,
    },

    heading1: { color: "#fff", fontSize: 24, fontWeight: "bold" },
    heading2: { color: "#fff", fontSize: 20, fontWeight: "bold" },
    heading3: { color: "#fff", fontSize: 18, fontWeight: "bold" },

    code_inline: {
        backgroundColor: "#020617",
        color: "#fca5a5",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        fontFamily: "monospace",
        fontSize: 14,
    },

    pre: {
        backgroundColor: "#020617",
        padding: 12,
        borderRadius: 10,
        marginVertical: 8,
    },

    fence: {
        backgroundColor: "#020617",
        color: "#e5e7eb",
        fontFamily: "monospace",
        fontSize: 14,
    },

    code_block: {
        color: "#e5e7eb",
        fontFamily: "monospace",
        fontSize: 14,
    },

    list_item: {
        color: "#e5e7eb",
    },

    blockquote: {
        borderLeftWidth: 4,
        borderLeftColor: "#3b82f6",
        paddingLeft: 10,
        backgroundColor: "#020617",
        marginVertical: 8,
    },
};

