import cogWheel from "./assets/cog.svg"
import './SpellMapPage.scss'
import Spellbar from "./Spellbar";
import SpellEntryCardContextMenu from "./SpellEntryCardContextMenu";
import useSettingsCheck from "./common/settingsCheck";
import PaddleMapper from "./PaddleMapper";

type SpellMapPageProps = {
    goToSettingsPage: () => void,
    goToAddSpellPage: () => void,
}

const SpellMapPage = ({goToSettingsPage, goToAddSpellPage}: SpellMapPageProps) => {
    const settingsCheck = useSettingsCheck();

    return (
        <div className="spell-page">
            <SpellEntryCardContextMenu/>
            <img src={cogWheel} className="settings-icon" onClick={goToSettingsPage}/>
            <div className="spell-page-content">
                <Spellbar/>

                <div className="spellpage-bottom-content-wrapper">
                    <div className="spellpage-button-wrapper">
                            <button className="spellpage-button" onClick={goToAddSpellPage}>Add Spell</button>
                            <button className="spellpage-button start">Start Remapping</button>
                    </div>

                    <div className="issues-box-wrapper">
                        {!settingsCheck.ok &&
                            settingsCheck.error
                        }
                    </div>

                    <div className="extra-controller-mapping-wrapper">
                        <div className="modifier-replacement-wrapper">

                        </div>

                        <PaddleMapper/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpellMapPage;