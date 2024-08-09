import { useSortable } from "@dnd-kit/sortable";
import SpellEntryCard from "./SpellEntryCard";
import {CSS} from '@dnd-kit/utilities';
import { SpellMapping, useRemapper } from "../common/RemapConfig";
import { useButtonPickerContextMenu } from "./ButtonPickerContextMenu";
import { useCallback } from "react";
import { ButtonList, ButtonString } from "../common/Buttons";

function DraggableSpellEntryCard({activeDragId, ...props}: SpellMapping & {activeDragId: string | number | null}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});


    const showContextMenu = useButtonPickerContextMenu();
    const spells = useRemapper(e => e.config.spells);
    const rebindSpell = useRemapper(e => e.remapSpell);
    const currentModifier = useRemapper(e => e.config.currentModifier);
    const currentMapping = spells[spells.findIndex(e => e.id == props.id )]?.buttonCombo;

    const onRemapPress = useCallback((button?: ButtonString) => {
        rebindSpell(props.id, button)
    }, [rebindSpell, props.id])

    const onRightClick = useCallback((ev: React.MouseEvent) => {
        showContextMenu(ev.pageX, ev.pageY,
            ButtonList.filter(e => e !== currentModifier), // exclude current modifier
            onRemapPress,
            currentMapping,
            false // open downwards
        );

        ev.preventDefault();
    }, [showContextMenu, props.id])

    return (
        <div
        onContextMenu={onRightClick}
        ref={setNodeRef}
        style={
            {transform: CSS.Transform.toString(transform), transition: transition,
            cursor: "grab",
            opacity: activeDragId === props.id ? 0 : 1} // display as hidden if currently dragging
        }
        {...attributes} {...listeners}>
            <SpellEntryCard {...props}/>
        </div>
    );
}

export default DraggableSpellEntryCard;