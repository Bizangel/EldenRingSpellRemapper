import  {  useState } from "react"
import cogWheel from "./assets/cog.svg"
import './SpellMapPage.scss'
import SpellEntryCard, { SpellEntryCardProps } from "./SpellEntryCard";

type SpellMapPageProps = {
    goToSettingsPage: () => void,
}


type SpellEntry = {
    spellName: string,
}

const SpellMapPage = ({goToSettingsPage}: SpellMapPageProps) => {

    const [spellEntryState, setSpellEntryState] = useState<SpellEntry[]>([
        {
            spellName: "Glintstone Stars",
        },
        {
            spellName: "Glintstone Moon",
        }
    ]);

    return (
        <div className="spell-page">
            <img src={cogWheel} className="settings-icon" onClick={goToSettingsPage}/>

            <div className="spell-page-content">
                <div className="spellbar">
                {
                    spellEntryState.map((spellEntry, idx) =>
                        <SpellEntryCard
                        key={spellEntry.spellName}
                        idx = {idx}
                        spellName={spellEntry.spellName}
                        totalSpellCount={spellEntryState.length}
                        />
                    )
                }
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