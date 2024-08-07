import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import "./SpellEntrycard.scss"
import { useCallback } from "react";
import { useSpellEntryContextMenu } from "./SpellEntryCardContextMenu";


export type SpellEntryCardProps = {
    spellName: string,
}

const SpellEntryCard = ({spellName}: SpellEntryCardProps) =>{
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: spellName});

    const showContextMenu = useSpellEntryContextMenu(e => e.showContextMenu);

    const onRightClick = useCallback((ev: React.MouseEvent) => {
        showContextMenu(ev.pageX, ev.pageY);
        ev.preventDefault();
    }, [showContextMenu])

    return (
        <div className="spell-entry"
            ref={setNodeRef}
            onContextMenu={onRightClick}
            style={{transform: CSS.Transform.toString(transform), transition: transition}} {...attributes} {...listeners}
        >
            <div className="buttoncombo-wrapper">
                <img src="/buttonicons/XboxOne_LT.png" className="responsive-image"></img>
                +
                <img src="/buttonicons/XboxOne_A.png" className="responsive-image"></img>
            </div>

            <div className="spacing"></div>
            <div className="image-wrapper">
                <img src="/sample_spell.png" className="responsive-image"></img>
            </div>

            <div className="text-wrapper">
                {spellName}
            </div>
        </div>
    )
}


export default SpellEntryCard;