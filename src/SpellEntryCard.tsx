import "./SpellEntrycard.scss"
import { useRemapper } from "./common/RemapConfig";
import { ButtonString, ButtonToImage } from "./common/Buttons";

type SpellEntryCardProps = {
    id: string,
    spellName: string,
    buttonCombo?: ButtonString,
}

const SpellEntryCard = ({id, spellName, buttonCombo}: SpellEntryCardProps) =>{
    const currentModifier = useRemapper(e => e.config.currentModifier);

    return (
        <div className="spell-entry">
            {
                buttonCombo &&
                <div className="buttoncombo-wrapper">
                    <img src={`/buttonicons/XboxOne_${ButtonToImage[currentModifier]}.png`} className="responsive-image"></img>
                    +
                    <img src={`/buttonicons/XboxOne_${ButtonToImage[buttonCombo]}.png`} className="responsive-image"></img>
                </div>
            }

            <div className="spacing"></div>
            <div className="image-wrapper">
                <img src={`/spellsicons/${id}.png`} className="responsive-image"></img>
            </div>

            <div className="text-wrapper">
                {spellName}
            </div>
        </div>
    )
}


export default SpellEntryCard;