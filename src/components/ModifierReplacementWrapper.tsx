import "./ModifierReplacementWrapper.scss"
import right from "../assets/chevron-right.svg"
import plusIcon from "../assets/plus.svg"
import { useButtonPickerContextMenu } from "./ButtonPickerContextMenu"
import { useRemapper } from "../common/RemapConfig"
import { ButtonList, ButtonToImage } from "../common/Buttons"
import { useCallback } from "react"

const ModifierReplacementWrapper = () => {
    const showButtonContext = useButtonPickerContextMenu()
    const currentModifier = useRemapper(e => e.config.currentModifier);
    const currentModReplacement = useRemapper(e => e.config.modifierOutReplacement);
    const setModifierMapping = useRemapper(e => e.setModifierMapping);

    const openContextMenu = useCallback((ev: React.MouseEvent) => {
        showButtonContext(ev.clientX, ev.clientY,
            ButtonList.filter(e => e !== currentModifier),
            setModifierMapping,
            currentModReplacement,
            {openUpwards: true} // open upwards
        );

        ev.preventDefault()
    }, [showButtonContext])

    return (
        <div className="modifier-replacement-wrapper">
                <img src={`/buttonicons/XboxOne_${ButtonToImage[currentModifier]}.png`} className="responsive-image"></img>
                <div className="modifier-plus-wrapper">
                    <img src={plusIcon} className="responsive-image"></img>
                </div>

                <div className="modifier-mapping-switcheable-wrapper"
                onClick={openContextMenu} onContextMenu={openContextMenu}>
                    { currentModReplacement &&
                        <img src={`/buttonicons/XboxOne_${ButtonToImage[currentModReplacement]}.png`}
                        className="responsive-image-w"/>
                    }
                </div>

                <img src={right} className="responsive-image" style={{filter: "invert(1)"}}></img>
                <img src={`/buttonicons/XboxOne_${ButtonToImage[currentModifier]}.png`} className="responsive-image"></img>
        </div>
    )
}

export default ModifierReplacementWrapper