import { ScrollView, View, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
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
import BanCountdown from "@/app/components/BanDuration";
import { Ionicons } from "@expo/vector-icons";

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
        <Header profileData={profileData} userData={user} onEdit={() => { router.push('/editProfile') }} />

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

        {user?.isBanned && (
          <View style={styles.banContainer}>
            <View style={styles.banHeader}>
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text style={styles.banTitle}>Account Restricted</Text>
            </View>

            <Text style={styles.banSubText}>You are banned for</Text>

            <View style={styles.countdownWrapper}>
              <BanCountdown banDuration={user?.banDuration} />
            </View>

            <Text style={styles.banFooter}>
              Please follow our community guidelines to avoid further restrictions.
            </Text>
          </View>
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
  banContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 20,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#fee2e2',
    alignItems: 'center',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  banHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  banTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b91c1c', // Dark red
  },
  banSubText: {
    fontSize: 14,
    color: '#7f1d1d',
    marginBottom: 10,
    opacity: 0.8,
  },
  countdownWrapper: {
    width: '100%',
    paddingVertical: 10,
  },
  banFooter: {
    fontSize: 11,
    color: '#991b1b',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },

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
