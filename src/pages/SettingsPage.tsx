import { useCallback } from "react"
import closeSettings from "../assets/x-letter.svg"
import { ButtonList, ButtonString } from "../common/Buttons"
import { useRemapper } from "../common/RemapConfig"
import SettingsButtonSelect from "../components/SettingsButtonSelect"
import './SettingsPage.scss'
import SettingsInputEntry from "../components/SettingsInputEntry"

type SettingsPageProps = {
    goBackToSpellPage: () => void,
}

const useValidateInteger = (min:number, max:number) => {
    return useCallback((pollDelay: string) => {
        if (pollDelay.includes(",") || pollDelay.includes("."))
            return false;
        let polld = parseInt(pollDelay)
        if (isNaN(polld) || polld < min || polld > max)
            return false
        return true
    }, [min, max])
}

const SettingsPage = ({goBackToSpellPage}: SettingsPageProps) => {
    // Poll delay config
    const currentPollingDelay = useRemapper(e => e.config.miscConfig.pollingDelay)
    const setPollingDelay = useRemapper(e => e.setPollDelay)
    const validatePollDelay = useValidateInteger(1, 1000)
    const onDelayChange = useCallback((pollDelay: string) => {
        setPollingDelay(parseInt(pollDelay))
    }, [currentPollingDelay, setPollingDelay])

    // Modifier config
    const currentModifier = useRemapper(e => e.config.currentModifier)
    const setModifier = useRemapper(e => e.setModifier)
    const onModifierValueChange = useCallback((button?: ButtonString) => {
        if (button)
            setModifier(button)
    }, [setModifier])

    return (
        <div className="settings-page">
            <div className="settings-back-icon-wrapper">
                <img src={closeSettings} className="responsive-image" onClick={goBackToSpellPage}/>
            </div>

            <div className="settings-content">
                <SettingsButtonSelect
                text="Button Modifier:"
                value={currentModifier}
                onChange={onModifierValueChange}
                buttons={ButtonList.filter(e => e !== "DPAD_UP")}
                options={{hideNoMapping: true}}
                />

                <SettingsInputEntry
                    entryText="Virtual Controller Polling Delay (ms):"
                    value={currentPollingDelay.toString()}
                    onValidatedChange={onDelayChange}
                    validateInput={validatePollDelay}
                    options={{type: "number", min: 1, max: 1000}}
                />
            </div>
        </div>
    )
}

export default SettingsPage;