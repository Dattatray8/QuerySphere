import { View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

function Skeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.headerText}>
          <View style={styles.name} />
          <View style={styles.subtitle} />
        </View>
      </View>

      <View style={styles.bio} />

      <View style={styles.divider} />

      <View style={styles.grid}>
        {Array.from({ length: 8 }).map((_, index) => (
          <View key={index} style={styles.tab} />
        ))}
      </View>
    </View>
  );
}

export default Skeleton;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 24,
  },

  skeleton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
  },

  header: {
    flexDirection: "row",
    gap: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#e5e7eb",
  },

  headerText: {
    alignItems: "center",
    gap: 12,
  },

  name: {
    width: 128,
    height: 24,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
  },

  subtitle: {
    width: 96,
    height: 20,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
  },

  bio: {
    width: "100%",
    height: 80,
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
  },

  divider: {
    width: 128,
    height: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    alignSelf: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  tab: {
    width: (width - 72) / 2, 
    height: 96,
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
  },
});
