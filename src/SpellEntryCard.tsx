import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import "./SpellEntrycard.scss"


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

    return (
        <div className="spell-entry"
            ref={setNodeRef}
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