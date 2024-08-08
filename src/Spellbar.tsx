import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { useCallback, useState } from "react";
import {CSS} from '@dnd-kit/utilities';
import SpellEntryCard from "./SpellEntryCard";
import { SpellMapping, useRemapper } from "./common/RemapConfig";
import './Spellbar.scss'
import { useSpellEntryContextMenu } from "./SpellEntryCardContextMenu";
import draggableCollisionWithThrashArea from "./common/DraggableCollisionWithThrashArea";

function DroppableThrashExample() {
    const {setNodeRef, isOver} = useDroppable({
      id: 'delete-spell-droparea',
    });

    return (
      <div ref={setNodeRef} style={{backgroundColor: isOver ? "red" : ""}}>
        i am thrash
      </div>
    );
}

function DraggableSpellEntryCard({activeDragId, ...props}: SpellMapping & {activeDragId: string | number | null}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});

    const showContextMenu = useSpellEntryContextMenu(e => e.showContextMenu);
    const onRightClick = useCallback((ev: React.MouseEvent) => {
        showContextMenu(ev.pageX, ev.pageY, props.id);
        ev.preventDefault();
    }, [showContextMenu, props.id])

    return (
        <div
        onContextMenu={onRightClick}
        ref={setNodeRef}
        style={
            {transform: CSS.Transform.toString(transform), transition: transition,
            opacity: activeDragId === props.id ? 0 : 1} // display as hidden if currently dragging
        }
        {...attributes} {...listeners}>
            <SpellEntryCard {...props}/>
        </div>
    );
}

const Spellbar = () => {
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));
    const spells = useRemapper(e => e.config.spells)
    const reorderSpell = useRemapper(e => e.reorderSpell)
    const [activeDragId, setActiveDragId] = useState<string | number | null>(null)
    const draggingSpell = spells.find((spell) => spell.id === activeDragId)

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        console.log(over?.id)
        if (over !== null && active.id !== over.id ) {
            reorderSpell(active.id as string, over.id as string);
        }

        setActiveDragId(null);
    }, [reorderSpell, setActiveDragId])

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveDragId(event.active.id)
    }, [setActiveDragId])

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={draggableCollisionWithThrashArea}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <div className="spellbar">
                <div className="spellbar-spells">
                    <SortableContext
                        items={spells}
                        strategy={horizontalListSortingStrategy}
                    >
                        {spells.map(spell => <DraggableSpellEntryCard key={spell.id} activeDragId={activeDragId} {...spell} />)}
                    </SortableContext>
                </div>
                <DroppableThrashExample/>
            </div>

            <DragOverlay>
                {activeDragId && draggingSpell ? (
                    <SpellEntryCard {...draggingSpell} />
                ): null}
            </DragOverlay>
        </DndContext>
    )
}

export default Spellbar;