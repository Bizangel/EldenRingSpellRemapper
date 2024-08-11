import cogWheel from "../assets/cog.svg"
import './SpellMapPage.scss'
import useSettingsCheck from "../common/settingsCheck";
import PaddleMapper from "../components/PaddleMapper";
import Spellbar from "../components/Spellbar";
import { ButtonMappingPair } from "../components/ButtonMappingPair";
import { ButtonList } from "../common/Buttons";
import { useRemapper } from "../common/RemapConfig";
import { ButtonModifierMappingPair } from "../components/ButtonModifierMappingPair";
import { useCallback } from "react";
import OverrideAPI from "../common/OverrideAPI";
import spellReset from '../assets/spell_reset.png'

type SpellMapPageProps = {
    goToSettingsPage: () => void,
    goToAddSpellPage: () => void,
}

const SpellMapPage = ({goToSettingsPage, goToAddSpellPage}: SpellMapPageProps) => {
    const settingsCheck = useSettingsCheck();

    // dpad config
    const currentDpadMapping = useRemapper(e => e.config.dpadUpMapping);
    const setDpadUpMapping = useRemapper(e => e.setDpadUpMapping);
    // reset spell config
    const setResetMapping = useRemapper(e => e.setResetMapping);
    const currentResetMapping = useRemapper(e => e.config.resetSpellMapping);

    // modifier replacement config
    const currentModifier = useRemapper(e => e.config.currentModifier);
    const currentModReplacement = useRemapper(e => e.config.modifierOutReplacement);
    const setModifierReplacement = useRemapper(e => e.setReplacementModifierMapping);

    const onRemappingToggleClick = useCallback(async () => {
        const response = await OverrideAPI.checkOverrideConfig()
        console.log("Received cppresponse: ", response)
    }, [])

    return (
        <div className="spell-page">
            <img src={cogWheel} className="settings-icon" onClick={goToSettingsPage}/>
            <div className="spell-page-content">
                <Spellbar/>

                <div className="spellpage-bottom-content-wrapper">
                    <div className="spellpage-button-wrapper">
                            <button className="spellpage-button" onClick={goToAddSpellPage}>Add Spell</button>
                            <button className="spellpage-button start" onClick={onRemappingToggleClick} >Start Remapping</button>
                    </div>

                    <div className="issues-box-wrapper">
                        {!settingsCheck.ok &&
                            settingsCheck.error
                        }
                    </div>

                    <div className="extra-controller-mapping-wrapper">
                            <PaddleMapper/>
                            {/* Replacement for Modifier */}
                            <ButtonModifierMappingPair
                                modifier={currentModifier}
                                mappingTarget={currentModifier}
                                value={currentModReplacement}
                                onValueChange={setModifierReplacement}
                                buttons={ButtonList.filter(e => e !== currentModifier)}/>

                            {/* Reset Spell keybind */}
                            <ButtonModifierMappingPair
                                modifier={currentModifier}
                                mappingTarget={"P1"}
                                value={currentResetMapping}
                                onValueChange={(button) => {if(button) setResetMapping(button)}}
                                buttons={ButtonList.filter(e => e !== currentModifier)}
                                customTargetSrc={spellReset}
                                options={{hideNoMapping: true}}
                                />
                            {/* Dpad up mapping replacement */}
                            <ButtonMappingPair
                                mappingSource={"DPAD_UP"}
                                value={currentDpadMapping}
                                onValueChange={setDpadUpMapping}
                                buttons={ButtonList.filter(e => !["P1", "P2", "P3", "P4", "DPAD_UP"].includes(e))}/>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpellMapPage;