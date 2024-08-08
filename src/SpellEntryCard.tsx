import "./SpellEntrycard.scss"
import { SpellMapping, useRemapper } from "./common/RemapConfig";
import { ButtonToImage } from "./common/Buttons";

const SpellEntryCard = ({id, buttonCombo}: SpellMapping) =>{
    const currentModifier = useRemapper(e => e.config.currentModifier);

    return (
        <div className="spell-entry">
            <div className="buttoncombo-wrapper">
                <img src={`/buttonicons/XboxOne_${ButtonToImage[currentModifier]}.png`} className="responsive-image"></img>
                +
                <img src={`/buttonicons/XboxOne_${ButtonToImage[buttonCombo]}.png`} className="responsive-image"></img>
            </div>

            <div className="spacing"></div>
            <div className="image-wrapper">
                <img src="/sample_spell.png" className="responsive-image"></img>
            </div>

            <div className="text-wrapper">
                {id}
            </div>
        </div>
    )
}


export default SpellEntryCard;