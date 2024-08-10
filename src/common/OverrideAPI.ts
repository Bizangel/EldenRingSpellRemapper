import { invoke } from "@tauri-apps/api/tauri";

const sendEldenOverrideCommandPayload = async (payload: any): Promise<string> => {
    return await invoke("elden_override_send_command", { payload: JSON.stringify(payload) });
}

const OverrideAPI = {

    checkOverrideConfig: async (payload: string) => {

        // return await sendEldenOverrideCommandPayload({})
    },

    sendEldenOverrideCommand: async (payload: string): Promise<string> => {
        return await sendEldenOverrideCommandPayload({})
    }
}

export default OverrideAPI;