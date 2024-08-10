import { ButtonString, ButtonToImage } from "../common/Buttons"
import plusIcon from "../assets/plus.svg"
import right from "../assets/chevron-right.svg"
import { useButtonPickerContextMenu } from "./ButtonPickerContextMenu"
import { useCallback } from "react"
import './ButtonMappingPair.scss'

type ButtonModifierMappingPairProps = {
    modifier: ButtonString,
    value?: ButtonString
    onValueChange: (button?: ButtonString) => void,
    buttons: readonly ButtonString[],
    mappingTarget: ButtonString
}

export const ButtonModifierMappingPair = ({modifier, value, onValueChange, buttons, mappingTarget}: ButtonModifierMappingPairProps) => {
    const showButtonContext = useButtonPickerContextMenu()

    const openContextMenu = useCallback((ev: React.MouseEvent) => {
        showButtonContext(ev.clientX, ev.clientY,
            buttons,
            onValueChange,
            value,
            {openUpwards: true} // open upwards
        );
        ev.preventDefault()
    }, [showButtonContext])

    return (
        <div className="button-mapping-pair-wrapper">
            <img src={`/buttonicons/XboxOne_${ButtonToImage[modifier]}.png`} className="responsive-image"></img>
            <div className="modifier-plus-wrapper">
                <img src={plusIcon} className="responsive-image"></img>
            </div>

            <div className="button-mapping-switcheable"
            onClick={openContextMenu} onContextMenu={openContextMenu}>
                { value &&
                    <img src={`/buttonicons/XboxOne_${ButtonToImage[value]}.png`}
                    className="responsive-image-w"/>
                }
            </div>

            <img src={right} className="responsive-image" style={{filter: "invert(1)"}}></img>
            <img src={`/buttonicons/XboxOne_${ButtonToImage[mappingTarget]}.png`} className="responsive-image"></img>
        </div>
    )
}