import { useCallback } from "react"
import closeSettings from "../assets/x-letter.svg"
import { ButtonList, ButtonString } from "../common/Buttons"
import { useRemapper } from "../common/RemapConfig"
import SettingsButtonSelect from "../components/SettingsButtonSelect"
import './SettingsPage.scss'

type SettingsPageProps = {
    goBackToSpellPage: () => void,
}

const SettingsPage = ({goBackToSpellPage}: SettingsPageProps) => {
    const currentModifier = useRemapper(e => e.config.currentModifier)
    const setModifier = useRemapper(e => e.setModifier)
    const onValueChange = useCallback((button?: ButtonString) => {
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
                onChange={onValueChange}
                buttons={ButtonList.filter(e => e !== "DPAD_UP")}
                options={{hideNoMapping: true}}
                />
            </div>
        </div>
    )
}

export default SettingsPage;