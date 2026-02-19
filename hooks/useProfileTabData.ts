import { profileTabConfig } from "@/config/profileTagConfig";
import { useEffect, useState } from "react";
import useApiDispatch from "./useApiDispatch";
import { useDispatch } from "react-redux";
import { api } from "./useApi";

export default function useProfileTabData(tabKey: string, userId: string) {
    const dispatch = useDispatch();
    const { run } = useApiDispatch();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const config = profileTabConfig[tabKey];
        if (!config) return; // No config → no fetch

        setLoading(true);

        run(
            () => api.get(config.endpoint(userId)),
            (data:any) => {
                config.reducer(dispatch, data);
                setLoading(false);
            },

        );
        () => {
            setLoading(false);
        }
    }, [tabKey, userId]);
    return { loading };
}