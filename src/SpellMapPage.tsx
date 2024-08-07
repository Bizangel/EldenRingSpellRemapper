import cogWheel from "./assets/cog.svg"
import './SpellMapPage.scss'
import Spellbar from "./Spellbar";

type SpellMapPageProps = {
    goToSettingsPage: () => void,
}

const SpellMapPage = ({goToSettingsPage}: SpellMapPageProps) => {
    return (
        <div className="spell-page">
            <img src={cogWheel} className="settings-icon" onClick={goToSettingsPage}/>

            <div className="spell-page-content">
                <div className="spellbar">
                    <Spellbar/>
                </div>

                <div className="spellpage-button-wrapper">
                    <button className="add-spell-button">Add Spell</button>
                    <button className="add-spell-button">but1</button>
                    <button className="add-spell-button">but1</button>
                </div>
            </div>
        </div>
    )
}

export default SpellMapPage;