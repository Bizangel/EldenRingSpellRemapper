import arrowBack from "./assets/arrow-left.svg"
import './SettingsPage.scss'

type SettingsPageProps = {
    goBackToSpellPage: () => void,
}

const SettingsPage = ({goBackToSpellPage}: SettingsPageProps) => {
    return (
        <div className="settings-page">
            <h1> Settings Page </h1>
            <img src={arrowBack} className="back-icon" onClick={goBackToSpellPage}/>
        </div>
    )
}

export default SettingsPage;