import { useCallback } from "react";
import { ButtonString, ButtonToImage } from "../common/Buttons"
import { create } from "zustand";
import './ButtonPickerContextMenu.scss'

interface ButtonContextMenuState {
    xPosition: number,
    yPosition: number,
    display: boolean,
    buttons: readonly ButtonString[]
    onPressCallback: (button?: ButtonString) => void
    selectedButton?: ButtonString,
    openUpwards?: boolean,

    showContextMenu: (
        xPosition: number, yPosition:number,
        buttons: readonly ButtonString[],
        onPressCallback: (button?:ButtonString) => void,
        selectedButton?: ButtonString,
        openUpwards?: boolean
    ) => void

    hideContextMenu: () => void,
    updateSelectedInternal: (button?: ButtonString) => void
}


const useButtonContextMenuState_Internal = create<ButtonContextMenuState>()((set) => ({
    xPosition: 0,
    yPosition: 0,
    display: false,
    buttons: [],
    openUpwards: false,
    onPressCallback: () => {},

    showContextMenu: (xPosition, yPosition, buttons, onPressCallback, selectedButton, openUpwards) => {
        set({display: true, xPosition, yPosition, buttons, onPressCallback, selectedButton, openUpwards})
    },

    hideContextMenu: () => {
        set({display: false})
    },

    updateSelectedInternal: (button) => {
        set({selectedButton: button})
    }
}))


export const useButtonPickerContextMenu = () => {
    const showMenuInternal = useButtonContextMenuState_Internal(e => e.showContextMenu);
    return showMenuInternal
}

const ButtonPickerContextMenu = () => {
    const {
        display: contextMenuVisibility,
        buttons,
        xPosition, yPosition,
        selectedButton,
        onPressCallback: userOnPressCallback,
        updateSelectedInternal,
        openUpwards
    } = useButtonContextMenuState_Internal(e => e)

    const onButtonPress = useCallback((button?: ButtonString) => {
        userOnPressCallback(button)
        updateSelectedInternal(button)
    }, [userOnPressCallback])

    const hideContextMenu = useButtonContextMenuState_Internal(e => e.hideContextMenu)

    const onRightclick = useCallback((ev: React.MouseEvent) => {
        hideContextMenu();
        ev.preventDefault();
    }, [hideContextMenu])

    const deltaXPos = openUpwards ? 150 : 0;
    const deltaYPos = openUpwards ? 300 : 0;

    return (
        <div
            className="button-context-menu-wrapper"
            onClick={hideContextMenu} onContextMenu={onRightclick}
            style={{display: contextMenuVisibility ? "" : "none" }}
        >
            <div
                className="button-context-menu"
                style={{left: xPosition - deltaXPos, top: yPosition - deltaYPos}}
                onClick={(ev) => { ev.stopPropagation()}}
            >
                <div className="button-context-menu-title">Edit Mapping</div>
                <div className={`paddlemapper-context-menu-mapping-none ${selectedButton === undefined ? "selected" : ""}`}
                onClick={() => {userOnPressCallback(undefined)}}>
                    No Mapping
                </div>
                {buttons.map(e =>
                    <div key={e} className={`button-context-entry ${selectedButton === e ? "selected" : ""}`} onClick={() => {onButtonPress(e)}}>
                        <img src={`/buttonicons/XboxOne_${ButtonToImage[e]}.png`} className="responsive-image" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ButtonPickerContextMenu
