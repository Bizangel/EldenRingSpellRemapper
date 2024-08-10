import cogWheel from "../assets/cog.svg"
import './SpellMapPage.scss'
import useSettingsCheck from "../common/settingsCheck";
import PaddleMapper from "../components/PaddleMapper";
import Spellbar from "../components/Spellbar";
import { ButtonMappingPair } from "../components/ButtonMappingPair";
import { ButtonList } from "../common/Buttons";
import { useRemapper } from "../common/RemapConfig";
import { ButtonModifierMappingPair } from "../components/ButtonModifierMappingPair";

type SpellMapPageProps = {
    goToSettingsPage: () => void,
    goToAddSpellPage: () => void,
}

const SpellMapPage = ({goToSettingsPage, goToAddSpellPage}: SpellMapPageProps) => {
    const settingsCheck = useSettingsCheck();

    // dpad config
    const currentDpadMapping = useRemapper(e => e.config.dpadUpMapping);
    const setDpadUpMapping = useRemapper(e => e.setDpadUpMapping);
    // modifier replacement config
    const currentModifier = useRemapper(e => e.config.currentModifier);
    const currentModReplacement = useRemapper(e => e.config.modifierOutReplacement);
    const setModifierReplacement = useRemapper(e => e.setReplacementModifierMapping);

    return (
        <div className="spell-page">
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
                        <ButtonMappingPair
                            mappingSource={"DPAD_UP"}
                            value={currentDpadMapping}
                            onValueChange={setDpadUpMapping}
                            buttons={ButtonList.filter(e => !["P1", "P2", "P3", "P4", "DPAD_UP"].includes(e))}/>
                        <ButtonModifierMappingPair
                            modifier={currentModifier}
                            mappingTarget={currentModifier}
                            value={currentModReplacement}
                            onValueChange={setModifierReplacement}
                            buttons={ButtonList.filter(e => e !== currentModifier)}/>
                        <PaddleMapper/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpellMapPage;