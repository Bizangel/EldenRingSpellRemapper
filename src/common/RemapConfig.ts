import { create } from "zustand";
import { produce } from 'immer'
import { ButtonString } from "./Buttons";
import { createJSONStorage, persist } from "zustand/middleware";

export type SpellMapping = {
    id: string;
    buttonCombo: ButtonString;
}

// contains all application global state
export type EldenRingRemapperConfig = {
    miscConfig: {
        pollingDelay: number
    },
    spells : SpellMapping[],
    currentModifier: ButtonString,
}

export type EldenRingRemapperStore = {
    config: EldenRingRemapperConfig,

    reorderSpell: (spell1: string, spell2: string) => void,
    remapSpell: (spell: string, mapping: ButtonString) => void,
}

export const useRemapper = create<EldenRingRemapperStore>()(
    persist(
        (set, get) => ({
        config: {
            miscConfig: {
                pollingDelay: 10,
            },
            spells: [],
            currentModifier: "LT"
        },

        reorderSpell: (spell1, spell2) => {
            set(
                produce((state: EldenRingRemapperStore) => {
                    const i = state.config.spells.findIndex(e => e.id === spell1);
                    const j = state.config.spells.findIndex(e => e.id === spell2);
                    if (i != j && i > -1 && j > -1)
                        [state.config.spells[i], state.config.spells[j]] = [state.config.spells[j], state.config.spells[i]];
                })
            )
        },

        remapSpell: (spell, button) => {
            set(
                produce ((state: EldenRingRemapperStore) => {
                    const i = state.config.spells.findIndex(e => e.id === spell);
                    if (i > -1 && button != get().config.currentModifier)
                        state.config.spells[i].buttonCombo = button
                })
            )
        }
    }),
    {
        name: 'food-storage',
        storage: createJSONStorage(() => localStorage)
    }
    )
)


