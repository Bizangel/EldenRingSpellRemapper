import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useCallback, useRef, useState } from "react";
import SpellEntryCard from "./SpellEntryCard";
import {  useRemapper } from "../common/RemapConfig";
import draggableCollisionWithThrashArea from "../common/DraggableCollisionWithThrashArea";
import DraggableSpellEntryCard from "./DraggableSpellEntryCard";
import DroppableThrashArea from "./DroppableThrashArea";
import './Spellbar.scss'

const Spellbar = () => {
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));
    const spells = useRemapper(e => e.config.spells)
    const reorderSpell = useRemapper(e => e.reorderSpell)
    const deleteSpell = useRemapper(e => e.deleteSpell)
    const [activeDragId, setActiveDragId] = useState<string | number | null>(null)
    const draggingSpell = spells.find((spell) => spell.id === activeDragId)
    const scrollSpellsRef = useRef<HTMLDivElement>(null);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (over !== null && active.id !== over.id ) {
            reorderSpell(active.id as string, over.id as string);
        }

        if (over !== null && over.id === 'delete-spell-droparea') {
            deleteSpell(active.id as string)
        }

        setActiveDragId(null);
    }, [reorderSpell, setActiveDragId, deleteSpell])

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveDragId(event.active.id)
    }, [setActiveDragId])

    const onScroll = useCallback((ev: React.WheelEvent<HTMLDivElement>) => {
        if (scrollSpellsRef.current)
            scrollSpellsRef.current.scrollBy({top: 0, left: ev.deltaY, behavior: "instant"})
    }, [])

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={draggableCollisionWithThrashArea}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <div className="spellbar">
                <div className="spellbar-spells" ref={scrollSpellsRef} onWheel={onScroll}>
                    <SortableContext
                        items={spells}
                        strategy={horizontalListSortingStrategy}
                    >
                        {spells.map(spell => <DraggableSpellEntryCard key={spell.id} activeDragId={activeDragId} {...spell} />)}
                    </SortableContext>
                </div>
                <DroppableThrashArea isDragActive={activeDragId !== null} />
            </div>

            <DragOverlay>
                {activeDragId && draggingSpell ? (
                    <SpellEntryCard isBeingDragged={true} {...draggingSpell} />
                ): null}
            </DragOverlay>
        </DndContext>
    )
}

export default Spellbar;