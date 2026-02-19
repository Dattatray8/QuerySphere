import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EmptyQuestionMessage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons
          name="help-circle-outline"
          size={96}
          color="#cbd5e1"
          style={styles.icon}
        />

        <Text style={styles.title}>No Questions Yet</Text>

        <Text style={styles.subtitle}>
          Be the first to spark a conversation! Ask a question and get the
          discussion started.
        </Text>

        <TouchableOpacity
          style={styles.button}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.buttonText}>Ask a Question</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmptyQuestionMessage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 125
  },
  card: {
    alignItems: "center",
    maxWidth: 360,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
});
