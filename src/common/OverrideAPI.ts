import { invoke } from "@tauri-apps/api/tauri";
import { useRemapper } from "./RemapConfig";

export type EldenOverrideCommandResponse = {
	success: boolean;
	payload: string;
}

export type ConfigCheckResponse = {
	configOk: boolean;
	errors: string[];
}


const sendEldenOverrideCommandPayload = async (command: string, payload: any): Promise<EldenOverrideCommandResponse> => {
    const strPayload = JSON.stringify({ command: command, payload: JSON.stringify(payload) })
    const jsonTextResp = await invoke("elden_override_send_command", { payload: strPayload }) as string;
    const parsedObj = JSON.parse(jsonTextResp)
    return {success: parsedObj.success ?? false, payload: parsedObj.payload ?? ""}
}

const OverrideAPI = {

    checkOverrideConfig: async (): Promise<ConfigCheckResponse> => {
        const configState = useRemapper.getState().config
        const resp = await sendEldenOverrideCommandPayload("check-config", configState)
        if (!resp.success){
            return {configOk: false, errors: ["Unable to contact Elden Remapper C++ Backend"]}
        }

        console.log(resp.payload)
        return JSON.parse(resp.payload) as ConfigCheckResponse;
    },
}

export default OverrideAPI;