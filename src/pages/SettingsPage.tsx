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
    return useCallback((integer: string) => {
        if (integer.includes(",") || integer.includes("."))
            return false;
        let intd = parseInt(integer)
        if (isNaN(intd) || intd < min || intd > max)
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

    // hidhide automate
    const automateHidHide = useRemapper(e => e.config.miscConfig.automateHidHide)
    const setAutomateHidHide = useRemapper(e => e.setAutomateHidHide)

    const quickCastButtonOption = useRemapper(e => e.config.miscConfig.quickCastButton)
    const setQuickCastButtonOption = useRemapper(e => e.setQuickcastButton)
    const onQuickcastCheckboxChanged = useCallback((option: boolean) => {
        option ? setQuickCastButtonOption("LB") : setQuickCastButtonOption(undefined)
    }, [setQuickCastButtonOption])

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

                <SettingsInputEntry
                    entryText="Automate HidHide: "
                    value={automateHidHide}
                    onValidatedChange={setAutomateHidHide}
                    validateInput={() => true}
                    options={{type: "checkbox"}}
                />


                <SettingsInputEntry
                    entryText="Quickcast: "
                    value={quickCastButtonOption !== undefined}
                    onValidatedChange={onQuickcastCheckboxChanged}
                    validateInput={() => true}
                    options={{type: "checkbox"}}
                />

                {
                    quickCastButtonOption !== undefined &&
                    <SettingsButtonSelect
                        text="Quickcast Spellcast Button:"
                        value={quickCastButtonOption}
                        onChange={setQuickCastButtonOption}
                        buttons={["LB", "RB"]}
                        options={{hideNoMapping: true, openUpwards: true}}
                    />
                }
            </div>
        </div>
    )
}

export default SettingsPage;