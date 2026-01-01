import ProfileScreen from "./[id]";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function MyProfile() {
    const { user }: { user: any } = useCurrentUser();
    return <ProfileScreen forcedUserId={user?._id} />;
}
