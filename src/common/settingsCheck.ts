import { useRemapper } from "./RemapConfig"


const useSettingsCheck = (): { ok: boolean, error: string } => {
    const config = useRemapper(e => e.config)

    // 1. Check if multiple spells have the same mapping.

    // 2. Check if modifier spell is being used.

    // 2. Check if dpad up

    // 3. Check duplicate spells

    return {ok: false, error: "Multiple spells have same binding"}
}

export default useSettingsCheck