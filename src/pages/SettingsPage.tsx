import { useCallback, useState } from "react"
import closeSettings from "../assets/x-letter.svg"
import { ButtonList, ButtonString } from "../common/Buttons"
import { useRemapper } from "../common/RemapConfig"
import SettingsButtonSelect from "../components/SettingsButtonSelect"
import './SettingsPage.scss'

type SettingsPageProps = {
    goBackToSpellPage: () => void,
}

const SettingsPage = ({goBackToSpellPage}: SettingsPageProps) => {
    // Poll delay config
    const currentPollingDelay = useRemapper(e => e.config.miscConfig.pollingDelay)
    const setPollingDelay = useRemapper(e => e.setPollDelay)
    const [pollDelayBoxState, setPollDelayBoxState] = useState(currentPollingDelay.toString())

    const submitPollingDelay = useCallback(() => {
        let polld = parseInt(pollDelayBoxState)

        if (isNaN(polld) || polld < 1 || polld > 1000) // bad return to original display
            return setPollDelayBoxState(currentPollingDelay.toString());

        console.log(polld)
        polld = Math.round(polld)
        setPollingDelay(polld)
        setPollDelayBoxState(polld.toString())
    }, [currentPollingDelay, pollDelayBoxState, setPollingDelay, setPollDelayBoxState])

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
                text="Button Modifier"
                value={currentModifier}
                onChange={onModifierValueChange}
                buttons={ButtonList.filter(e => e !== "DPAD_UP")}
                options={{hideNoMapping: true}}
                />

                <div className="settings-entry-input">
                    <p> Virtual Controller Polling Delay:  </p>
                    <input
                    min={1}
                    max={1000}
                    type = "number"
                    value={pollDelayBoxState} onChange={(ev) => {setPollDelayBoxState(ev.target.value)}}
                    onBlur={() => { submitPollingDelay(); }}
                    onKeyUp={(ev) => {if (ev.key === 'Enter'){ev.currentTarget.blur()}}}/>

                    ms
                </div>
            </div>
        </div>
    )
}

export default SettingsPage;