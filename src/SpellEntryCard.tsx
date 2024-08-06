import backButton from "./assets/chevron-left.svg"
import frontButton from "./assets/chevron-right.svg"
import deleteButton from "./assets/x-letter.svg"
import "./SpellEntrycard.scss"

export type SpellEntryCardProps = {
    spellName: string,
    idx: number,
    totalSpellCount: number,
}

const SpellEntryCard = ({spellName, idx, totalSpellCount}: SpellEntryCardProps) =>{

    let leftDisabled = idx == 0;
    let rightDisabled = idx == totalSpellCount - 1;

    return (
        <div className="spell-entry">
            <div className={`move-left-button ${ leftDisabled ? "disabled" : ""}` }>
                <img src={backButton} style={{width: "100%", height: "auto"}}/>
            </div>

            <div className={`move-right-button ${ rightDisabled ? "disabled" : ""}` }>
                <img src={frontButton} style={{width: "100%", height: "auto"}}/>
            </div>

            <div className="delete-button-wrapper">
                <div className="delete-button">
                    <img src={deleteButton} style={{width: "100%", height: "auto"}}/>
                </div>
            </div>

            <div className="text-wrapper">
                {spellName}
            </div>
        </div>
    )
}


export default SpellEntryCard;