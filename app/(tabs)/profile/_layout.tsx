import Button from "@/app/components/ui/Button";
import { serverUrl } from "@/config/config";
import { setUserData } from "@/redux/userSlice";
import { getLabel } from "@/utils/getLabel";
import axios from "axios";
import { router, Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

export default function ProfileLayout() {
    const dispatch = useDispatch();

    async function handleLogOut() {
        try {
            await axios.get(`${serverUrl}/api/v1/auth/logout`, {
                withCredentials: true,
            });
            dispatch(setUserData(null));
            router.back();
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: error?.response?.data?.message || error?.message,
            });
        }
    }

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "My Profile",
                    headerBackVisible: false,
                    headerRight: () => (
                        <Button text="Log Out" onClick={handleLogOut} style={{
                            padding: 10,
                        }} />
                    ),
                }}

            />
            <Stack.Screen
                name="[id]/index"
                options={{ title: "Profile", headerBackVisible: false }}
            />
            <Stack.Screen
                name="[id]/[key]/index"
                options={({ route }) => {
                    let params = route?.params as { id: string, key: string }
                    let tabname: string = getLabel(params?.key)
                    return {
                        title: tabname ?? "Profile Tab"
                    }
                }}
            />
        </Stack>
    );
}
