import { ButtonString, ButtonToImage } from "../common/Buttons"
import plusIcon from "../assets/plus.svg"
import right from "../assets/chevron-right.svg"
import { ButtonContextMenuStateOptions, useButtonPickerContextMenu } from "./ButtonPickerContextMenu"
import { useCallback } from "react"
import './ButtonMappingPair.scss'

type ButtonModifierMappingPairProps = {
    modifier: ButtonString,
    value?: ButtonString
    onValueChange: (button?: ButtonString) => void,
    buttons: readonly ButtonString[],
    mappingTarget: ButtonString,

    options?: ButtonContextMenuStateOptions,
    customTargetSrc?: string,
}

export const ButtonModifierMappingPair = ({modifier, value, onValueChange, buttons, mappingTarget, customTargetSrc, options}: ButtonModifierMappingPairProps) => {
    const showButtonContext = useButtonPickerContextMenu()

    const openContextMenu = useCallback((ev: React.MouseEvent) => {
        showButtonContext(ev.clientX, ev.clientY,
            buttons,
            onValueChange,
            value,
            {openUpwards: true, ...options} // open upwards
        );
        ev.preventDefault()
    }, [showButtonContext, buttons, onValueChange, value, options])

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

            {!customTargetSrc &&
                <img src={`/buttonicons/XboxOne_${ButtonToImage[mappingTarget]}.png`} className="responsive-image"></img>
            }

            {customTargetSrc &&
                 <img src={customTargetSrc} className="responsive-image" style={{filter: "invert(1)"}}></img>
            }
        </div>
    )
}