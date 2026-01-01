import { View, Text, StyleSheet, Pressable } from "react-native";
import getTabIcon from "@/utils/getTabIcon";

type Tab = {
  key: string;
  label: string;
};

type Props = {
  role: string;
  roleTabs: Record<string, Tab[]>;
  userId: string;
};

function Tabs({ role, roleTabs, userId }: Props) {
  const tabs = roleTabs[role] || [];

//   const handleNavigation = (key: string) => {
//     if (key === "teacherApplications") {
//       router.push(`/users/${key}`);
//     } else if (key === "allUsers") {
//       router.push(`/${key}`);
//     } else if (key === "all" || key === "unanswered") {
//       router.push(`/questions/${key}`);
//     } else if (key === "reports") {
//       router.push("/reports");
//     } else if (key === "spams") {
//       router.push("/spams");
//     } else {
//       router.push(`/profile/${userId}/${key}`);
//     }
//   };

  return (
    <View style={styles.grid}>
      {tabs.map((tab, index) => (
        <Pressable
          key={index}
        //   onPress={() => handleNavigation(tab.key)}
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.icon}>
            {getTabIcon(tab.key, 22, "#6b7280")}
          </View>

          <Text style={styles.label}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export default Tabs;

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  cardPressed: {
    backgroundColor: "#e5e7eb",
  },

  icon: {
    marginBottom: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    color: "#374151",
  },
});
