import { create } from "zustand"
import "./SpellEntryCardContextMenu.scss"
import { useCallback } from "react"
import { ButtonList, ButtonToImage } from "./common/Buttons"


interface SpellEntryCardContextMenuState {
    xPosition: number,
    yPosition: number,
    display: boolean,

    showContextMenu: (xPosition: number, yPosition:number) => void
    hideContextMenu: () => void
}


export const useSpellEntryContextMenu = create<SpellEntryCardContextMenuState>((set) => ({
    xPosition: 0,
    yPosition: 0,
    display: false,

    showContextMenu: (xPosition: number, yPosition: number) => {
        set({display: true, xPosition, yPosition})
    },

    hideContextMenu: () => {
        set({display: false})
    }
}))


const SpellEntryCardContextMenu = () => {
    const hideContextMenu = useSpellEntryContextMenu(e => e.hideContextMenu);
    const contextMenuVisibility = useSpellEntryContextMenu(e => e.display);
    const menuXPos = useSpellEntryContextMenu(e => e.xPosition);
    const menuYPos = useSpellEntryContextMenu(e => e.yPosition);

    const onRightclick = useCallback((ev: React.MouseEvent) => {
        hideContextMenu();
        ev.preventDefault();
    }, [hideContextMenu])

    return (
        <div className="spellentry-context-menu-wrapper"
        onClick={hideContextMenu} onContextMenu={onRightclick} style={{display: contextMenuVisibility ? "" : "none" }}>
            <div className="spellentry-context-menu" style={{left: menuXPos, top: menuYPos}}>
                <button className="context-menu-button">Edit Mapping</button>
                {ButtonList.map(e =>
                    <div key={e} className="button-context-entry">
                        <img src={`/buttonicons/XboxOne_${ButtonToImage[e]}.png`} className="responsive-image" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default SpellEntryCardContextMenu;