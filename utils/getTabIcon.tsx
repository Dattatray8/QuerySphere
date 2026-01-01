import { Ionicons } from "@expo/vector-icons";

const iconMap = {
  questions: "help-circle-outline",
  answers: "chatbubble-outline",
  accepted: "checkmark-circle-outline",
  verified: "shield-checkmark-outline",
  unansweredQuestions: "alert-circle-outline",
  spamUsers: "person-remove-outline",
  reportedQuestions: "flag-outline",
  reportedAnswers: "flag-outline",
  reportedMessages: "chatbox-ellipses-outline",
  teacherApplications: "clipboard-outline",
  allUsers: "people-outline",
  allQuestions: "document-text-outline",
  bannedUsers: "shield-outline",
};

export default function getTabIcon(
  tabKey: string,
  size = 22,
  color = "#3b82f6"
) {
  return (
    <Ionicons
      name={iconMap[tabKey] || "document-text-outline"}
      size={size}
      color={color}
    />
  );
}
