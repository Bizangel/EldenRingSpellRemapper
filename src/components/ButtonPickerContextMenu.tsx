import { useCallback } from "react";
import { ButtonString, ButtonToImage } from "../common/Buttons"
import { create } from "zustand";

interface ButtonContextMenuState {
    xPosition: number,
    yPosition: number,
    display: boolean,
    buttons: readonly ButtonString[]
    onPressCallback: (button?: ButtonString) => void

    showContextMenu: (
        xPosition: number, yPosition:number,
        buttons: readonly ButtonString[],
        onPressCallback: (button?:ButtonString) => void
    ) => void

    hideContextMenu: () => void
}


export const useButtonContextMenuState_Internal = create<ButtonContextMenuState>()((set) => ({
    xPosition: 0,
    yPosition: 0,
    display: false,
    buttons: [],
    onPressCallback: () => {},

    showContextMenu: (xPosition, yPosition, buttons, onPressCallback) => {
        set({display: true, xPosition, yPosition, buttons, onPressCallback})
    },

    hideContextMenu: () => {
        set({display: false})
    }
}))


export const useButtonPickerContextMenu = () => {
    const showMenuInternal = useButtonContextMenuState_Internal(e => e.showContextMenu);
    return showMenuInternal
}

const ButtonPickerContextMenu = () => {
    const contextMenuVisibility = useButtonContextMenuState_Internal(e => e.display)
    const buttons = useButtonContextMenuState_Internal(e => e.buttons)
    const xPosition = useButtonContextMenuState_Internal(e => e.xPosition)
    const yPosition = useButtonContextMenuState_Internal(e => e.yPosition)
    const onPressCallback = useButtonContextMenuState_Internal(e => e.onPressCallback);

    const hideContextMenu = useButtonContextMenuState_Internal(e => e.hideContextMenu)

    const onRightclick = useCallback((ev: React.MouseEvent) => {
        hideContextMenu();
        ev.preventDefault();
    }, [hideContextMenu])

    return (
        <div className="paddlemapper-context-menu-wrapper"
        onClick={hideContextMenu} onContextMenu={onRightclick} style={{display: contextMenuVisibility ? "" : "none" }}>
            <div className="paddlemapper-context-menu" style={{left: xPosition - 150, top: yPosition - 300}} onClick={(ev) => { ev.stopPropagation()}}>
                <div className="paddlemapper-context-menu-title">Edit Mapping</div>
                <div className={`paddlemapper-context-menu-mapping-none}`}
                onClick={() => {onPressCallback(undefined)}}>
                    No Mapping
                </div>
                {buttons.map(e =>
                    <div key={e} className={`paddlemapper-button-context-entry`} onClick={() => {onPressCallback(e)}}>
                        <img src={`/buttonicons/XboxOne_${ButtonToImage[e]}.png`} className="responsive-image" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ButtonPickerContextMenu
