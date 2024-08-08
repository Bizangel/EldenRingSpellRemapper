import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useCallback } from "react";
import SpellEntryCard from "./SpellEntryCard";
import { useRemapper } from "./common/RemapConfig";

const Spellbar = () => {
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));
    const spells = useRemapper(e => e.config.spells)
    const reorderSpell = useRemapper(e => e.reorderSpell)

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (over !== null && active.id !== over.id ) {
            reorderSpell(active.id as string, over.id as string);
        }
    }, [reorderSpell])

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={spells}
                strategy={horizontalListSortingStrategy}
            >
                {spells.map(spell => <SpellEntryCard key={spell.id} {...spell} />)}
            </SortableContext>
        </DndContext>
    )
}

export default Spellbar;