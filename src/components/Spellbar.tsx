import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { useCallback, useRef, useState } from "react";
import {CSS} from '@dnd-kit/utilities';
import './Spellbar.scss'
import thrashIcon from "../assets/trash.svg"
import { useSpellEntryContextMenu } from "../SpellEntryCardContextMenu";
import SpellEntryCard from "./SpellEntryCard";
import { SpellMapping, useRemapper } from "../common/RemapConfig";
import draggableCollisionWithThrashArea from "../common/DraggableCollisionWithThrashArea";

function DroppableThrashExample({isDragActive} : {isDragActive: boolean}) {
    const {setNodeRef, isOver} = useDroppable({
      id: 'delete-spell-droparea',
    });
    return (
      <div ref={setNodeRef}
        style={{opacity: isDragActive ? 1 : 0}}
        className={`delete-spell-area ${isOver ? "over" : ""}`}>
        <img src={thrashIcon} className="responsive-image"/>
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
            cursor: "grab",
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
                <DroppableThrashExample isDragActive={activeDragId !== null} />
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