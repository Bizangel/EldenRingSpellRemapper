import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useCallback, useState } from "react";
import SpellEntryCard from "./SpellEntryCard";

type SpellEntry = {
    id: string,
}

const Spellbar = () => {
    const sensors = useSensors(useSensor(PointerSensor));
    const [spellEntries, setSpellEntries] = useState<SpellEntry[]>([
        {
            id: "Frenzied Flame of the Fell God",
        },
        {
            id: "Glintstone Moon",
        }
    ]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (over !== null && active.id !== over.id ) {
            setSpellEntries((spells) => {
                const oldIndex = spells.findIndex(e => e.id == active.id);
                const newIndex = spells.findIndex(e => e.id == over.id);
                return arrayMove(spells, oldIndex, newIndex);
            });
        }
    }, [])

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={spellEntries}
                strategy={horizontalListSortingStrategy}
            >
                {spellEntries.map(spell => <SpellEntryCard key={spell.id} spellName={spell.id} />)}
            </SortableContext>
        </DndContext>
    )
}

export default Spellbar;