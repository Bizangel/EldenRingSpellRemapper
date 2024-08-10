import { useCallback } from "react";
import { ButtonContextMenuStateOptions, useButtonPickerContextMenu } from "./ButtonPickerContextMenu";
import {  ButtonString, ButtonToImage } from "../common/Buttons";

type SettingsButtonSelectProps = {
    text: string,
    value: ButtonString | undefined,
    onChange: (button?: ButtonString) => void,
    buttons: ButtonString[],
    options?: ButtonContextMenuStateOptions,
}

const SettingsButtonSelect = ({text, value, onChange, buttons, options}: SettingsButtonSelectProps) => {

    const showButtonContext = useButtonPickerContextMenu()
    const openContextMenu = useCallback((ev: React.MouseEvent) => {
        showButtonContext(ev.clientX, ev.clientY,
            buttons,
            onChange,
            value,
            options
        );

        ev.preventDefault()
    }, [showButtonContext])

    return (
        <div className="settings-entry-select">
            {text}

            <div className="settings-entry-select-box" onClick={openContextMenu} onContextMenu={openContextMenu}>
                {value &&
                    <img src={`/buttonicons/XboxOne_${ButtonToImage[value]}.png`} className="responsive-image" />
                }
            </div>
        </div>
    )
}

export default SettingsButtonSelect