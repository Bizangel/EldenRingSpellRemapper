import { invoke } from "@tauri-apps/api/tauri";

const OverrideAPI = {
    sendEldenOverrideCommand: async (payload: string): Promise<string> => {
        return await invoke("elden_override_send_command", { payload: payload });
    }
}

export default OverrideAPI;