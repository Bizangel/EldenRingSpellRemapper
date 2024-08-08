import cogWheel from "./assets/cog.svg"
import './SpellMapPage.scss'
import Spellbar from "./Spellbar";
import SpellEntryCardContextMenu from "./SpellEntryCardContextMenu";

type SpellMapPageProps = {
    goToSettingsPage: () => void,
    goToAddSpellPage: () => void,
}

const SpellMapPage = ({goToSettingsPage, goToAddSpellPage}: SpellMapPageProps) => {
    return (
        <div className="spell-page">
            <SpellEntryCardContextMenu/>
            <img src={cogWheel} className="settings-icon" onClick={goToSettingsPage}/>
            <div className="spell-page-content">
                <div className="spellbar">
                    <Spellbar/>
                </div>

                <div className="spellpage-button-wrapper">
                        <button className="spellpage-button" onClick={goToAddSpellPage}>Add Spell</button>
                        <button className="spellpage-button start">Start Remapping</button>
                </div>
            </div>
        </div>
    )
}

export default SpellMapPage;