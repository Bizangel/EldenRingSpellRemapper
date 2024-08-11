import { invoke } from "@tauri-apps/api/tauri";
import { useRemapper } from "./RemapConfig";

export type EldenOverrideCommandResponse = {
	success: boolean;
	payload: string
}

const sendEldenOverrideCommandPayload = async (command: string, payload: any): Promise<EldenOverrideCommandResponse> => {
    const strPayload = JSON.stringify({ command: command, payload: JSON.stringify(payload) })
    const jsonTextResp = await invoke("elden_override_send_command", { payload: strPayload }) as string;
    const parsedObj = JSON.parse(jsonTextResp)
    return {success: parsedObj.success ?? false, payload: parsedObj.payload ?? ""}
}

const OverrideAPI = {

    checkOverrideConfig: async (): Promise<EldenOverrideCommandResponse> => {
        const configState = useRemapper.getState().config
        console.log(configState)
        return await sendEldenOverrideCommandPayload("validate-config", configState)
    },
}

export default OverrideAPI;