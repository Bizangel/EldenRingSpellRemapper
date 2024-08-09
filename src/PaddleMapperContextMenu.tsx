import { create } from "zustand"
import "./PaddleMapperContextMenu.scss"
import { useCallback } from "react"
import { ButtonList, ButtonString, ButtonToImage } from "./common/Buttons"
import { useRemapper } from "./common/RemapConfig"


interface PaddleMapperContextMenuState {
    xPosition: number,
    yPosition: number,
    display: boolean,
    currentPaddle: number,

    showContextMenu: (xPosition: number, yPosition:number, selectedPaddle: number) => void
    hideContextMenu: () => void
}


export const usePaddleMapperContextMenu = create<PaddleMapperContextMenuState>()((set) => ({
    xPosition: 0,
    yPosition: 0,
    display: false,
    currentPaddle: 0,

    showContextMenu: (xPosition: number, yPosition: number, paddle: number) => {
        set({display: true, xPosition, yPosition, currentPaddle: paddle})
    },

    hideContextMenu: () => {
        set({display: false})
    }
}))


const PaddleMapperContextMenu = () => {
    const {
        hideContextMenu,
        display: contextMenuVisibility,
        xPosition, yPosition ,
        currentPaddle
    } = usePaddleMapperContextMenu(e => e);

    const paddleMapping = useRemapper(e => e.config.paddleMapping);
    const rebindPaddle = useRemapper(e => e.setPaddleMapping);

    const currentMapping = paddleMapping[currentPaddle];

    const onButtonMappingClick = useCallback((button?: ButtonString) => {
        rebindPaddle(currentPaddle, button);
    }, [currentPaddle, rebindPaddle])

    const onRightclick = useCallback((ev: React.MouseEvent) => {
        hideContextMenu();
        ev.preventDefault();
    }, [hideContextMenu])

    const removeMapping = useCallback(() => {
        rebindPaddle(currentPaddle, undefined);
    }, [currentPaddle, rebindPaddle])

    return (
        <div className="paddlemapper-context-menu-wrapper"
        onClick={hideContextMenu} onContextMenu={onRightclick} style={{display: contextMenuVisibility ? "" : "none" }}>
            <div className="paddlemapper-context-menu" style={{left: xPosition - 150, top: yPosition - 300}} onClick={(ev) => { ev.stopPropagation()}}>
                <div className="paddlemapper-context-menu-title">Edit Mapping</div>
                <div className={`paddlemapper-context-menu-mapping-none ${currentMapping === undefined ? "selected" : ""}`}
                onClick={removeMapping}>
                    No Mapping
                </div>
                {ButtonList.filter(e => !["P1", "P2","P3","P4"].includes(e)).map(e =>
                    <div key={e} className={`paddlemapper-button-context-entry ${ e == currentMapping ? "selected" : ""}`} onClick={() => {onButtonMappingClick(e)}}>
                        <img src={`/buttonicons/XboxOne_${ButtonToImage[e]}.png`} className="responsive-image" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PaddleMapperContextMenu;