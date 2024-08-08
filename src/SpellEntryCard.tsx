import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import "./SpellEntrycard.scss"
import { useCallback } from "react";
import { useSpellEntryContextMenu } from "./SpellEntryCardContextMenu";
import { SpellMapping, useRemapper } from "./common/RemapConfig";
import { ButtonToImage } from "./common/Buttons";

const SpellEntryCard = ({id, buttonCombo}: SpellMapping) =>{
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: id});

    const currentModifier = useRemapper(e => e.config.currentModifier);
    const showContextMenu = useSpellEntryContextMenu(e => e.showContextMenu);

    const onRightClick = useCallback((ev: React.MouseEvent) => {
        showContextMenu(ev.pageX, ev.pageY, id);
        ev.preventDefault();
    }, [showContextMenu])

    return (
        <div className="spell-entry"
            ref={setNodeRef}
            onContextMenu={onRightClick}
            style={{transform: CSS.Transform.toString(transform), transition: transition}} {...attributes} {...listeners}
        >
            <div className="buttoncombo-wrapper">
                <img src={`/buttonicons/XboxOne_${ButtonToImage[currentModifier]}.png`} className="responsive-image"></img>
                +
                <img src={`/buttonicons/XboxOne_${ButtonToImage[buttonCombo]}.png`} className="responsive-image"></img>
            </div>

            <div className="spacing"></div>
            <div className="image-wrapper">
                <img src="/sample_spell.png" className="responsive-image"></img>
            </div>

            <div className="text-wrapper">
                {id}
            </div>
        </div>
    )
}


export default SpellEntryCard;