import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import useCurrentUser from "@/hooks/useCurrentUser";
import { serverUrl } from "@/config/config";
import { setProfileData } from "@/redux/userSlice";
import Skeleton from "@/app/components/profile/Skeleton";
import Header from "@/app/components/profile/Header";
import Bio from "@/app/components/profile/Bio";
import Tabs from "@/app/components/profile/Tabs";
import Button from "@/app/components/ui/Button";
import { roleTabs } from "@/config/roleTabs";

export default function ProfileScreen({
  forcedUserId,
}: {
  forcedUserId?: string;
}) {
  const { user }: { user: any } = useCurrentUser();
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { profileData } = useSelector((state: any) => state.user);

  const profileId = forcedUserId || id;
  const isMyProfile = profileId === user?._id;

  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    if (!profileId) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${serverUrl}/api/v1/users/profile/${profileId}`,
        { withCredentials: true }
      );
      dispatch(setProfileData(res.data.user));
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  if (loading || !profileData) return <Skeleton />;

  const applyForTeacherRole = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/v1/users/applyTeacherRole`, {}, { withCredentials: true });
      Toast.show({ type: "success", text1: result?.data?.message });
    } catch (error: any) {
      Toast.show({ type: "error", text1: error?.response?.data?.message || error.message, });
    }
  };

  const cancelApplicationForTeacherRole = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/users/removeTeacherApplication`,
        {},
        { withCredentials: true }
      );
      Toast.show({ type: "success", text1: result?.data?.message });
    } catch (error: any) {
      Toast.show({ type: "error", text1: error?.response?.data?.message || error?.message });
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Header profileData={profileData} userData={user} onEdit={() => { }} />

        {profileData.bio && <Bio bio={profileData.bio} />}

        {isMyProfile && user?.role === "teacher" &&
          !user?.isAppliedForTeacherRole &&
          !user?.isTeacher && (
            <Button text="Apply For Teacher Role" onClick={applyForTeacherRole} style={{ padding: 15, alignSelf: "center" }} />
          )}

        {!isMyProfile && profileData?.isTeacher && (
          <Text style={styles.badgeText}>Verified Teacher</Text>
        )}

        {user?.role === "teacher" &&
          !user?.isAppliedForTeacherRole &&
          user?.isTeacher && (
            <Text style={styles.badgeText}>You are a Verified Teacher</Text>
          )}

        {user?.role === "teacher" &&
          user?.isAppliedForTeacherRole &&
          !user?.isTeacher && (
            <Button text="Cancel Teacher Role Application" onClick={cancelApplicationForTeacherRole} style={{ padding: 15, alignSelf: "center" }} />
          )}

        <Text style={styles.title}>Activities</Text>

        <Tabs
          role={profileData.role}
          roleTabs={roleTabs}
          userId={profileData._id}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  badgeText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "500",
    borderWidth: 1,
    borderColor: "#3b82f6",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "center",
  },
});
