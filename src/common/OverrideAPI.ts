import { invoke } from "@tauri-apps/api/tauri";

const OverrideAPI = {
    startOverride: async () => {
        await invoke("start_elden_override", { });
    },

    stopOverride: async () => {
        await invoke("stop_elden_override", { });
    },

    isOverrideActive: async (): Promise<boolean> => {
        return await invoke("is_elden_override_active", { });
    }
}

export default OverrideAPI;