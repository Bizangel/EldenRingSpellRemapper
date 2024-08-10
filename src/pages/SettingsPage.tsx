import closeSettings from "../assets/x-letter.svg"
import { ButtonList } from "../common/Buttons"
import SettingsButtonSelect from "../components/SettingsButtonSelect"
import './SettingsPage.scss'

type SettingsPageProps = {
    goBackToSpellPage: () => void,
}

const SettingsPage = ({goBackToSpellPage}: SettingsPageProps) => {

    // TODO add state to settings modifier buttonselect
    return (
        <div className="settings-page">
            <div className="settings-back-icon-wrapper">
                <img src={closeSettings} className="responsive-image" onClick={goBackToSpellPage}/>
            </div>

            <div className="settings-content">
                <SettingsButtonSelect
                text="Button Modifier"
                value="A"
                onChange={() => {}}
                buttons={ButtonList.filter(e => e !== "DPAD_UP")}
                options={{hideNoMapping: true}}
                />
            </div>
        </div>
    )
}

export default SettingsPage;