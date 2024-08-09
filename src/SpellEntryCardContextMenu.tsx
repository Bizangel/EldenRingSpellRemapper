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

    const removeMapping = useCallback(() => {
        rebindSpell(currentSpell, undefined);
    }, [currentSpell, rebindSpell])

    return (
        <div className="spellentry-context-menu-wrapper"
        onClick={hideContextMenu} onContextMenu={onRightclick} style={{display: contextMenuVisibility ? "" : "none" }}>
            <div className="spellentry-context-menu" style={{left: xPosition, top: yPosition}} onClick={(ev) => { ev.stopPropagation()}}>
                <div className="spellentry-context-menu-title">Edit Mapping</div>
                <div className={`spellentry-context-menu-mapping-none ${currentMapping === undefined ? "selected" : ""}`}
                onClick={removeMapping}>
                    No Mapping
                </div>
                {ButtonList.filter(e => e != currentModifier).map(e =>
                    <div key={e} className={`spellentry-button-context ${ e == currentMapping ? "selected" : ""}`} onClick={() => {onButtonMappingClick(e)}}>
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