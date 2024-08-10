import { ButtonString, ButtonToImage } from "../common/Buttons"
import right from "../assets/chevron-right.svg"
import { useButtonPickerContextMenu } from "./ButtonPickerContextMenu"
import { useCallback } from "react"
import './ButtonMappingPair.scss'

type ButtonMappingPairProps = {
    mappingSource: ButtonString,
    value?: ButtonString
    onValueChange: (button?: ButtonString) => void,
    buttons: readonly ButtonString[],
}

export const ButtonMappingPair = ({value, onValueChange, buttons, mappingSource}: ButtonMappingPairProps) => {
    const showButtonContext = useButtonPickerContextMenu()

    const openContextMenu = useCallback((ev: React.MouseEvent) => {
        showButtonContext(ev.clientX, ev.clientY,
            buttons,
            onValueChange,
            value,
            {openUpwards: true} // open upwards
        );
        ev.preventDefault()
    }, [showButtonContext, onValueChange, value, buttons])

    return (
        <div className="button-mapping-pair-wrapper">
            <img src={`/buttonicons/XboxOne_${ButtonToImage[mappingSource]}.png`} className="responsive-image"></img>

            <img src={right} className="responsive-image" style={{filter: "invert(1)"}}></img>

            <div className="button-mapping-switcheable"
                onClick={openContextMenu} onContextMenu={openContextMenu}>
                { value &&
                    <img src={`/buttonicons/XboxOne_${ButtonToImage[value]}.png`}
                        className="responsive-image-w"/>
                }
            </div>
        </div>
    )
}