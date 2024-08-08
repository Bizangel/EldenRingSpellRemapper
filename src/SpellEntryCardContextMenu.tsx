import { create } from "zustand"
import "./SpellEntryCardContextMenu.scss"
import { useCallback } from "react"
import { ButtonList, ButtonString, ButtonToImage } from "./common/Buttons"
import { useRemapper } from "./common/RemapConfig"


interface SpellEntryCardContextMenuState {
    xPosition: number,
    yPosition: number,
    display: boolean,
    currentSpell: string,

    showContextMenu: (xPosition: number, yPosition:number, selectedCard: string) => void
    hideContextMenu: () => void
}


export const useSpellEntryContextMenu = create<SpellEntryCardContextMenuState>()((set) => ({
    xPosition: 0,
    yPosition: 0,
    display: false,
    currentSpell: "",

    showContextMenu: (xPosition: number, yPosition: number, selectedCard: string) => {
        set({display: true, xPosition, yPosition, currentSpell: selectedCard})
    },

    hideContextMenu: () => {
        set({display: false})
    }
}))


const SpellEntryCardContextMenu = () => {
    const {
        hideContextMenu,
        display: contextMenuVisibility,
        xPosition, yPosition ,
        currentSpell }
    = useSpellEntryContextMenu(e => e);

    const spells = useRemapper(e => e.config.spells);
    const currentModifier = useRemapper(e => e.config.currentModifier);
    const rebindSpell = useRemapper(e => e.remapSpell);
    const currentMapping = spells[spells.findIndex(e => e.id == currentSpell )]?.buttonCombo;

    const onButtonMappingClick = useCallback((button: ButtonString) => {
        rebindSpell(currentSpell, button);
    }, [currentSpell, rebindSpell])

    const onRightclick = useCallback((ev: React.MouseEvent) => {
        hideContextMenu();
        ev.preventDefault();
    }, [hideContextMenu])

    return (
        <div className="spellentry-context-menu-wrapper"
        onClick={hideContextMenu} onContextMenu={onRightclick} style={{display: contextMenuVisibility ? "" : "none" }}>
            <div className="spellentry-context-menu" style={{left: xPosition, top: yPosition}}>
                <div className="context-menu-title">Edit Mapping</div>
                {ButtonList.filter(e => e != currentModifier).map(e =>
                    <div key={e} className={`button-context-entry ${ e == currentMapping ? "selected" : ""}`} onClick={() => {onButtonMappingClick(e)}}>
                        <img src={`/buttonicons/XboxOne_${ButtonToImage[currentModifier]}.png`} className="responsive-image" />
                        +
                        <img src={`/buttonicons/XboxOne_${ButtonToImage[e]}.png`} className="responsive-image" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default SpellEntryCardContextMenu;