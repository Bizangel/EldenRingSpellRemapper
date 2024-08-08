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
}

export const useRemapper = create<EldenRingRemapperStore>()(
    persist(
        (set) => ({
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
                    const i = state.config.spells.findIndex(e => e.id == spell1);
                    const j = state.config.spells.findIndex(e => e.id == spell2);
                    if (i != j && i > -1 && j > -1)
                        [state.config.spells[i], state.config.spells[j]] = [state.config.spells[j], state.config.spells[i]];
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


